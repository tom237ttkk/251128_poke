import { Hono } from "hono";
import authController from "./auth/auth.controller.js";
import userController from "./users/user.controller.js";
import cardController from "./cards/card.controller.js";
import tradeController from "./trades/trade.controller.js";
import searchController from "./search/search.controller.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/auth", authController);
app.route("/api/users", userController);
app.route("/api/cards", cardController);
app.route("/api/trades", tradeController);
app.route("/api/search", searchController);

export default {
  port: 3100,
  fetch: app.fetch,
};
