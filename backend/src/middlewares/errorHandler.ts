import { Context } from 'hono';
import logger from '../utils/logger';
import getLocaleValue from '../utils/getLocaleValue';
import { messages } from '../locales/locales';
import { errorResponse } from '../utils/sendErrorResponse';
import { DatabaseError } from 'pg';
import { ContentfulStatusCode } from 'hono/utils/http-status';

interface Err extends Error {
  statusCode: ContentfulStatusCode;
}

function isErr(err: Err | Error): err is Err {
  return 'statusCode' in err && typeof err.statusCode === 'number';
}

export default async function errorHandler(err: Error, c: Context) {
  logger.error(err);
  let status: ContentfulStatusCode = 500;
  let code = 'Server_Error';
  let message: string = getLocaleValue(
    c,
    (err.message as keyof (typeof messages)['en']) || 'server_error'
  );
  if (isErr(err)) {
    status = err.statusCode;
    return c.json(
      {
        status: err.statusCode,
        code: err.name,
        message,
      },
      err.statusCode
    );
  }
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
