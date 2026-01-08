// メッセージサービス

import { ApiClient, API_BASE_URL } from "@/lib/utils/api";
import type { Message } from "@/lib/types";

export class MessageService {
  static async getMessages(
    offerId: string,
    page: number = 1
  ): Promise<Message[]> {
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

  static streamMessages(
    offerId: string,
    onMessage: (message: Message) => void,
    onError?: (event: Event) => void
  ): EventSource | null {
    if (typeof window === "undefined") return null;
    const token = ApiClient.getToken();
    if (!token) return null;

    const streamUrl = new URL(
      `${API_BASE_URL}/api/trade-offers/${offerId}/messages/stream`
    );
    streamUrl.searchParams.set("token", token);

    const source = new EventSource(streamUrl.toString());
    source.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as Message;
        onMessage(payload);
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    });
    if (onError) {
      source.addEventListener("error", onError);
    }

    return source;
  }
}
