"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { CardCollectionService } from "@/lib/services/card-collection.service";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import { Navigation } from "@/components/navigation";
import { Loading } from "@/components/loading";
import { ErrorMessage } from "@/components/error-message";
import type { CardCollection } from "@/lib/types";

export default function CreateTradeOfferPage() {
  const { isAuthenticated } = useAuth();
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

  const handleToggleWanted = (cardId: string, cardName: string) => {
    const newSelected = new Map(selectedWanted);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      const card = cards.find((c) => c.id === cardId);
      newSelected.set(cardId, card?.quantity || 1);
    }
    setSelectedWanted(newSelected);
  };

  const handleToggleOffered = (cardId: string, cardName: string) => {
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

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
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
            <div className="bg-white shadow rounded-lg p-6">
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
                      className="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWanted.has(card.id)}
                        onChange={() =>
                          handleToggleWanted(card.id, card.cardName)
                        }
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
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
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
                      className="flex items-center p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOffered.has(card.id)}
                        onChange={() =>
                          handleToggleOffered(card.id, card.cardName)
                        }
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
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md"
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
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                (selectedWanted.size === 0 && selectedOffered.size === 0)
              }
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
