import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

type SearchResult = { id: string; title: string; user: string; card: string };

@Component({
  standalone: true,
  selector: "app-search",
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">検索</p>
          <h2 class="text-2xl font-semibold">カード名で提案を探す</h2>
        </div>
        <button class="px-3 py-2 border border-white/10 rounded-md text-sm hover:border-accent">フィルタ</button>
      </div>

      <div class="glass-card p-4 rounded-xl">
        <input
          type="search"
          class="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 focus:border-accent outline-none"
          placeholder="例: Pikachu"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <article
          *ngFor="let result of results"
          class="glass-card p-4 rounded-xl border border-white/5 hover:border-accent/60 transition"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">{{ result.title }}</h3>
            <span class="text-xs text-slate-400">@{{ result.user }}</span>
          </div>
          <p class="text-sm text-slate-300">含まれるカード: {{ result.card }}</p>
          <a [routerLink]="['/offers', result.id]" class="text-accent text-sm hover:underline mt-2 inline-block">
            詳細を見る →
          </a>
        </article>
      </div>
    </section>
  `,
})
export class SearchComponent {
  results: SearchResult[] = [
    { id: "1", title: "ピカチュウセット", user: "trainer_k", card: "Pikachu VMAX" },
    { id: "2", title: "雷デッキパーツ", user: "spark_user", card: "Pikachu V" },
  ];
}
