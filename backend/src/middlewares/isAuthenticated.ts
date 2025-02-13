import { Context, Next } from 'hono';
import { errorResponse } from '../utils/sendErrorResponse';
import { getValueFromRedis } from '../utils/redisFnc';
import getLocaleValue from '../utils/getLocaleValue';

export default async function isAuthenticated(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(c, 401, 'Unauthorized', 'unauthorized');
  }
  const token = authHeader.split(' ')[1];
  const userId = await getValueFromRedis(`auth:${token}`);
  if (!userId) {
    return errorResponse(
      c,
      401,
      'Unauthorized',
      getLocaleValue(c, 'unauthorized')
    );
  }

  c.set('userId', userId);
  await next();
}
