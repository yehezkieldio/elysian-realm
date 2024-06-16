/**
 * General utility functions for the auth module.
 */

const ACCESS_TOKEN_EXPIRATION: number = 15 * 60;
const REFRESH_TOKEN_EXPIRATION: number = 30 * 86_400;

function getExpTimestamp(seconds: number): number {
    const currentTimeMillis = Date.now();
    const secondsIntoMillis = seconds * 1000;
    const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

    return Math.floor(expirationTimeMillis / 1000);
}

function generateUniqueIdentifier(randomLength = 8): string {
    return Math.random()
        .toString(36)
        .substring(2, randomLength + 2);
}

export const authUtil = {
    ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION,
    getExpTimestamp,
    generateUniqueIdentifier,
};
