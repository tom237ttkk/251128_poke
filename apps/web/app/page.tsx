import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="page">
      <Navigation />
      <main className="page-container py-14 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">
            <span className="block">ポケポケカードを</span>
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              安全にトレード
            </span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg text-gray-600">
            欲しいカードと出せるカードを整理して、提案・チャットまでスムーズに。
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="btn btn-primary w-full sm:w-auto px-8 py-3 text-base"
            >
              はじめる
            </Link>
            <Link
              href="/trade-offers"
              className="btn btn-secondary w-full sm:w-auto px-8 py-3 text-base"
            >
              トレード提案を見る
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card card-body">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>ユーザー</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-gray-900">
                簡単登録
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                ポケポケユーザーIDで、すぐに始められます。
              </p>
            </div>

            <div className="card card-body">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>検索</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-gray-900">
                トレード検索
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                欲しいカードから、提案をスッと探せます。
              </p>
            </div>

            <div className="card card-body">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>チャット</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-gray-900">
                チャット機能
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                提案ごとに、相手と直接やり取りできます。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
