import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-md mx-auto glass-card p-6 rounded-2xl">
      <p class="text-sm text-accent font-semibold mb-2">ログイン</p>
      <h2 class="text-2xl font-semibold mb-4">ポケポケ ID でサインイン</h2>
      <form class="space-y-4">
        <label class="block text-sm text-slate-300">
          ポケポケユーザー ID
          <input
            type="text"
            class="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:border-accent outline-none"
            placeholder="PP-1234-5678"
          />
        </label>
        <label class="block text-sm text-slate-300">
          パスワード
          <input
            type="password"
            class="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 focus:border-accent outline-none"
            placeholder="••••••••"
          />
        </label>
        <button
          type="button"
          class="w-full py-2 rounded-md bg-primary text-white font-semibold hover:-translate-y-0.5 transition"
        >
          ログイン
        </button>
      </form>
      <p class="text-sm text-slate-400 mt-4">
        アカウント未作成ですか？
        <a routerLink="/register" class="text-accent hover:underline">新規登録へ</a>
      </p>
    </section>
  `,
})
export class LoginComponent {}
