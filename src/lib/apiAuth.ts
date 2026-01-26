import { API_BASE } from "@/lib/api";
import { getToken, clearToken } from "@/lib/token";

type ApiError = {
  message?: string;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;

    try {
      const data = (await res.json()) as ApiError;
      if (data?.message) errMsg = data.message;
    } catch {
      // ignore
    }

    // kalau token invalid/expired (umumnya 401)
    if (res.status === 401) {
      clearToken();
    }

    throw new Error(errMsg);
  }

  return res.json();
}

export async function authGet<T>(path: string): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return handleResponse<T>(res);
}

export async function authPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function authPut<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function authDelete<T>(path: string): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return handleResponse<T>(res);
}
