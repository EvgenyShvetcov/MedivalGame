// src/services/ShopService.ts
import { injectable } from "inversify";
import api from "./api";

@injectable()
export class ShopService {
  async getAllShops() {
    const response = await api.get("/shop");
    return response.data;
  }

  async getShopById(id: string) {
    const response = await api.get(`/shop/${id}`);
    return response.data;
  }

  async buyItem(shopItemId: string) {
    const response = await api.post(`/shop/${shopItemId}/buy`);
    return response.data;
  }
}
