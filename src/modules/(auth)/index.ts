/**
 * Controller for the Authentication and Authorization module.
 * This is the entry point of your module, and it is responsible for defining the routes and handling the requests.
 */

import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { env } from "@/env";
import { authPlugin } from "@/modules/(auth)/plugin";
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from "@/utils/const";
import { getExpTimestamp } from "@/utils/exp";
import jwt from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { Elysia, error, t } from "elysia";

export const auth = new Elysia().group("/auth", (app) =>
    app
        .use(
            jwt({
                name: "jwt",
                secret: env.JWT_SECRET,
            }),
        )
        .post(
            "/signin",
            async ({ body, jwt, cookie: { accessToken, refreshToken }, set }) => {
                const user = await db.query.users.findFirst({
                    where: eq(users.username, body.username),
                });
                if (!user) return error(404, "User not found");

                const matchPassword = await Bun.password.verify(body.password, user.password, "bcrypt");
                if (!matchPassword) return error(401, "Invalid password");

                const jwtAccessToken = await jwt.sign({
                    sub: user.id,
                    exp: getExpTimestamp(ACCESS_TOKEN_EXPIRATION),
                });

                accessToken.set({
                    value: jwtAccessToken,
                    httpOnly: true,
                    maxAge: ACCESS_TOKEN_EXPIRATION,
                    path: "/",
                });

                const jwtRefreshToken = await jwt.sign({
                    sub: user.id,
                    exp: getExpTimestamp(REFRESH_TOKEN_EXPIRATION),
                });

                refreshToken.set({
                    value: jwtRefreshToken,
                    httpOnly: true,
                    maxAge: REFRESH_TOKEN_EXPIRATION,
                    path: "/",
                });

                return {
                    message: "Sign-in successfully!",
                    data: {
                        user: {
                            id: user.id,
                            username: user.username,
                        },
                        accessToken: jwtAccessToken,
                        refreshToken: jwtRefreshToken,
                    },
                };
            },
            {
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                }),
            },
        )
        .post(
            "/signup",
            async ({ body }) => {
                const password = await Bun.password.hash(body.password, {
                    algorithm: "bcrypt",
                    cost: 10,
                });

                if (
                    await db.query.users.findFirst({
                        where: eq(users.username, body.username),
                    })
                ) {
                    return error(409, "Username already exists");
                }

                await db.insert(users).values({
                    username: body.username,
                    password,
                });

                return {
                    message: "Sign-up successfully!",
                };
            },
            {
                body: t.Object({
                    username: t.String(),
                    password: t.String(),
                }),
            },
        )
        .use(authPlugin)
        .post("/refresh", async ({ cookie: { accessToken, refreshToken }, jwt, set }) => {
            if (!refreshToken.value) return error(401, "Refresh token is missing");

            const jwtPayload = await jwt.verify(refreshToken.value);
            if (!jwtPayload) return error(403, "Refresh token is invalid");

            const userId: string = jwtPayload.sub as string;
            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
            });
            if (!user) return error(401, "User not found");

            const jwtAccessToken = await jwt.sign({
                sub: user.id,
                exp: getExpTimestamp(ACCESS_TOKEN_EXPIRATION),
            });
            accessToken.set({
                value: jwtAccessToken,
                httpOnly: true,
                maxAge: ACCESS_TOKEN_EXPIRATION,
                path: "/",
            });

            const jwtRefreshToken = await jwt.sign({
                sub: user.id,
                exp: getExpTimestamp(REFRESH_TOKEN_EXPIRATION),
            });
            refreshToken.set({
                value: jwtRefreshToken,
                httpOnly: true,
                maxAge: REFRESH_TOKEN_EXPIRATION,
                path: "/",
            });

            await db
                .update(accounts)
                .set({
                    refreshToken: jwtRefreshToken,
                })
                .where(eq(accounts.userId, user.id));

            return {
                message: "Refresh token successfully",
                data: {
                    accessToken: jwtAccessToken,
                    refreshToken: jwtRefreshToken,
                },
            };
        })
        .post("/signout", async ({ cookie: { accessToken, refreshToken }, user }) => {
            accessToken.remove();
            refreshToken.remove();

            await db.delete(accounts).where(eq(accounts.userId, user.id));

            return {
                message: "Logout successfully",
            };
        })
        .get("/me", async ({ user }) => {
            return {
                message: "User data retrieved successfully",
                data: {
                    user,
                },
            };
        }),
);
