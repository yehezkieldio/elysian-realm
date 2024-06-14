import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";
import jwt from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import type Elysia from "elysia";

/**
 * Derived Elysia context to check the user's authentication.
 */
export const authPlugin = (app: Elysia) =>
    app
        .use(
            jwt({
                name: "jwt",
                secret: env.JWT_SECRET,
            }),
        )
        .derive(async ({ jwt, cookie: { accessToken }, set }) => {
            if (!accessToken.value) {
                set.status = "Unauthorized";
                throw new Error("Access token is missing!");
            }

            const jwtPayload = await jwt.verify(accessToken.value);
            if (!jwtPayload) {
                set.status = "Forbidden";
                throw new Error("Access token is invalid");
            }

            const userId: string = jwtPayload.sub as string;
            const user = await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: {
                    password: false,
                },
            });
            if (!user) {
                set.status = "Unauthorized";
                throw new Error("User not found");
            }

            return {
                user,
            };
        });
