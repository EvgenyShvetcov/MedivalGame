// src/services/ItemService.ts
import { injectable } from "inversify";
import api from "./api";

@injectable()
export class ItemService {
  async getMyItems() {
    const response = await api.get("/items/player/me");
    return response.data;
  }

  async getEquippedItems() {
    const response = await api.get("/items/player/me/equipped");
    return response.data;
  }

  async equip(itemId: string) {
    const response = await api.post(`/items/${itemId}/equip`);
    return response.data;
  }

  async unequip(itemId: string) {
    const response = await api.post(`/items/${itemId}/unequip`);
    return response.data;
  }

  async sell(itemId: string) {
    const response = await api.delete(`/items/${itemId}/sell`);
    return response.data;
  }
}
