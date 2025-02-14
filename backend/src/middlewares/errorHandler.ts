import { Context } from 'hono';
import logger from '../utils/logger';
import getLocaleValue from '../utils/getLocaleValue';
import { messages } from '../locales/locales';
import { errorResponse } from '../utils/sendErrorResponse';
import { DatabaseError } from 'pg';
import { ContentfulStatusCode } from 'hono/utils/http-status';
export default async function errorHandler(err: any, c: Context) {
  logger.error(err);
  let status: ContentfulStatusCode = err.statusCode || 500;
  let code = 'Server_Error';
  let message: string = getLocaleValue(
    c,
    (err.message as keyof (typeof messages)['en']) || 'server_error'
  );
  if (err instanceof DatabaseError && err.code === '23505') {
    status = 400;
    message = getLocaleValue(
      c,
      err.constraint as keyof (typeof messages)['en']
    );
    code = 'Conflict';
  }

  return errorResponse(c, status, code, message);
}
