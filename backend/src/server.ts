import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRouter from './routes/auth';
import langDetector from './middlewares/langDetector';
import errorHandler from './middlewares/errorHandler';
import categoryRouter from './routes/category';
import postRouter from './routes/posts';
import commentRouter from './routes/comments';
import tagRouter from './routes/tags';

const app = new Hono();

///Cors
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

///Localization
app.use(langDetector);

///Error Handler
app.onError(errorHandler);

///Routes
app.route('/api/auth', authRouter);
app.route('/api/categories', categoryRouter);
app.route('/api/posts', postRouter);
app.route('/api/comments', commentRouter);
app.route('/api/tags', tagRouter);

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

export default {
  port,
  fetch: app.fetch,
};
