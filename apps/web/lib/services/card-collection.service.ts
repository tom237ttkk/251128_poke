// カードコレクションサービス

import { ApiClient } from "../utils/api";
import type { CardCollection } from "../types";

interface AddCardRequest {
  cardName: string;
  cardType: "wanted" | "offered";
  quantity: number;
}

interface UpdateCardQuantityRequest {
  quantity: number;
}

export class CardCollectionService {
  static async getMyCards(): Promise<CardCollection[]> {
    return ApiClient.get<CardCollection[]>("/api/users/me/cards");
  }

  static async addWantedCard(
    cardName: string,
    quantity: number
  ): Promise<CardCollection> {
    return ApiClient.post<CardCollection>("/api/users/me/cards/wanted", {
      cardName,
      quantity,
    });
  }

  static async addOfferedCard(
    cardName: string,
    quantity: number
  ): Promise<CardCollection> {
    return ApiClient.post<CardCollection>("/api/users/me/cards/offered", {
      cardName,
      quantity,
    });
  }

  static async deleteCard(cardId: string): Promise<void> {
    return ApiClient.delete(`/api/users/me/cards/${cardId}`);
  }

  static async updateCardQuantity(
    cardId: string,
    quantity: number
  ): Promise<CardCollection> {
    return ApiClient.put<CardCollection>(`/api/users/me/cards/${cardId}`, {
      quantity,
    });
  }
}
