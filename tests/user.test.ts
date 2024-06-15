import { createUserSchema, updateUserPasswordSchema, updateUserSchema } from "@/modules/(user)";
import { describe, expect, it } from "bun:test";
import { TypeCompiler } from "elysia/type-system";

describe("Module.User", () => {
    describe("createUserSchema", () => {
        it("validates a username and password are provided", () => {
            const user = {
                username: "testuser",
                password: "testpassword",
            };

            const validate = TypeCompiler.Compile(createUserSchema).Check(user);
            expect(validate).toBe(true);
        });

        it("throws an error if the username is missing", () => {
            const user = {
                password: "testpassword",
            };

            const validate = TypeCompiler.Compile(createUserSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if the password is missing", () => {
            const user = {
                username: "testuser",
            };

            const validate = TypeCompiler.Compile(createUserSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if the username and password are missing", () => {
            const user = {};

            const validate = TypeCompiler.Compile(createUserSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if additional properties are provided", () => {
            const user = {
                username: "testuser",
                password: "testpassword",
                email: "",
            };

            const validate = TypeCompiler.Compile(createUserSchema).Check(user);
            expect(validate).toBe(false);
        });
    });

    describe("updateUserSchema", () => {
        it("validates a username is provided", () => {
            const user = {
                username: "testuser",
            };

            const validate = TypeCompiler.Compile(updateUserSchema).Check(user);
            expect(validate).toBe(true);
        });

        it("throws an error if the username is missing", () => {
            const user = {};

            const validate = TypeCompiler.Compile(updateUserSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if additional properties are provided", () => {
            const user = {
                username: "testuser",
                email: "",
            };

            const validate = TypeCompiler.Compile(updateUserSchema).Check(user);
            expect(validate).toBe(false);
        });
    });

    describe("updateUserPasswordSchema", () => {
        it("validates an old password and new password are provided", () => {
            const user = {
                oldPassword: "testpassword",
                newPassword: "newpassword",
            };

            const validate = TypeCompiler.Compile(updateUserPasswordSchema).Check(user);
            expect(validate).toBe(true);
        });

        it("throws an error if the old password is missing", () => {
            const user = {
                newPassword: "newpassword",
            };

            const validate = TypeCompiler.Compile(updateUserPasswordSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if the new password is missing", () => {
            const user = {
                oldPassword: "testpassword",
            };

            const validate = TypeCompiler.Compile(updateUserPasswordSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if the old password and new password are missing", () => {
            const user = {};

            const validate = TypeCompiler.Compile(updateUserPasswordSchema).Check(user);
            expect(validate).toBe(false);
        });

        it("throws an error if additional properties are provided", () => {
            const user = {
                oldPassword: "testpassword",
                newPassword: "newpassword",
                email: "",
            };

            const validate = TypeCompiler.Compile(updateUserPasswordSchema).Check(user);
            expect(validate).toBe(false);
        });
    });
});
