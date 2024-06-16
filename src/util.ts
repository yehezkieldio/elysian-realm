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

export function getExpTimestamp(seconds: number): number {
    const currentTimeMillis = Date.now();
    const secondsIntoMillis = seconds * 1000;
    const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

    return Math.floor(expirationTimeMillis / 1000);
}

export function generateUniqueIdentifier(randomLength = 8): string {
    return Math.random()
        .toString(36)
        .substring(2, randomLength + 2);
}
