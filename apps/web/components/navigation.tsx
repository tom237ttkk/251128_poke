"use client";

import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth.context";
import { useRouter } from "next/navigation";

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-gray-900"
            >
              ポケポケトレード
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/trade-offers"
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  トレード提案検索
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  プロフィール
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {user?.pokepokeUserId}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  type="button"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
