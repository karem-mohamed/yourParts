import { createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.splat(),
    format.json(),
    format.prettyPrint()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'error-%DATE%.log',
      level: 'error',
      maxFiles: '180d',
      dirname: './logs',
    }),
    new DailyRotateFile({
      filename: 'debug-%DATE%.log',
      level: 'debug',
      maxFiles: '180d',
      dirname: './logs',
    }),
  ],
});

export default logger;
