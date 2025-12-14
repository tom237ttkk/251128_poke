import { Hono } from "hono";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../middlewares/auth.js";

const app = new Hono<{
  Variables: {
    user: {
      id: string;
      role: string;
      isBlacklisted: boolean;
    };
  };
}>();

app.post("/register", async (c) => {
  try {
    const { pokePokeId, name, password } = await c.req.json();
    if (!pokePokeId || !name || !password) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    const result = await authService.register(pokePokeId, name, password);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.post("/login", async (c) => {
  try {
    const { pokePokeId, password } = await c.req.json();
    if (!pokePokeId || !password) {
      return c.json({ error: "Missing credentials" }, 400);
    }
    const result = await authService.login(pokePokeId, password);
    return c.json(result);
  } catch (e: any) {
    return c.json({ error: e.message }, 401);
  }
});

app.get("/me", authMiddleware, async (c) => {
  try {
    // authMiddleware sets 'user' in context
    const user = c.get("user");
    const profile = await authService.me(user.id);
    return c.json(profile);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
