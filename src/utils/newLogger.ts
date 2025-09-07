import winston from 'winston';

export class Logger {
    private static logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
                const colors = {
                    error: '\x1b[31m',   // Red
                    warn: '\x1b[33m',    // Yellow  
                    info: '\x1b[36m',    // Cyan
                    debug: '\x1b[35m',   // Magenta
                    reset: '\x1b[0m'     
                };

                const color = colors[level as keyof typeof colors] || colors.reset;
                const coloredLevel = `${color}${level.toUpperCase()}${colors.reset}`;
                
                const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
                return `[${timestamp}] [${coloredLevel}]: ${message}${metaString}`;
            })
        ),
        transports: [
            new winston.transports.Console(),
        ],
    });

    // Info message
    static info(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.info(message, meta);
    }

    // Error message
    static error(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.error(message, meta);
    }

    // Warning message
    static warn(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.warn(message, meta);
    }

    // Debug message
    static debug(message: string, meta: Record<string, any> = {}): void {
        Logger.logger.debug(message, meta);
    }
}