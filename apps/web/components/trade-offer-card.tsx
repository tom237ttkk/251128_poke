import Link from "next/link";
import type { TradeOffer } from "@/lib/types";

interface TradeOfferCardProps {
  tradeOffer: TradeOffer;
}

export function TradeOfferCard({ tradeOffer }: TradeOfferCardProps) {
  const wantedCards =
    tradeOffer.cards?.filter((c) => c.cardType === "wanted") || [];
  const offeredCards =
    tradeOffer.cards?.filter((c) => c.cardType === "offered") || [];

  return (
    <Link href={`/trade-offers/${tradeOffer.id}`}>
      <div className="card card-body hover:shadow-md hover:bg-white/80 transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">
              作成者: {tradeOffer.user?.pokepokeUserId || "不明"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(tradeOffer.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <span
            className={`badge ${
              tradeOffer.status === "active" ? "badge-active" : "badge-closed"
            }`}
          >
            {tradeOffer.status === "active" ? "アクティブ" : "クローズ"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              欲しいカード
            </h3>
            {wantedCards.length === 0 ? (
              <p className="text-xs text-gray-400">なし</p>
            ) : (
              <ul className="space-y-1">
                {wantedCards.slice(0, 3).map((card) => (
                  <li key={card.id} className="text-sm text-gray-600">
                    {card.cardName} ×{card.quantity}
                  </li>
                ))}
                {wantedCards.length > 3 && (
                  <li className="text-xs text-gray-400">
                    他 {wantedCards.length - 3} 件
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              出せるカード
            </h3>
            {offeredCards.length === 0 ? (
              <p className="text-xs text-gray-400">なし</p>
            ) : (
              <ul className="space-y-1">
                {offeredCards.slice(0, 3).map((card) => (
                  <li key={card.id} className="text-sm text-gray-600">
                    {card.cardName} ×{card.quantity}
                  </li>
                ))}
                {offeredCards.length > 3 && (
                  <li className="text-xs text-gray-400">
                    他 {offeredCards.length - 3} 件
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
