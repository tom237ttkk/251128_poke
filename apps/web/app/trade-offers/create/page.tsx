"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/error-message";
import { Loading } from "@/components/loading";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/features/auth/contexts/auth.context";
import { CardCollectionService } from "@/features/cards/services/card-collection.service";
import { TradeOfferService } from "@/features/trades/services/trade-offer.service";
import type { CardCollection } from "@/lib/types";

export default function CreateTradeOfferPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<CardCollection[]>([]);
  const [selectedWanted, setSelectedWanted] = useState<Map<string, number>>(
    new Map()
  );
  const [selectedOffered, setSelectedOffered] = useState<Map<string, number>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const cardsData = await CardCollectionService.getMyCards();
        setCards(cardsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "カードコレクションの読み込みに失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCards();
    }
  }, [isAuthenticated]);

  const wantedCards = cards.filter((c) => c.cardType === "wanted");
  const offeredCards = cards.filter((c) => c.cardType === "offered");

  const handleToggleWanted = (cardId: string) => {
    const newSelected = new Map(selectedWanted);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      const card = cards.find((c) => c.id === cardId);
      newSelected.set(cardId, card?.quantity || 1);
    }
    setSelectedWanted(newSelected);
  };

  const handleToggleOffered = (cardId: string) => {
    const newSelected = new Map(selectedOffered);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      const card = cards.find((c) => c.id === cardId);
      newSelected.set(cardId, card?.quantity || 1);
    }
    setSelectedOffered(newSelected);
  };

  const handleQuantityChange = (
    cardId: string,
    quantity: number,
    type: "wanted" | "offered"
  ) => {
    if (type === "wanted") {
      const newSelected = new Map(selectedWanted);
      newSelected.set(cardId, quantity);
      setSelectedWanted(newSelected);
    } else {
      const newSelected = new Map(selectedOffered);
      newSelected.set(cardId, quantity);
      setSelectedOffered(newSelected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedWanted.size === 0 && selectedOffered.size === 0) {
      setError("少なくとも1枚のカードを選択してください");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const wantedCardsData = Array.from(selectedWanted.entries()).map(
        ([cardId, quantity]) => {
          const card = cards.find((c) => c.id === cardId);
          return { cardName: card?.cardName || "", quantity };
        }
      );

      const offeredCardsData = Array.from(selectedOffered.entries()).map(
        ([cardId, quantity]) => {
          const card = cards.find((c) => c.id === cardId);
          return { cardName: card?.cardName || "", quantity };
        }
      );

      await TradeOfferService.createTradeOffer({
        wantedCards: wantedCardsData,
        offeredCards: offeredCardsData,
      });

      router.push("/profile");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "トレード提案の作成に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page">
      <Navigation />
      <main className="page-container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            トレード提案を作成
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            カードコレクションから選択してトレード提案を作成します
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card card-body">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                欲しいカード
              </h2>
              {wantedCards.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  欲しいカードが登録されていません
                </p>
              ) : (
                <div className="space-y-2">
                  {wantedCards.map((card) => (
                    <label
                      key={card.id}
                      className="flex items-center rounded-lg border border-black/5 bg-white/50 p-3 cursor-pointer hover:bg-white/70 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWanted.has(card.id)}
                        onChange={() => handleToggleWanted(card.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 flex-1 text-gray-900">
                        {card.cardName}
                      </span>
                      {selectedWanted.has(card.id) && (
                        <input
                          type="number"
                          min="1"
                          max={card.quantity}
                          value={selectedWanted.get(card.id)}
                          onChange={(e) =>
                            handleQuantityChange(
                              card.id,
                              Number.parseInt(e.target.value, 10),
                              "wanted"
                            )
                          }
                          className="input w-20 py-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="card card-body">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                出せるカード
              </h2>
              {offeredCards.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  出せるカードが登録されていません
                </p>
              ) : (
                <div className="space-y-2">
                  {offeredCards.map((card) => (
                    <label
                      key={card.id}
                      className="flex items-center rounded-lg border border-black/5 bg-white/50 p-3 cursor-pointer hover:bg-white/70 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOffered.has(card.id)}
                        onChange={() => handleToggleOffered(card.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 flex-1 text-gray-900">
                        {card.cardName}
                      </span>
                      {selectedOffered.has(card.id) && (
                        <input
                          type="number"
                          min="1"
                          max={card.quantity}
                          value={selectedOffered.get(card.id)}
                          onChange={(e) =>
                            handleQuantityChange(
                              card.id,
                              Number.parseInt(e.target.value, 10),
                              "offered"
                            )
                          }
                          className="input w-20 py-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                (selectedWanted.size === 0 && selectedOffered.size === 0)
              }
              className="btn btn-primary"
            >
              {isSubmitting ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
