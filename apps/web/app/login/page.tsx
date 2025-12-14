"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorMessage } from "@/components/error-message";
import { useAuth } from "@/lib/contexts/auth.context";

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
    <div className="page flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="card w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isRegistering ? "新規登録" : "ログイン"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ポケポケトレードプラットフォームへようこそ
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="pokepoke-user-id"
              className="block text-sm font-medium text-gray-700"
            >
              ポケポケユーザーID
            </label>
            <input
              id="pokepoke-user-id"
              name="pokepokeUserId"
              type="text"
              required
              className="input mt-2"
              placeholder="ポケポケユーザーID"
              value={pokepokeUserId}
              onChange={(e) => setPokepokeUserId(e.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">
              4-20文字の英数字で入力してください
            </p>
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
              className="btn btn-primary w-full"
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
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
