export interface UserPayload {
  displayName?: string;
  email?: string;
  password: string;
}

export interface LoginPayload {
  email?: string;
  password: string;
}

export interface User{
  token?: string;
  user?: UserPayload;
}

export interface ApiError {
  status: number;
  message: string;
}

export interface UserResponse {
  id: number;
  displayName: string;
  email: string;
}

export interface SigninResponseDto {
  token: string;
  user: UserResponse;
}