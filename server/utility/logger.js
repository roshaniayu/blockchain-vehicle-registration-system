const fs = require('fs');
const path = require('path');

// Define log file path
const LOG_DIR = path.resolve(__dirname, '../');
const LOG_FILE = path.join(LOG_DIR, 'server.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Get current timestamp in format: YYYY-MM-DD HH:MM:SS
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
};

/**
 * Write log message to file
 * @param {string} level - Log level (INFO, ERROR, WARN, DEBUG, SUCCESS, REQUEST, RESPONSE)
 * @param {string} message - Log message
 * @param {object} data - Additional data to log (optional)
 */
const writeLog = (level, message, data = null) => {
    const timestamp = getTimestamp();
    
    // Format console output with emojis
    const levelEmojis = {
        'INFO': 'ℹ️',
        'ERROR': '❌',
        'WARN': '⚠️',
        'DEBUG': '🐛',
        'SUCCESS': '✅',
        'REQUEST': '📤',
        'RESPONSE': '📥',
        'DATABASE': '💾',
        'AUTH': '🔐',
        'SERVER': '🚀',
    };
    
    const emoji = levelEmojis[level] || '📝';
    
    // Build log entry
    let logEntry = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
        if (typeof data === 'object') {
            logEntry += `\n${JSON.stringify(data, null, 2)}`;
        } else {
            logEntry += ` | ${data}`;
        }
    }
    
    // Write to console
    console.log(`${emoji} ${logEntry}`);
    
    // Write to file
    try {
        fs.appendFileSync(LOG_FILE, logEntry + '\n', 'utf8');
    } catch (err) {
        console.error('Failed to write to log file:', err.message);
    }
};

/**
 * Log info level messages
 */
const info = (message, data = null) => {
    writeLog('INFO', message, data);
};

/**
 * Log error level messages
 */
const error = (message, data = null) => {
    writeLog('ERROR', message, data);
};

/**
 * Log warning level messages
 */
const warn = (message, data = null) => {
    writeLog('WARN', message, data);
};

/**
 * Log debug level messages
 */
const debug = (message, data = null) => {
    writeLog('DEBUG', message, data);
};

/**
 * Log success level messages
 */
const success = (message, data = null) => {
    writeLog('SUCCESS', message, data);
};

/**
 * Log HTTP request
 */
const request = (method, path, userId = null, details = null) => {
    const userInfo = userId ? ` [User: ${userId}]` : '';
    const message = `HTTP ${method} ${path}${userInfo}`;
    writeLog('REQUEST', message, details);
};

/**
 * Log HTTP response
 */
const response = (statusCode, path, message = '', duration = null) => {
    const durationInfo = duration ? ` (${duration}ms)` : '';
    const statusEmoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
    const responseMsg = `HTTP ${statusCode} - ${path}${durationInfo} ${message}`;
    writeLog('RESPONSE', responseMsg);
};

/**
 * Log database operations
 */
const database = (operation, table, result = '', details = null) => {
    const message = `DATABASE [${operation}] ${table} ${result}`;
    writeLog('DATABASE', message, details);
};

/**
 * Log authentication events
 */
const auth = (action, identifier, result = '', details = null) => {
    const message = `AUTH [${action}] ${identifier} ${result}`;
    writeLog('AUTH', message, details);
};

/**
 * Log server events
 */
const server = (event, details = null) => {
    writeLog('SERVER', event, details);
};

/**
 * Clear log file
 */
const clearLog = () => {
    try {
        fs.writeFileSync(LOG_FILE, '', 'utf8');
        info('Log file cleared');
    } catch (err) {
        error('Failed to clear log file:', err.message);
    }
};

/**
 * Get log file path
 */
const getLogPath = () => {
    return LOG_FILE;
};

module.exports = {
    info,
    error,
    warn,
    debug,
    success,
    request,
    response,
    database,
    auth,
    server,
    clearLog,
    getLogPath,
};
