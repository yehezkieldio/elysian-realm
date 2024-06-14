/**
 * This is the entry point of your application.
 */

import { auth } from "@/modules/(auth)";
import { helloWorld } from "@/modules/(hello)/world";
import { user } from "@/modules/(user)";
import Elysia from "elysia";

const api = new Elysia();

api.get("/", () => {
    return {
        message: "Hello, World!",
    };
});

api.use(helloWorld);

api.use(user);
api.use(auth);

api.listen(3000, () => {
    console.log("Server is running on port 3000");
});
