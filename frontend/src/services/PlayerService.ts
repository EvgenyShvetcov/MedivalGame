import { injectable } from "inversify";
import api from "./api";
import { IPlayer } from "@/store/player/types";

export interface IPlayerService {
  getCurrentPlayer(): Promise<IPlayer>;
}

@injectable()
export class PlayerService implements IPlayerService {
  async getCurrentPlayer(): Promise<IPlayer> {
    const response = await api.get("/player/me");
    return response.data;
  }

  async changeLocation(locationKey: string): Promise<IPlayer> {
    const res = await api.post("/player/change-location", { locationKey });
    return res.data;
  }

  async ping(): Promise<{ success: boolean; updatedAt: string }> {
    const res = await api.post("/player/ping");
    return res.data;
  }

  async getById(id: string): Promise<IPlayer> {
    const res = await api.get(`/player/${id}`);
    return res.data;
  }

  async getAll(): Promise<IPlayer[]> {
    const res = await api.get("/player");
    return res.data;
  }

  async checkOnline(): Promise<{ online: boolean }> {
    const res = await api.get("/player/online");
    return res.data;
  }

  async assignAttributes(payload: {
    strength?: number;
    agility?: number;
    defense?: number;
  }): Promise<IPlayer> {
    const response = await api.post<IPlayer>(
      "/player-attributes/assign",
      payload
    );
    return response.data;
  }
}
