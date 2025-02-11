import { Hono, Context } from 'hono';
import { registerUser, loginUser } from '../services/authService';
import { loginRateLimiter } from '../middlewares/rateLimiter';
import {
  register,
  login,
  logout,
  forgetPassword,
  verifyOtp,
} from '../controllers/authController';

const authRouter = new Hono();

authRouter.post('/register', register);
authRouter.post('/login', loginRateLimiter, login);
authRouter.post('/logout', logout);
authRouter.post('/forget', forgetPassword);
authRouter.post('/verify-otp', verifyOtp);

export default authRouter;
