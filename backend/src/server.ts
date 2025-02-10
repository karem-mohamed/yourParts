import { Hono } from 'hono';
import authRouter from './routes/auth';
import logger from './utils/logger';
import { loginRateLimiter } from './middlewares/rateLimiter';

const app = new Hono();
app.onError((err, c) => {
  console.error('🚨 خطأ غير متوقع:', err);
  logger.error(err);
  return c.json({ message: err.message || 'Something went wrong!' }, 500);
});

app.route('/auth', authRouter);
app.get('/', loginRateLimiter, (c) => {
  throw new Error('This is a test error!');
  return c.text('🚀 Server is running!');
});

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

export default {
  port,
  fetch: app.fetch,
};
