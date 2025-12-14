"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import { MessageService } from "@/lib/services/message.service";
import { Navigation } from "@/components/navigation";
import { ChatBox } from "@/components/chat-box";
import { Loading } from "@/components/loading";
import { ErrorMessage } from "@/components/error-message";
import type { TradeOffer, Message } from "@/lib/types";

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
        setMessages(messagesData.messages);
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

  const handleStatusChange = async (status: "active" | "closed") => {
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              トレード提案詳細
            </h1>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleStatusChange(
                      tradeOffer.status === "active" ? "closed" : "active"
                    )
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                  type="button"
                >
                  {tradeOffer.status === "active" ? "クローズする" : "再開する"}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  type="button"
                >
                  削除
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              作成者: {tradeOffer.user?.pokepokeUserId || "不明"}
            </p>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                tradeOffer.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
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
          <div className="bg-white shadow rounded-lg p-6">
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
                    className="flex justify-between p-3 bg-gray-50 rounded-md"
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

          <div className="bg-white shadow rounded-lg p-6">
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
                    className="flex justify-between p-3 bg-gray-50 rounded-md"
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
          <ChatBox
            offerId={offerId}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
}
