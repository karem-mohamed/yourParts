import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export const errorResponse = (
  c: Context,
  status: ContentfulStatusCode,
  code: string,
  message: string,
  errors?: any
) => {
  return c.json(
    {
      status,
      code,
      message,
      errors: errors ? errors : undefined,
    },
    status
  );
};
