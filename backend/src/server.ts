import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('🚀 Server is running!'));

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

Bun.serve({
  fetch: app.fetch,
  port,
});
