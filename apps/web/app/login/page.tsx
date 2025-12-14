"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { ErrorMessage } from "@/components/error-message";

export default function LoginPage() {
  const [pokepokeUserId, setPokepokeUserId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const validatePokepokeUserId = (id: string): boolean => {
    // ポケポケユーザーIDのバリデーション（4-20文字の英数字）
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    return regex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePokepokeUserId(pokepokeUserId)) {
      setError("ポケポケユーザーIDは4-20文字の英数字で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await register(pokepokeUserId);
      } else {
        await login(pokepokeUserId);
      }
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? "新規登録" : "ログイン"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ポケポケトレードプラットフォームへようこそ
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="pokepoke-user-id" className="sr-only">
                ポケポケユーザーID
              </label>
              <input
                id="pokepoke-user-id"
                name="pokepokeUserId"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="ポケポケユーザーID"
                value={pokepokeUserId}
                onChange={(e) => setPokepokeUserId(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "処理中..." : isRegistering ? "登録" : "ログイン"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isRegistering
                ? "既にアカウントをお持ちの方はこちら"
                : "新規登録はこちら"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
