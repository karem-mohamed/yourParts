import { Hono } from 'hono';
import authRouter from './routes/auth';

const app = new Hono();

app.route('/auth', authRouter);

app.get('/', (c) => c.text('🚀 Server is running!'));

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
