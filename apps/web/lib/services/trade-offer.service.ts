// トレード提案サービス

import { ApiClient } from "../utils/api";
import type { TradeOffer } from "../types";

interface CreateTradeOfferRequest {
  wantedCards: Array<{ cardName: string; quantity: number }>;
  offeredCards: Array<{ cardName: string; quantity: number }>;
}

export class TradeOfferService {
  static async searchTradeOffers(
    cardName?: string,
    page: number = 1
  ): Promise<{ tradeOffers: TradeOffer[]; total: number }> {
    const params = new URLSearchParams();
    if (cardName) params.append("cardName", cardName);
    params.append("page", page.toString());

    return ApiClient.get(`/api/trade-offers?${params.toString()}`);
  }

  static async getTradeOffer(offerId: string): Promise<TradeOffer> {
    return ApiClient.get(`/api/trade-offers/${offerId}`);
  }

  static async createTradeOffer(
    data: CreateTradeOfferRequest
  ): Promise<TradeOffer> {
    return ApiClient.post("/api/trade-offers", data);
  }

  static async updateTradeOfferStatus(
    offerId: string,
    status: "active" | "closed"
  ): Promise<TradeOffer> {
    return ApiClient.patch(`/api/trade-offers/${offerId}/status`, { status });
  }

  static async deleteTradeOffer(offerId: string): Promise<void> {
    return ApiClient.delete(`/api/trade-offers/${offerId}`);
  }

  static async getUserTradeOffers(userId: string): Promise<TradeOffer[]> {
    return ApiClient.get(`/api/users/${userId}/trade-offers`);
  }
}
