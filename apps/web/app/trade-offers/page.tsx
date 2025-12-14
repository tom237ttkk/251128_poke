"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorMessage } from "@/components/error-message";
import { Loading } from "@/components/loading";
import { Navigation } from "@/components/navigation";
import { SearchBar } from "@/components/search-bar";
import { TradeOfferCard } from "@/components/trade-offer-card";
import { TradeOfferService } from "@/lib/services/trade-offer.service";
import type { TradeOffer } from "@/lib/types";

export default function TradeOffersPage() {
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTradeOffers = useCallback(
    async (query?: string, page: number = 1) => {
      try {
        setIsLoading(true);
        const { tradeOffers: offers, total } =
          await TradeOfferService.searchTradeOffers(query, page);
        setTradeOffers(offers);
        setTotalPages(Math.ceil(total / 20)); // 20 items per page
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "トレード提案の読み込みに失敗しました",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadTradeOffers();
  }, [loadTradeOffers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadTradeOffers(query, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTradeOffers(searchQuery || undefined, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <Navigation />
      <main className="page-container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
            トレード提案検索
          </h1>
          <SearchBar onSearch={handleSearch} placeholder="カード名で検索..." />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {isLoading ? (
          <Loading />
        ) : tradeOffers.length === 0 ? (
          <div className="card card-body text-center py-12">
            <p className="text-gray-600">
              {searchQuery
                ? "検索結果が見つかりませんでした"
                : "トレード提案がまだありません"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {tradeOffers.map((offer) => (
                <TradeOfferCard key={offer.id} tradeOffer={offer} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  type="button"
                >
                  前へ
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                  type="button"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
