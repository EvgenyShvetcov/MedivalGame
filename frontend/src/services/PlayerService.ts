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
}
