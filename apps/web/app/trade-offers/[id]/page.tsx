"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatBox } from "@/components/chat-box";
import { ErrorMessage } from "@/components/error-message";
import { Loading } from "@/components/loading";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { MessageService } from "@/lib/services/message.service";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import type { Message, TradeOffer } from "@/lib/types";

type TradeStatusUpdate = "ACCEPTED" | "REJECTED" | "CANCELED";

export default function TradeOfferDetailPage() {
  const params = useParams();
  const offerId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tradeOffer, setTradeOffer] = useState<TradeOffer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [offerData, messagesData] = await Promise.all([
          TradeOfferService.getTradeOffer(offerId),
          MessageService.getMessages(offerId),
        ]);
        setTradeOffer(offerData);
        setMessages(messagesData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの読み込みに失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [offerId]);

  const handleSendMessage = async (content: string) => {
    try {
      const newMessage = await MessageService.sendMessage(offerId, content);
      setMessages([...messages, newMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "メッセージの送信に失敗しました"
      );
    }
  };

  const handleStatusChange = async (status: TradeStatusUpdate) => {
    try {
      const updatedOffer = await TradeOfferService.updateTradeOfferStatus(
        offerId,
        status
      );
      setTradeOffer(updatedOffer);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ステータスの更新に失敗しました"
      );
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当にこのトレード提案を削除しますか？")) return;

    try {
      await TradeOfferService.deleteTradeOffer(offerId);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!tradeOffer) {
    return (
      <div className="page">
        <Navigation />
        <main className="page-container py-10">
          <ErrorMessage message="トレード提案が見つかりませんでした" />
        </main>
      </div>
    );
  }

  const wantedCards =
    tradeOffer.cards?.filter((c) => c.cardType === "wanted") || [];
  const offeredCards =
    tradeOffer.cards?.filter((c) => c.cardType === "offered") || [];
  const isOwner = user?.id === tradeOffer.userId;

  return (
    <div className="page">
      <Navigation />
      <main className="page-container py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              トレード提案詳細
            </h1>
            {isOwner && (
              <div className="flex space-x-2">
                {tradeOffer.status === "active" && (
                  <button
                    onClick={() => handleStatusChange("CANCELED")}
                    className="btn btn-warning"
                    type="button"
                  >
                    クローズする
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  type="button"
                >
                  削除
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              作成者: {tradeOffer.user?.pokePokeId || "不明"}
            </p>
            <span
              className={`badge ${
                tradeOffer.status === "active" ? "badge-active" : "badge-closed"
              }`}
            >
              {tradeOffer.status === "active" ? "アクティブ" : "クローズ"}
            </span>
            <p className="text-sm text-gray-500">
              {new Date(tradeOffer.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card card-body">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              欲しいカード
            </h2>
            {wantedCards.length === 0 ? (
              <p className="text-gray-500 text-sm">なし</p>
            ) : (
              <ul className="space-y-2">
                {wantedCards.map((card) => (
                  <li
                    key={card.id}
                    className="flex justify-between rounded-lg border border-black/5 bg-white/50 p-3"
                  >
                    <span className="font-medium text-gray-900">
                      {card.cardName}
                    </span>
                    <span className="text-gray-600">×{card.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card card-body">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              出せるカード
            </h2>
            {offeredCards.length === 0 ? (
              <p className="text-gray-500 text-sm">なし</p>
            ) : (
              <ul className="space-y-2">
                {offeredCards.map((card) => (
                  <li
                    key={card.id}
                    className="flex justify-between rounded-lg border border-black/5 bg-white/50 p-3"
                  >
                    <span className="font-medium text-gray-900">
                      {card.cardName}
                    </span>
                    <span className="text-gray-600">×{card.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <ChatBox messages={messages} onSendMessage={handleSendMessage} />
        )}
      </main>
    </div>
  );
}
