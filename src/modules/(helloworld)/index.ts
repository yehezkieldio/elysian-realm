/**
 * Controller for the Hello World module.
 * This is the entry point of your module, and it is responsible for defining the routes and handling the requests.
 */

import Elysia from "elysia";

export const helloWorld = new Elysia().group("/helloworld", (app) =>
    app.get("/", () => {
        return {
            message: "Hello World from the Hello World module!",
        };
    }),
);
