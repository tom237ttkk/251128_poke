// トレード提案サービス

import { ApiClient } from "@/lib/utils/api";
import type { TradeOffer } from "@/lib/types";

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

    const response = await ApiClient.get<unknown>(
      `/api/trade-offers?${params.toString()}`
    );
    const { tradeOffers, total, usesClientFilter } =
      TradeOfferService.normalizeSearchResponse(response);

    if (!usesClientFilter) {
      return { tradeOffers, total };
    }

    const normalizedQuery = cardName?.trim().toLowerCase() ?? "";
    const filtered =
      normalizedQuery.length === 0
        ? tradeOffers
        : tradeOffers.filter((offer) =>
            offer.cards?.some((card) =>
              card.cardName.toLowerCase().includes(normalizedQuery)
            )
          );
    const pageSize = 20;
    const startIndex = Math.max(0, (page - 1) * pageSize);
    return {
      tradeOffers: filtered.slice(startIndex, startIndex + pageSize),
      total: filtered.length,
    };
  }

  private static normalizeSearchResponse(response: unknown): {
    tradeOffers: TradeOffer[];
    total: number;
    usesClientFilter: boolean;
  } {
    if (Array.isArray(response)) {
      return {
        tradeOffers: response as TradeOffer[],
        total: response.length,
        usesClientFilter: true,
      };
    }

    if (
      response &&
      typeof response === "object" &&
      Array.isArray((response as { tradeOffers?: unknown }).tradeOffers)
    ) {
      const data = response as { tradeOffers: TradeOffer[]; total?: number };
      return {
        tradeOffers: data.tradeOffers,
        total:
          typeof data.total === "number" ? data.total : data.tradeOffers.length,
        usesClientFilter: false,
      };
    }

    if (
      response &&
      typeof response === "object" &&
      Array.isArray((response as { items?: unknown }).items)
    ) {
      const data = response as { items: TradeOffer[]; total?: number };
      return {
        tradeOffers: data.items,
        total: typeof data.total === "number" ? data.total : data.items.length,
        usesClientFilter: false,
      };
    }

    return { tradeOffers: [], total: 0, usesClientFilter: true };
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
    status: "ACCEPTED" | "REJECTED" | "CANCELED"
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
