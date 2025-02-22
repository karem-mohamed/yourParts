import { Context } from 'hono';
import {
  registerUser,
  loginUser,
  logOutUser,
  checkOtp,
  changePassword,
  userIsExist,
  findUserById,
  generateNewToken,
} from '../services/authService';
import getLocaleValue from '../utils/getLocaleValue';
import { saveValueInRedis } from '../utils/redisFnc';
import { forgetPasswordSchema, loginSchema, registerSchema } from '../shemas';
import { errorResponse } from '../utils/sendErrorResponse';

export const register = async (c: Context) => {
  const { username, email, password } = await c.req.json();
  const result = registerSchema.safeParse({
    username,
    email,
    password,
  });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }

  const { token, newUser } = await registerUser(username, email, password);
  const user: Partial<typeof newUser> = newUser;
  delete user.password;

  return c.json({
    message: getLocaleValue(c, 'user_registered_success'),
    token,
    user: user,
  });
};

export const login = async (c: Context) => {
  const { identifier, password } = await c.req.json();
  const result = loginSchema.safeParse({
    identifier,
    password,
  });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }
  const { token, user } = await loginUser(identifier, password);
  const newUser: Partial<typeof user> = user;
  delete newUser.password;
  return c.json({
    message: getLocaleValue(c, 'login_success'),
    token,
    user: newUser,
  });
};

export const logout = async (c: Context) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: getLocaleValue(c, 'unauthorized') }, 401);
  }
  const message = await logOutUser(authHeader);
  return c.json({ message: getLocaleValue(c, message ?? 'logout_success') });
};

export const forgetPassword = async (c: Context) => {
  const { email } = await c.req.json();
  const result = forgetPasswordSchema.safeParse({
    email,
  });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }

  const isExist = await userIsExist(email);
  if (!isExist) {
    return c.json({ message: getLocaleValue(c, 'user_not_found') }, 404);
  }
  await saveValueInRedis(`forget:${email}`, 1111, 60 * 2);
  // let's say we generate otp and send it to user mail
  return c.json({ message: getLocaleValue(c, 'otp_sent') });
};

export const verifyOtpAndResetPass = async (c: Context) => {
  const { otp, email, newPassword } = await c.req.json();
  const sameOtp = await checkOtp(otp, email);
  if (!sameOtp) {
    return c.json({ message: getLocaleValue(c, 'wrong_otp') }, 400);
  }
  await changePassword(email, newPassword);
  return c.json({ message: getLocaleValue(c, 'pass_changed') });
};

export const profile = async (c: Context) => {
  const userId = await c.get('userId');
  const user = await findUserById(userId);
  const token = await generateNewToken(user.id);
  return c.json({
    token,
    user,
  });
};
