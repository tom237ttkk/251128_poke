"use client";

import type { CardCollection } from "@/lib/types";

interface CardListProps {
  cards: CardCollection[];
  type: "wanted" | "offered";
  onDelete?: (cardId: string) => void;
  onUpdateQuantity?: (cardId: string, quantity: number) => void;
  isEditable?: boolean;
}

export function CardList({
  cards,
  type,
  onDelete,
  onUpdateQuantity,
  isEditable = false,
}: CardListProps) {
  const filteredCards = cards.filter((card) => card.cardType === type);
  const title = type === "wanted" ? "欲しいカード" : "出せるカード";
  const emptyMessage =
    type === "wanted"
      ? "欲しいカードがまだ登録されていません"
      : "出せるカードがまだ登録されていません";

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {filteredCards.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{card.cardName}</p>
                <p className="text-sm text-gray-500">数量: {card.quantity}</p>
              </div>
              {isEditable && (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={card.quantity}
                    onChange={(e) => {
                      const newQuantity = Number.parseInt(e.target.value, 10);
                      if (newQuantity > 0 && onUpdateQuantity) {
                        onUpdateQuantity(card.id, newQuantity);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => onDelete?.(card.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    type="button"
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
