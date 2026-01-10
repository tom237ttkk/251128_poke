import { ApiClient } from "@/lib/utils/api";
import type { Pack } from "@/lib/types";

export class PackService {
  static async getPacks(): Promise<Pack[]> {
    return ApiClient.get<Pack[]>("/api/packs");
  }

  static async getPackById(id: string): Promise<Pack> {
    return ApiClient.get<Pack>(`/api/packs/${id}`);
  }
}
