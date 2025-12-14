"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center text-lg font-semibold tracking-tight text-gray-900"
            >
              ポケポケトレード
            </Link>
            {isAuthenticated && (
              <div className="hidden items-center gap-4 sm:flex">
                <Link
                  href="/trade-offers"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  トレード提案検索
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  プロフィール
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden rounded-full border border-black/5 bg-white/60 px-3 py-1 text-sm text-gray-700 sm:inline-flex">
                  {user?.pokepokeUserId}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  type="button"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary">
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
