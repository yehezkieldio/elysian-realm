/**
 * This is the entry point of your application.
 */

import { helloWorld } from "@/modules/(hello)/world";
import Elysia from "elysia";

const api = new Elysia();

api.get("/", () => {
    return {
        message: "Hello, World!",
    };
});

api.use(helloWorld);

api.listen(3000, () => {
    console.log("Server is running on port 3000");
});
