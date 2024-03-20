import { Context } from "koa";
import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

async function requestLogger(ctx: Context, next: () => Promise<void>) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  const { method, originalUrl, ip, status } = ctx;
  logger.info(`${method} ${status} ${originalUrl} ${ms}ms - ${ip}`);
}

export default requestLogger;
