import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      let line = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(meta).length) {
        line += ` ${JSON.stringify(meta)}`;
      }
      return line;
    })
  ),
  transports: [
    new transports.Console(),
  ],
});

export default logger;
