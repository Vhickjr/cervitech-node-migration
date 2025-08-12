import winston from 'winston';
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});
export const loggerStream = {
    write: (message) => logger.info(message.trim()),
};
