/**
 * This is a collection of utility functions that are used throughout the application.
 */

export function hasMessage(obj: unknown): obj is { message?: string } {
    return typeof obj === "object" && obj !== null && "message" in obj;
}

export function isJsonString(str: string): boolean {
    if (typeof str !== "string") return false;

    str.trim();
    return (str.startsWith("{") && str.endsWith("}")) || (str.startsWith("[") && str.endsWith("]"));
}
