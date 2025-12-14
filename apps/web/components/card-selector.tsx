"use client";

import { useState } from "react";

interface CardSelectorProps {
  type: "wanted" | "offered";
  onAdd: (cardName: string, quantity: number) => Promise<void>;
}

export function CardSelector({ type, onAdd }: CardSelectorProps) {
  const [cardName, setCardName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const title = type === "wanted" ? "欲しいカードを追加" : "出せるカードを追加";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    setIsLoading(true);
    try {
      await onAdd(cardName.trim(), quantity);
      setCardName("");
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
            htmlFor={`card-name-${type}`}
            className="block text-sm font-medium text-gray-700"
          >
            カード名
          </label>
          <input
            type="text"
            id={`card-name-${type}`}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="input mt-2"
            placeholder="カード名を入力"
            required
          />
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
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? "追加中..." : "追加"}
        </button>
      </form>
    </div>
  );
}
