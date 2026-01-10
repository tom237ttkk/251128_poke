// 認証サービス

import { ApiClient } from "@/lib/utils/api";
import type { User } from "@/lib/types";

interface RegisterResponse {
  user: User;
  token: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async register(
    pokePokeId: string,
    name: string,
    password: string
  ): Promise<RegisterResponse> {
    const response = await ApiClient.post<RegisterResponse>(
      "/api/auth/register",
      { pokePokeId, name, password }
    );
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  }

  static async login(
    pokePokeId: string,
    password: string
  ): Promise<LoginResponse> {
    const response = await ApiClient.post<LoginResponse>("/api/auth/login", {
      pokePokeId,
      password,
    });
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  }

  static async getCurrentUser(): Promise<User> {
    return ApiClient.get<User>("/api/auth/me");
  }

  static logout(): void {
    localStorage.removeItem("token");
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
