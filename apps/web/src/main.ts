import { bootstrapApplication } from "@angular/platform-browser";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
      <section style="text-align:center">
        <p style="font-weight:600;font-size:1.25rem;margin-bottom:0.5rem">Pokepoke Trade Platform</p>
        <p style="color:#555">Angular + Vite + Bun 初期セットアップ</p>
      </section>
    </main>
  `,
})
class AppComponent {}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
