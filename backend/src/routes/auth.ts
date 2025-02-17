import { Hono } from 'hono';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import {
  register,
  login,
  logout,
  forgetPassword,
  verifyOtpAndResetPass,
  profile,
} from '../controllers/authController';
import isAuthenticated from '../middlewares/isAuthenticated';

const authRouter = new Hono();

authRouter.post('/register', register);
authRouter.post('/login', loginRateLimiter, login);
authRouter.get('/profile', isAuthenticated, profile);
authRouter.post('/logout', logout);
authRouter.post('/forget', forgetPassword);
authRouter.post('/verify-otp', verifyOtpAndResetPass);

export default authRouter;
