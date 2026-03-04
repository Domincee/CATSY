/**
 * Dev-only logger utility.
 * All log/error/warn calls are silenced in production builds.
 */
const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args) => isDev && console.log(...args),
    error: (...args) => isDev && console.error(...args),
    warn: (...args) => isDev && console.warn(...args),
};
