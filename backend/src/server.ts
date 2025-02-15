import { Hono } from 'hono';
import authRouter from './routes/auth';
import langDetector from './middlewares/langDetector';
import errorHandler from './middlewares/errorHandler';
import categoryRouter from './routes/category';
import postRouter from './routes/posts';
import commentRouter from './routes/comments';
import tagRouter from './routes/tags';

const app = new Hono();
///Localization
app.use(langDetector);

///Error Handler
app.onError(errorHandler);

///Routes
app.route('/auth', authRouter);
app.route('/categories', categoryRouter);
app.route('/posts', postRouter);
app.route('/comments', commentRouter);
app.route('/tags', tagRouter);

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

export default {
  port,
  fetch: app.fetch,
};
