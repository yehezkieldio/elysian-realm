/**
 * Overall schema of the database.
 */

import { cuid2 } from "drizzle-cuid2/postgres";
import { pgTable, pgTableCreator, text, uniqueIndex, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `elysia-boilerplate_${name}`);

export const users = pgTable(
    "user",
    {
        id: cuid2("id").defaultRandom().primaryKey(),
        username: varchar("username").notNull(),
        password: text("password").notNull(),
    },
    (user) => ({
        usernameUidx: uniqueIndex("user_username_uidx").on(user.username),
    }),
);
