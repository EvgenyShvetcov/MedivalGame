import { injectable } from "inversify";
import api from "./api";

@injectable()
export class AuthService {
  async login(payload: { username: string; password: string }) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  }
  async register(payload: {
    email: string;
    username: string;
    password: string;
  }) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  }
}
