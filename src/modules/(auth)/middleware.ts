/**
 * This middleware is responsible for authenticating users and verifying their access tokens.
 */

import { db } from "@/db/connection";
import { accounts, users } from "@/db/schema";
import { env } from "@/env";
import jwt from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import type Elysia from "elysia";
import { InternalServerError } from "elysia";

export const authMiddleware = (app: Elysia) =>
    app
        .decorate("db", db)
        .use(
            jwt({
                name: "jwt",
                secret: env.JWT_SECRET,
            }),
        )
        .derive(async ({ jwt, db, cookie: { accessToken }, set }) => {
            if (!accessToken) {
                set.status = "Unauthorized";
                throw new InternalServerError("Access token is missing");
            }

            const jwtPayload = await jwt.verify(accessToken.value);
            if (!jwtPayload) {
                set.status = "Forbidden";
                throw new InternalServerError("Invalid access token");
            }

            const account = await db.query.accounts.findFirst({
                where: eq(accounts.userId, jwtPayload.sub as string),
            });

            if (!account) {
                set.status = "Forbidden";
                throw new InternalServerError("Access token is invalid");
            }

            if (jwtPayload.exp && jwtPayload.exp < Date.now() / 1000) {
                set.status = "Forbidden";
                throw new InternalServerError("Access token has expired");
            }

            const user = await db.query.users.findFirst({
                where: eq(users.id, jwtPayload.sub as string),
            });

            if (!user) {
                set.status = "Forbidden";
                throw new InternalServerError("User not found");
            }

            return {
                user,
            };
        });
