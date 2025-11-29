import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-home",
  imports: [RouterLink],
  template: `
    <section class="grid gap-8 md:grid-cols-2 items-center">
      <div class="space-y-4">
        <p class="text-sm text-accent font-semibold">Pokepoke Trade Platform</p>
        <h1 class="text-4xl font-semibold leading-tight">
          欲しいカードと出せるカードを<br class="hidden md:block" />安全にマッチング
        </h1>
        <p class="text-slate-300">
          ブラックリスト連動の検索とチャットで、安心してトレードを進められるプラットフォームです。
        </p>
        <div class="flex gap-3">
          <a
            routerLink="/register"
            class="px-4 py-2 rounded-md bg-primary text-white font-semibold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition"
            >新規登録</a
          >
          <a
            routerLink="/search"
            class="px-4 py-2 rounded-md border border-white/10 hover:border-accent hover:text-accent transition"
            >提案を探す</a
          >
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="glass-card p-4 rounded-xl">
          <p class="text-sm text-slate-400">ステータス</p>
          <p class="text-xl font-semibold">アクティブ提案</p>
          <p class="text-3xl font-bold text-accent">128</p>
        </div>
        <div class="glass-card p-4 rounded-xl">
          <p class="text-sm text-slate-400">安心フィルタ</p>
          <p class="text-xl font-semibold">ブラックリスト除外</p>
          <p class="text-sm text-slate-300">安全な相手だけを表示</p>
        </div>
        <div class="glass-card p-4 rounded-xl col-span-2">
          <p class="text-sm text-slate-400 mb-2">フロー</p>
          <ol class="space-y-2 text-slate-200 text-sm">
            <li>1. 欲しいカードと出せるカードを登録</li>
            <li>2. トレード提案を作成または検索</li>
            <li>3. チャットで条件をすり合わせ</li>
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}
