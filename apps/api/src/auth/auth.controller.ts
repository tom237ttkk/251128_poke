import { Hono } from "hono";
import {
  loginRequestSchema,
  registerRequestSchema,
} from "@pokepoke/shared";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../middlewares/auth.js";
import { parseJson, validationError } from "../utils/validation.js";

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
    const parsed = await parseJson(c, registerRequestSchema);
    if (!parsed.success) {
      return c.json({ error: validationError(parsed.error.flatten()) }, 400);
    }
    const { pokePokeId, name, password } = parsed.data;
    const result = await authService.register(pokePokeId, name, password);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.post("/login", async (c) => {
  try {
    const parsed = await parseJson(c, loginRequestSchema);
    if (!parsed.success) {
      return c.json({ error: validationError(parsed.error.flatten()) }, 400);
    }
    const { pokePokeId, password } = parsed.data;
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
