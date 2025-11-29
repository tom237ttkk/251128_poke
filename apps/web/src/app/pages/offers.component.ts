import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

type Offer = {
  id: string;
  title: string;
  want: string[];
  give: string[];
  status: "active" | "closed";
};

@Component({
  standalone: true,
  selector: "app-offers",
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">提案一覧</p>
          <h2 class="text-2xl font-semibold">公開中のトレード</h2>
        </div>
        <button class="px-3 py-2 bg-primary text-white rounded-md text-sm">新規作成</button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <article
          *ngFor="let offer of offers"
          class="glass-card p-4 rounded-xl border border-white/5 hover:border-accent/60 transition"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">{{ offer.title }}</h3>
            <span
              class="text-xs px-2 py-1 rounded-full"
              [class.bg-green-500/20]="offer.status === 'active'"
              [class.text-green-300]="offer.status === 'active'"
              [class.bg-slate-500/20]="offer.status === 'closed'"
              [class.text-slate-200]="offer.status === 'closed'"
            >
              {{ offer.status }}
            </span>
          </div>
          <p class="text-sm text-slate-400">欲しい: {{ offer.want.join(", ") }}</p>
          <p class="text-sm text-slate-400">出せる: {{ offer.give.join(", ") }}</p>
          <a
            class="text-accent text-sm mt-3 inline-flex items-center gap-1 hover:underline"
            [routerLink]="['/offers', offer.id]"
          >
            詳細を見る →
          </a>
        </article>
      </div>
    </section>
  `,
})
export class OffersComponent {
  offers: Offer[] = [
    { id: "1", title: "火属性コレクション交換", want: ["Charizard EX"], give: ["Arcanine", "Growlithe"], status: "active" },
    { id: "2", title: "ピカチュウセットと交換希望", want: ["Mewtwo"], give: ["Pikachu V", "Pikachu VMAX"], status: "active" },
  ];
}
