import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-offer-detail",
  imports: [CommonModule, RouterLink],
  template: `
    <section class="space-y-4">
      <a routerLink="/offers" class="text-sm text-accent hover:underline">← 一覧へ戻る</a>
      <div class="glass-card p-5 rounded-2xl">
        <p class="text-sm text-slate-400">提案 ID: {{ offerId }}</p>
        <h2 class="text-2xl font-semibold mb-2">ピカチュウセットと交換希望</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-slate-400 mb-1">欲しいカード</p>
            <ul class="space-y-1 text-sm">
              <li class="flex justify-between"><span>Mewtwo</span><span class="text-slate-400">x1</span></li>
            </ul>
          </div>
          <div>
            <p class="text-sm text-slate-400 mb-1">出せるカード</p>
            <ul class="space-y-1 text-sm">
              <li class="flex justify-between"><span>Pikachu V</span><span class="text-slate-400">x1</span></li>
              <li class="flex justify-between"><span>Pikachu VMAX</span><span class="text-slate-400">x1</span></li>
            </ul>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="px-4 py-2 rounded-md bg-primary text-white text-sm">チャットを開始</button>
          <button class="px-4 py-2 rounded-md border border-white/10 text-sm hover:border-accent">
            ブラックリスト確認
          </button>
        </div>
      </div>
    </section>
  `,
})
export class OfferDetailComponent {
  offerId = this.route.snapshot.paramMap.get("id");

  constructor(private route: ActivatedRoute) {}
}
