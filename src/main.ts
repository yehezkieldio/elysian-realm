/**
 * Entrypoint to the application.
 * This file is responsible for bootstrapping the application.
 */

import authModule from "@/modules/(auth)";
import userModule from "@/modules/(user)";
import { hasMessage, isJsonString } from "@/util";
import { Elysia } from "elysia";

export const api = new Elysia();

/**
 * Intercept and handle errors that occur during the request lifecycle.
 * We handle errors by returning a JSON response with the error message.
 *
 * @see https://elysiajs.com/life-cycle/on-error.html
 */
api.onError(({ code, error, set }) => {
    /**
     * We differentiate between an "error" and a "failure" by checking the error code type.
     *
     * If the error code is "VALIDATION", then we know that the error is a validation error.
     * If the error code is "NOT_FOUND", then we know that the error is a route not found error.
     */
    if (code === "VALIDATION") {
        set.status = "Bad Request";

        /**
         * Elysia will raise an error in case a request or response contains fields that are not defined in the schema.
         * We catch this error and return a more user-friendly message.
         *
         * ? If you wish for the end-user to request with fields that are not defined in the schema, you can remove this check.
         * ? And setting normalize to true on the api instance constructor.
         *
         * @see https://elysiajs.com/validation/schema-type.html#constructor
         *
         */
        if (
            isJsonString(error.message) &&
            hasMessage(JSON.parse(error.message)) &&
            JSON.parse(error.message).message?.includes("Unexpected property")
        ) {
            return JSON.stringify({
                status: "failure",
                message: "Invalid request body",
            });
        }

        // We catch the error when the request body is missing.
        if (
            isJsonString(error.message) &&
            hasMessage(JSON.parse(error.message)) &&
            JSON.parse(error.message).message?.includes("Expected object")
        ) {
            return JSON.stringify({
                status: "failure",
                message: "Missing request body",
            });
        }

        return JSON.stringify({ status: "failure", message: error.message });
    }

    if (code === "NOT_FOUND") {
        set.status = "Not Found";

        return JSON.stringify({ status: "error", message: "Invalid route" });
    }

    return JSON.stringify({ status: "failure", message: error.message });
});

/**
 * Intercept and map the response before it is sent to the client.
 * We remap the response to a standard format that includes a status and message field.
 *
 * @see https://elysiajs.com/life-cycle/map-response.html
 */
api.mapResponse(({ response, set }) => {
    const isJson = typeof response === "object" && response !== null;
    const text = isJson ? JSON.stringify(response) : response?.toString() ?? "";

    if (isJson) {
        if (hasMessage(response)) {
            const { message, ...rest } = response;

            const remappedResponse = {
                status: "success",
                data: rest,
                message: message ?? "",
            };

            return new Response(JSON.stringify(remappedResponse));
        }

        return new Response(JSON.stringify({ status: "success", data: response }));
    }

    return new Response(text);
});

/**
 * A module is a collection of routes and logic that are related to a specific domain.
 * Below, we import the available modules and attach them to the API.
 */

api.use(authModule);
api.use(userModule);

api.listen(3000, () => {
    console.log("Server is running on port 3000");
});
