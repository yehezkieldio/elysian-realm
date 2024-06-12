import Elysia from "elysia";

const api = new Elysia();

api.get("/", () => {
    return {
        message: "Hello, World!",
    };
});

api.listen(3000, () => {
    console.log("Server is running on port 3000");
});
