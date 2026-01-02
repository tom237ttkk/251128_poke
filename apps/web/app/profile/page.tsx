"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CardList } from "@/components/card-list";
import { CardSelector } from "@/components/card-selector";
import { ErrorMessage } from "@/components/error-message";
import { Loading } from "@/components/loading";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { CardCollectionService } from "@/lib/services/card-collection.service";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import type { CardCollection, TradeOffer } from "@/lib/types";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<CardCollection[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

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

  const handleAddWantedCard = async (cardId: string, quantity: number) => {
    try {
      const newCard = await CardCollectionService.addWantedCard(
        cardId,
        quantity
      );
      setCards([...cards, newCard]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "カードの追加に失敗しました"
      );
    }
  };

  const handleAddOfferedCard = async (cardId: string, quantity: number) => {
    try {
      const newCard = await CardCollectionService.addOfferedCard(
        cardId,
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

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="page">
      <Navigation />
      <main className="page-container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            プロフィール
          </h1>
          <p className="mt-2 text-sm text-gray-600">ユーザー名: {user.name}</p>
          <p className="text-sm text-gray-600">
            ポケポケユーザーID: {user.pokePokeId}
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

        <div className="card card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              トレード提案
            </h2>
            <button
              onClick={() => router.push("/trade-offers/create")}
              className="btn btn-primary"
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
                <button
                  key={offer.id}
                  className="rounded-lg border border-black/5 bg-white/50 p-4 cursor-pointer hover:bg-white/70 transition-colors"
                  onClick={() => router.push(`/trade-offers/${offer.id}`)}
                  type="button"
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
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
