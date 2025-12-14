import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import type { User } from "@prisma/client";

// Extend Hono's ContextVariables to include 'user'
type Variables = {
  user: {
    id: string;
    role: string;
    isBlacklisted: boolean;
  };
};

// In a real app, use existing types or environment config
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    try {
      const payload = await verify(token, JWT_SECRET);
      // We assume payload has what we need, simplified
      c.set("user", payload as unknown as Variables["user"]);
      await next();
    } catch (e) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
);

export const adminMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const user = c.get("user");
    if (user?.role !== "ADMIN") {
      return c.json({ error: "Forbidden" }, 403);
    }
    await next();
  }
);

export const blacklistMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const user = c.get("user");
    if (user?.isBlacklisted) {
      return c.json({ error: "Account is restricted" }, 403);
    }
    await next();
  }
);
