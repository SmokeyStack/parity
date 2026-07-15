declare module 'countdown' {
    interface Countdown {
        YEARS: number;
        MONTHS: number;
        DAYS: number;
        HOURS: number;
        MINUTES: number;
        SECONDS: number;
        (start: Date, end: Date, units: number): CountdownResult;
    }

    interface CountdownResult {
        years: number;
        months: number;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }

    const countdown: Countdown;
    export default countdown;
    export const YEARS: number;
    export const MONTHS: number;
    export const DAYS: number;
    export const HOURS: number;
    export const MINUTES: number;
    export const SECONDS: number;
}
