import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

type CardItem = { name: string; qty: number };

@Component({
  standalone: true,
  selector: "app-profile",
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <p class="text-sm text-slate-400">プロフィール</p>
          <h2 class="text-2xl font-semibold">pokepoke_user_01</h2>
        </div>
        <button class="px-3 py-2 bg-primary text-white rounded-md text-sm">編集</button>
      </header>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="glass-card p-4 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">欲しいカード</h3>
            <button class="text-accent text-sm">追加</button>
          </div>
          <ul class="space-y-2 text-sm">
            <li *ngFor="let card of wanted" class="flex justify-between">
              <span>{{ card.name }}</span>
              <span class="text-slate-400">x{{ card.qty }}</span>
            </li>
          </ul>
        </div>

        <div class="glass-card p-4 rounded-xl">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold">出せるカード</h3>
            <button class="text-accent text-sm">追加</button>
          </div>
          <ul class="space-y-2 text-sm">
            <li *ngFor="let card of offered" class="flex justify-between">
              <span>{{ card.name }}</span>
              <span class="text-slate-400">x{{ card.qty }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
})
export class ProfileComponent {
  wanted: CardItem[] = [
    { name: "Pikachu V", qty: 1 },
    { name: "Charizard EX", qty: 1 },
  ];
  offered: CardItem[] = [
    { name: "Bulbasaur (Holo)", qty: 2 },
    { name: "Squirtle", qty: 3 },
  ];
}
