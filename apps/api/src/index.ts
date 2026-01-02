import { Hono } from "hono";
import { cors } from "hono/cors";
import authController from "./auth/auth.controller.js";
import userController from "./users/user.controller.js";
import packController from "./packs/pack.controller.js";
import cardController from "./cards/card.controller.js";
import tradeController from "./trades/trade.controller.js";
import searchController from "./search/search.controller.js";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/auth", authController);
app.route("/api/users", userController);
app.route("/api/packs", packController);
app.route("/api/cards", cardController);
app.route("/api/trades", tradeController);
app.route("/api/search", searchController);

export default {
  port: 3100,
  fetch: app.fetch,
};
