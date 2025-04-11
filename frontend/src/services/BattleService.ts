import { injectable } from "inversify";
import api from "./api";

@injectable()
export class BattleService {
  async start() {
    const response = await api.post("/battle/start");
    return response.data;
  }

  async makeTurn(battleId: string, unitId: string) {
    const response = await api.post(`/battle/${battleId}/choose-unit`, {
      unitId,
    });
    return response.data;
  }

  async getCurrentBattle() {
    const response = await api.get("/battle/current");
    return response.data;
  }

  async startWithBot() {
    const response = await api.post("/battle/with-bot");
    return response.data;
  }

  async search() {
    const response = await api.post("/battle/search");
    return response.data;
  }

  async cancelSearch() {
    const response = await api.post("/battle/cancel-search");
    return response.data;
  }

  async getById(id: string) {
    const response = await api.get(`/battle/${id}`);
    return response.data;
  }

  async processTurn(battleId: string) {
    const response = await api.post(`/battle/${battleId}/process-turn`);
    return response.data;
  }

  async getLogs(battleId: string) {
    const response = await api.get(`/battle/${battleId}/logs`);
    return response.data;
  }

  async leave() {
    const response = await api.patch(`/battle/leave`);
    return response.data;
  }
}
