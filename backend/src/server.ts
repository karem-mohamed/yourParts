import { Hono } from 'hono';
import authRouter from './routes/auth';
import { loginRateLimiter } from './middlewares/rateLimiter';
import cacheRequests from './middlewares/cacheRequests';
import { saveValueInRedis } from './utils/redisFnc';
import langDetector from './middlewares/langDetector';
import errorHandler from './middlewares/errorHandler';

const app = new Hono();

///Localization
app.use(langDetector);

///Error Handler
app.onError(errorHandler);

///Routes
app.route('/auth', authRouter);

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

export default {
  port,
  fetch: app.fetch,
};
