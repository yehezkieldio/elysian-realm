/**
 * This module is responsible for handling user-related routes and logic.
 */

import { db } from "@/db/connection";
import { users } from "@/db/schema";
import { authMiddleware } from "@/modules/(auth)/middleware";
import { eq } from "drizzle-orm";
import Elysia, { InternalServerError, t } from "elysia";

const userModule = new Elysia({ name: "Module.User" });

/**
 * We define a schema for the user creation and update requests.
 * Elyisa uses Typebox internally to validate request bodies.
 *
 * @see https://elysiajs.com/validation/schema-type.html#body
 */

export const createUserSchema = t.Object(
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

export const updateUserSchema = t.Object(
    {
        username: t.String({
            error: "Username is required",
        }),
    },
    {
        additionalProperties: false,
    },
);

export const updateUserPasswordSchema = t.Object(
    {
        oldPassword: t.String({
            error: "Old password is required",
        }),
        newPassword: t.String({
            error: "New password is required",
        }),
    },
    {
        additionalProperties: false,
    },
);

/**
 * We asign the db connection to the user module's Elysia context.
 * This way, we can access the db connection from the user module.
 *
 * @see https://elysiajs.com/essential/context.html#decorate
 */
userModule.decorate("db", db).group("/users", (app) =>
    app
        // list all users
        .get("/", async ({ db }) => {
            const users = await db.query.users.findMany({
                columns: {
                    password: false,
                },
            });

            /**
             * We return the direct value from the query here.
             * Since we have a handler that remaps the response to a standard format.
             * We don't need to worry about it here.
             */
            return [...users];
        })
        // get user by id
        .get("/:id", async ({ db, params }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, params.id),
                columns: {
                    password: false,
                },
            });

            if (!user) throw new InternalServerError("User not found");

            return user;
        })
        // check for authenticated user
        .use(authMiddleware)
        // create user
        .post(
            "/",
            async ({ db, body }) => {
                const password = await Bun.password.hash(body.password, {
                    algorithm: "bcrypt",
                    cost: 10,
                });

                const existingUser = await db.query.users.findFirst({
                    where: eq(users.username, body.username),
                });
                if (existingUser) throw new InternalServerError("User already exists");

                await db.insert(users).values({
                    username: body.username,
                    password,
                });

                return {
                    message: "User created",
                };
            },
            {
                body: createUserSchema,
            },
        )
        // update user
        .put(
            "/:id",
            async ({ db, params, body }) => {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, params.id),
                });

                if (!user) throw new InternalServerError("User not found");

                await db
                    .update(users)
                    .set({
                        username: body.username,
                    })
                    .where(eq(users.id, params.id));

                return {
                    message: "User updated",
                };
            },
            {
                body: updateUserSchema,
            },
        )
        // update user password
        .put(
            "/:id/password",
            async ({ db, params, body }) => {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, params.id),
                });

                if (!user) throw new InternalServerError("User not found");

                const passwordMatch = await Bun.password.verify(body.oldPassword, user.password);
                if (!passwordMatch) throw new InternalServerError("Invalid password");

                const newPassword = await Bun.password.hash(body.newPassword, {
                    algorithm: "bcrypt",
                    cost: 10,
                });

                await db
                    .update(users)
                    .set({
                        password: newPassword,
                    })
                    .where(eq(users.id, params.id));

                return {
                    message: "Password updated",
                };
            },
            {
                body: updateUserPasswordSchema,
            },
        )
        // delete user
        .delete("/:id", async ({ db, params }) => {
            const user = await db.query.users.findFirst({
                where: eq(users.id, params.id),
            });

            if (!user) throw new InternalServerError("User not found");

            await db.delete(users).where(eq(users.id, params.id));

            return {
                message: "User deleted",
            };
        }),
);

export default userModule;
