import { injectable } from "inversify";
import api from "./api";

export interface ILocationService {
  getAll(): Promise<Location[]>;
  getById(id: string): Promise<Location>;
}

@injectable()
export class LocationService implements ILocationService {
  async getAll() {
    const res = await api.get("/locations");
    return res.data;
  }

  async getById(id: string) {
    const res = await api.get(`/locations/${id}`);
    return res.data;
  }

  async getArenas() {
    const res = await api.get("/locations/arenas");
    return res.data;
  }

  async getShops() {
    const res = await api.get("/locations/shops");
    return res.data;
  }

  async createLocation(dto: any) {
    const res = await api.post("/locations", dto);
    return res.data;
  }

  async updateLocation(id: string, dto: any) {
    const res = await api.patch(`/locations/${id}`, dto);
    return res.data;
  }

  async deleteLocation(id: string) {
    const res = await api.delete(`/locations/${id}`);
    return res.data;
  }
}
