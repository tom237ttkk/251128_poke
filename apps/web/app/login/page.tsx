"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorMessage } from "@/components/error-message";
import { useAuth } from "@/lib/contexts/auth.context";

export default function LoginPage() {
  const [pokepokeUserId, setPokepokeUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const validatePokepokeUserId = (id: string): boolean => {
    // ポケポケユーザーIDのバリデーション（10文字の英数字）
    const regex = /^[A-Z0-9]{10}$/;
    return regex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePokepokeUserId(pokepokeUserId)) {
      setError("ポケポケユーザーIDは10文字の英数字で入力してください");
      return;
    }

    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    if (isRegistering && !username) {
      setError("ユーザー名を入力してください");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await register(pokepokeUserId, username, password);
      } else {
        await login(pokepokeUserId, password);
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
              placeholder="例: ABC1234XYZ"
              value={pokepokeUserId}
              onChange={(e) => setPokepokeUserId(e.target.value.toUpperCase())}
            />
          </div>

          {isRegistering && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                ユーザー名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input mt-2"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input mt-2"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
