const path = require("path");

// Color configuration for console output
const CONSOLE_COLORS = {
    reset: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
};

// Default color scheme for caller details
const CALLER_COLORS = {
    text: CONSOLE_COLORS.green,
    background: CONSOLE_COLORS.bgBlue,
    reset: CONSOLE_COLORS.reset
};

function getCallerDetails() {
    const originalFunc = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;

    const err = new Error();
    const stack = err.stack;

    Error.prepareStackTrace = originalFunc;

    const currentFile = __filename;

    // Find first frame not from this file
    const callerFrame = stack.find(frame => frame.getFileName() !== currentFile);

    if (!callerFrame) return "[unknown]";

    const file = path.basename(callerFrame.getFileName() || "unknown");
    const line = callerFrame.getLineNumber();
    const column = callerFrame.getColumnNumber();

    // Important: Apply text color + background before, and reset after
    // return `${CALLER_COLORS.text}${CALLER_COLORS.background}[${file}:${line}:${column}]${CONSOLE_COLORS.reset}`;
    return `\x1b[41m\x1b[3m\x1b[22m${CONSOLE_COLORS.bgWhite}[${file}:${line}:${column}]\x1b[0m`; 
}

// Store original console methods
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
};

// 🔁 Patch standard methods
["log", "warn", "error", "info", "debug"].forEach((method) => {
    const original = console[method];
    console[method] = (...args) => {
        if (process.env.NODE_ENV !== 'production') {
            const location = getCallerDetails();
            if (typeof args[0] === "string") {
                args[0] = `${location} ${args[0]}`;
            } else {
                args.unshift(location);
            }
            original.call(console, ...args);
        }
    };
});