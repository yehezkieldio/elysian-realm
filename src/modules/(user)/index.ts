import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Elysia, { error, t } from "elysia";

export const user = new Elysia().group("/user", (app) =>
    app.post(
        "/create",
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
    ),
);
