import { ApiClient } from "../utils/api";
import type { Pack } from "../types";

export class PackService {
  static async getPacks(): Promise<Pack[]> {
    return ApiClient.get<Pack[]>("/api/packs");
  }

  static async getPackById(id: string): Promise<Pack> {
    return ApiClient.get<Pack>(`/api/packs/${id}`);
  }
}
