import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => c.json({ status: "ok" }));

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 3000);
  console.log(`API server listening on http://localhost:${port}`);
  Bun.serve({ fetch: app.fetch, port });
}

export default app;
