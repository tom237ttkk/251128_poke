import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen text-slate-100">
      <header class="sticky top-0 z-20 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a routerLink="/" class="text-lg font-semibold text-slate-50">Pokepoke Trade</a>
          <nav class="flex gap-4 text-sm">
            <a routerLink="/search" class="hover:text-accent transition-colors">検索</a>
            <a routerLink="/offers" class="hover:text-accent transition-colors">提案一覧</a>
            <a routerLink="/profile" class="hover:text-accent transition-colors">プロフィール</a>
            <a routerLink="/login" class="hover:text-accent transition-colors">ログイン</a>
          </nav>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-6 py-10">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
