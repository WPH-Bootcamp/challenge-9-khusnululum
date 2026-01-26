import { apiPost } from "@/lib/api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
      latitude?: number;
      longitude?: number;
      createdAt?: string;
    };
    token: string;
  };
};

export async function loginApi(payload: LoginPayload) {
  return apiPost<LoginResponse>("/api/auth/login", payload);
}

// ===== REGISTER =====
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
    token?: string;
  };
};

export async function registerApi(payload: RegisterPayload) {
  return apiPost<RegisterResponse>("/api/auth/register", payload);
}
