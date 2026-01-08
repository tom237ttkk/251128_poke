"use client";

import { useEffect, useState } from "react";
import { PackService } from "@/features/cards/services/pack.service";
import { CardMasterService } from "@/features/cards/services/card-master.service";
import type { Pack, Card } from "@/lib/types";

interface CardSelectorProps {
  type: "wanted" | "offered";
  onAdd: (cardId: string, quantity: number) => Promise<void>;
}

export function CardSelector({ type, onAdd }: CardSelectorProps) {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedPackId, setSelectedPackId] = useState("");
  const [selectedCardId, setSelectedCardId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPacks, setIsLoadingPacks] = useState(true);

  const title = type === "wanted" ? "欲しいカードを追加" : "出せるカードを追加";

  useEffect(() => {
    const loadPacks = async () => {
      try {
        const packsData = await PackService.getPacks();
        setPacks(packsData);
      } catch (error) {
        console.error("Failed to load packs:", error);
      } finally {
        setIsLoadingPacks(false);
      }
    };

    loadPacks();
  }, []);

  useEffect(() => {
    const loadCards = async () => {
      if (!selectedPackId) {
        setCards([]);
        return;
      }

      try {
        const cardsData = await CardMasterService.getCardMaster(selectedPackId);
        setCards(cardsData);
      } catch (error) {
        console.error("Failed to load cards:", error);
      }
    };

    loadCards();
  }, [selectedPackId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId) return;

    setIsLoading(true);
    try {
      await onAdd(selectedCardId, quantity);
      setSelectedPackId("");
      setSelectedCardId("");
      setQuantity(1);
    } catch (error) {
      console.error("Failed to add card:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card card-body">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor={`pack-${type}`}
            className="block text-sm font-medium text-gray-700"
          >
            収録パック
          </label>
          <select
            id={`pack-${type}`}
            value={selectedPackId}
            onChange={(e) => {
              setSelectedPackId(e.target.value);
              setSelectedCardId("");
            }}
            className="input mt-2"
            required
            disabled={isLoadingPacks}
          >
            <option value="">
              {isLoadingPacks ? "読み込み中..." : "パックを選択"}
            </option>
            {packs.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name} {pack.code ? `(${pack.code})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`card-${type}`}
            className="block text-sm font-medium text-gray-700"
          >
            カード
          </label>
          <select
            id={`card-${type}`}
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
            className="input mt-2"
            required
            disabled={!selectedPackId || cards.length === 0}
          >
            <option value="">
              {!selectedPackId
                ? "まずパックを選択してください"
                : cards.length === 0
                ? "カードがありません"
                : "カードを選択"}
            </option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name} {card.rarity ? `[${card.rarity}]` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`quantity-${type}`}
            className="block text-sm font-medium text-gray-700"
          >
            数量
          </label>
          <input
            type="number"
            id={`quantity-${type}`}
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value, 10))}
            className="input mt-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedCardId}
          className="btn btn-primary w-full"
        >
          {isLoading ? "追加中..." : "追加"}
        </button>
      </form>
    </div>
  );
}
