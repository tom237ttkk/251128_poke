"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { CardCollectionService } from "@/lib/services/card-collection.service";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import { Navigation } from "@/components/navigation";
import { CardList } from "@/components/card-list";
import { CardSelector } from "@/components/card-selector";
import { Loading } from "@/components/loading";
import { ErrorMessage } from "@/components/error-message";
import type { CardCollection, TradeOffer } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<CardCollection[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const [cardsData, offersData] = await Promise.all([
          CardCollectionService.getMyCards(),
          TradeOfferService.getUserTradeOffers(user.id),
        ]);
        setCards(cardsData);
        setTradeOffers(offersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "データの読み込みに失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddWantedCard = async (cardName: string, quantity: number) => {
    try {
      const newCard = await CardCollectionService.addWantedCard(
        cardName,
        quantity
      );
      setCards([...cards, newCard]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カードの追加に失敗しました"
      );
    }
  };

  const handleAddOfferedCard = async (cardName: string, quantity: number) => {
    try {
      const newCard = await CardCollectionService.addOfferedCard(
        cardName,
        quantity
      );
      setCards([...cards, newCard]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カードの追加に失敗しました"
      );
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await CardCollectionService.deleteCard(cardId);
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カードの削除に失敗しました"
      );
    }
  };

  const handleUpdateQuantity = async (cardId: string, quantity: number) => {
    try {
      const updatedCard = await CardCollectionService.updateCardQuantity(
        cardId,
        quantity
      );
      setCards(cards.map((card) => (card.id === cardId ? updatedCard : card)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "数量の更新に失敗しました");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
          <p className="mt-2 text-sm text-gray-600">
            ポケポケユーザーID: {user.pokepokeUserId}
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CardSelector type="wanted" onAdd={handleAddWantedCard} />
          <CardSelector type="offered" onAdd={handleAddOfferedCard} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CardList
            cards={cards}
            type="wanted"
            onDelete={handleDeleteCard}
            onUpdateQuantity={handleUpdateQuantity}
            isEditable={true}
          />
          <CardList
            cards={cards}
            type="offered"
            onDelete={handleDeleteCard}
            onUpdateQuantity={handleUpdateQuantity}
            isEditable={true}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              トレード提案
            </h2>
            <button
              onClick={() => router.push("/trade-offers/create")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              type="button"
            >
              新規作成
            </button>
          </div>
          {tradeOffers.length === 0 ? (
            <p className="text-gray-500 text-sm">
              トレード提案がまだ作成されていません
            </p>
          ) : (
            <div className="space-y-3">
              {tradeOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => router.push(`/trade-offers/${offer.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/trade-offers/${offer.id}`);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        トレード提案 #{offer.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ステータス:{" "}
                        {offer.status === "active" ? "アクティブ" : "クローズ"}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(offer.createdAt).toLocaleDateString("ja-JP")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
