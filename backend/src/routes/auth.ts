import { Hono, Context } from 'hono';
import { registerUser, loginUser } from '../services/authService';
import { loginRateLimiter } from '../middlewares/rateLimiter';

const authRouter = new Hono();

authRouter.post(
  '/register',
  loginRateLimiter,
  async (c, next) => {
    throw Error('mesh 3ref el error');
    console.log('ooooooooo');
    await next();
  },
  async (c: Context) => {
    console.log('inside register');
    return c.json({ message: 'success' }, 200);
    const { username, email, password } = await c.req.json();
    const user = await registerUser(username, email, password);
    return c.json({ message: 'User registered successfully', user });
  }
);

authRouter.post(
  '/login',
  (c, next) => {
    console.log('eeeee');
    next();
  },
  async (c: Context) => {
    const { identifier, password } = await c.req.json();
    const token = await loginUser(identifier, password);
    return c.json({ message: 'Login successful', token });
  }
);

export default authRouter;
