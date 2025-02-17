export interface LoginData {
  identifier: string;
  password: string;
}
export interface ResetData {
  email: string;
}

export interface OtpData {
  otp: string;
  newPassword: string;
  email?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
}

export interface ResetResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
