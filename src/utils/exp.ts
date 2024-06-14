export function getExpTimestamp(seconds: number): number {
    const currentTimeMillis = Date.now();
    const secondsIntoMillis = seconds * 1000;
    const expirationTimeMillis = currentTimeMillis + secondsIntoMillis;

    return Math.floor(expirationTimeMillis / 1000);
}
