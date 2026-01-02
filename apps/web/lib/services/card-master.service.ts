import { ApiClient } from "../utils/api";
import type { Card } from "../types";

export class CardMasterService {
  static async getCardMaster(packId?: string): Promise<Card[]> {
    const params = packId ? `?packId=${packId}` : "";
    return ApiClient.get<Card[]>(`/api/cards/master${params}`);
  }

  static async getCardById(id: string): Promise<Card> {
    return ApiClient.get<Card>(`/api/cards/${id}`);
  }
}
