import winston from 'winston';

export class Logger {
    private static logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
                return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
        ],
    });

    /**
     * Log an info message
     */
    static info(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.info(message, meta);
    }

    /**
     * Log an error message
     */
    static error(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.error(message, meta);
    }

    /**
     * Log a warning message
     */
    static warn(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.warn(message, meta);
    }

    /**
     * Log a debug message
     */
    static debug(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.debug(message, meta);
    }
}
