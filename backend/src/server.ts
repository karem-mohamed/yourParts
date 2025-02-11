import { Hono } from 'hono';
import authRouter from './routes/auth';
import logger from './utils/logger';
import { loginRateLimiter } from './middlewares/rateLimiter';
import cacheRequests from './middlewares/cacheRequests';
import { saveValueInRedis } from './utils/redisFnc';
// import { i18nMiddleware } from './middlewares/i18nMiddleware';
import { languageDetector } from 'hono/language';
import getLocaleValue from './utils/getLocaleValue';
import { messages } from './locales/locales';

const app = new Hono();

///Localization
app.use(
  languageDetector({
    supportedLanguages: ['en', 'ar'],
    fallbackLanguage: 'en',
  })
);

///Error Handler
app.onError((err, c) => {
  logger.error(err);
  return c.json(
    {
      message: getLocaleValue(
        c,
        (err.message as keyof (typeof messages)['en']) || 'server_error'
      ),
    },
    500
  );
});

///Routes
app.route('/auth', authRouter);

app.get('/', cacheRequests, loginRateLimiter, async (c) => {
  await saveValueInRedis(
    c.req.url,
    JSON.stringify({ products: [{ name: 'karem' }] }),
    60 * 60 * 24
  );
  return c.text('🚀 Server is running!');
});

const port = process.env.PORT || 5000;
console.log(`Server is running on http://localhost:${process.env.PORT}`);

export default {
  port,
  fetch: app.fetch,
};
