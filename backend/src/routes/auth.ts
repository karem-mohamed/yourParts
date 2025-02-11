import { Hono } from 'hono';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import {
  register,
  login,
  logout,
  forgetPassword,
  verifyOtpAndResetPass,
} from '../controllers/authController';

const authRouter = new Hono();

authRouter.post('/register', register);
authRouter.post('/login', loginRateLimiter, login);
authRouter.post('/logout', logout);
authRouter.post('/forget', forgetPassword);
authRouter.post('/verify-otp', verifyOtpAndResetPass);

export default authRouter;
