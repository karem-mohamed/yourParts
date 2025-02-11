import { Context } from 'hono';
import logger from '../utils/logger';
import getLocaleValue from '../utils/getLocaleValue';
import { messages } from '../locales/locales';
export default async function errorHandler(err: Error, c: Context) {
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
}
