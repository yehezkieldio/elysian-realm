/**
 * This module is responsible for handling authentication-related routes and logic.
 */

import { db } from "@/db/connection";
import { accounts, users } from "@/db/schema";
import { env } from "@/env";
import { authMiddleware } from "@/modules/(auth)/middleware";
import { authUtil } from "@/modules/(auth)/util";
import jwt from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import Elysia, { InternalServerError, t } from "elysia";

const authModule = new Elysia({ name: "Module.Jwt" });

export const signInSchema = t.Object(
    {
        username: t.String({
            error: "Username is required",
        }),
        password: t.String({
            error: "Password is required",
        }),
    },
    {
        additionalProperties: false,
    },
);

authModule
    .decorate("util", authUtil)
    .decorate("db", db)
    .group("/auth", (app) =>
        app
            .use(
                jwt({
                    name: "jwt",
                    secret: env.JWT_SECRET,
                }),
            )
            // sign in
            .post(
                "/signin",
                async ({ body, jwt, cookie: { accessToken, refreshToken }, util }) => {
                    const user = await db.query.users.findFirst({
                        where: eq(users.username, body.username),
                    });

                    if (!user) throw new InternalServerError("User not found");

                    const passwordMatch = await Bun.password.verify(body.password, user.password, "bcrypt");
                    if (!passwordMatch) throw new InternalServerError("Invalid password");

                    const initialAccessToken = await jwt.sign({
                        sub: user.id,
                        iat: Math.floor(Date.now() / 1000),
                        exp: util.getExpTimestamp(util.ACCESS_TOKEN_EXPIRATION),
                    });

                    accessToken.set({
                        value: initialAccessToken,
                        httpOnly: true,
                        maxAge: util.ACCESS_TOKEN_EXPIRATION,
                        path: "/",
                    });

                    const initialRefreshToken = await jwt.sign({
                        sub: user.id,
                        exp: util.getExpTimestamp(util.REFRESH_TOKEN_EXPIRATION),
                        iat: Math.floor(Date.now() / 1000),
                        jti: util.generateUniqueIdentifier(),
                    });

                    refreshToken.set({
                        value: initialRefreshToken,
                        httpOnly: true,
                        maxAge: util.REFRESH_TOKEN_EXPIRATION,
                        path: "/",
                    });

                    const account = await db.query.accounts.findFirst({
                        where: eq(accounts.userId, user.id),
                    });

                    if (account) {
                        await db
                            .update(accounts)
                            .set({
                                refreshToken: initialRefreshToken,
                                accessToken: initialAccessToken,
                            })
                            .where(eq(accounts.userId, user.id));
                    } else {
                        await db.insert(accounts).values({
                            userId: user.id,
                            refreshToken: initialRefreshToken,
                            accessToken: initialAccessToken,
                        });
                    }

                    return {
                        message: "Sign in successful",
                        accessToken: initialAccessToken,
                        refreshToken: initialRefreshToken,
                    };
                },
                {
                    body: signInSchema,
                },
            )
            // check for authenticated user
            .use(authMiddleware)
            // refresh token
            .post("/refresh", async ({ cookie: { accessToken, refreshToken }, jwt, util }) => {
                if (!refreshToken.value) throw new InternalServerError("Refresh token not found");

                const jwtPayload = await jwt.verify(refreshToken.value);
                if (!jwtPayload) throw new InternalServerError("Invalid refresh token");

                const user = await db.query.users.findFirst({
                    where: eq(users.id, jwtPayload.sub as string),
                });

                if (!user) throw new InternalServerError("User not found");

                const newAccessToken = await jwt.sign({
                    sub: user.id,
                    iat: Math.floor(Date.now() / 1000),
                    exp: util.getExpTimestamp(util.ACCESS_TOKEN_EXPIRATION),
                });

                accessToken.set({
                    value: newAccessToken,
                    httpOnly: true,
                    maxAge: util.ACCESS_TOKEN_EXPIRATION,
                    path: "/",
                });

                const newRefreshToken = await jwt.sign({
                    sub: user.id,
                    exp: util.getExpTimestamp(util.REFRESH_TOKEN_EXPIRATION),
                    iat: Math.floor(Date.now() / 1000),
                    jti: util.generateUniqueIdentifier(),
                });

                refreshToken.set({
                    value: newRefreshToken,
                    httpOnly: true,
                    maxAge: util.REFRESH_TOKEN_EXPIRATION,
                    path: "/",
                });

                await db
                    .update(accounts)
                    .set({
                        refreshToken: newRefreshToken,
                        accessToken: newAccessToken,
                    })
                    .where(eq(accounts.userId, user.id));

                return {
                    message: "Token refreshed",
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                };
            })
            // sign out
            .post("/signout", async ({ cookie: { accessToken, refreshToken }, set }) => {
                accessToken.remove();
                refreshToken.remove();

                await db.delete(accounts).where(eq(accounts.accessToken, accessToken.value));

                return {
                    message: "Sign out successful",
                };
            }),
    );

export default authModule;
