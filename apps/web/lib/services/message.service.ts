// メッセージサービス

import { ApiClient } from "../utils/api";
import type { Message } from "../types";

export class MessageService {
  static async getMessages(
    offerId: string,
    page: number = 1
  ): Promise<{ messages: Message[]; total: number }> {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    return ApiClient.get(
      `/api/trade-offers/${offerId}/messages?${params.toString()}`
    );
  }

  static async sendMessage(offerId: string, content: string): Promise<Message> {
    return ApiClient.post(`/api/trade-offers/${offerId}/messages`, {
      content,
    });
  }
}
