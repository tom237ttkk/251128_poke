import type { Meta, StoryObj } from "@storybook/react";
import type { TradeOffer } from "@/lib/types";
import { TradeOfferCard } from "./trade-offer-card";

const baseOffer: TradeOffer = {
  id: "offer-1",
  userId: "user-1",
  status: "active",
  createdAt: new Date("2025-11-08T09:00:00+09:00"),
  updatedAt: new Date("2025-11-08T09:00:00+09:00"),
  user: {
    id: "user-1",
    pokePokeId: "poke-1234",
    name: "トレーナーA",
    role: "user",
    isBlacklisted: false,
    createdAt: new Date("2025-11-01"),
  },
  cards: [
    {
      id: "toc-1",
      tradeOfferId: "offer-1",
      cardName: "ピカチュウ",
      cardType: "wanted",
      quantity: 1,
      createdAt: new Date("2025-11-08T09:00:00+09:00"),
    },
    {
      id: "toc-2",
      tradeOfferId: "offer-1",
      cardName: "リザードン",
      cardType: "wanted",
      quantity: 2,
      createdAt: new Date("2025-11-08T09:00:00+09:00"),
    },
    {
      id: "toc-3",
      tradeOfferId: "offer-1",
      cardName: "フシギダネ",
      cardType: "offered",
      quantity: 1,
      createdAt: new Date("2025-11-08T09:00:00+09:00"),
    },
    {
      id: "toc-4",
      tradeOfferId: "offer-1",
      cardName: "ゼニガメ",
      cardType: "offered",
      quantity: 3,
      createdAt: new Date("2025-11-08T09:00:00+09:00"),
    },
  ],
};

const meta = {
  title: "Components/TradeOfferCard",
  component: TradeOfferCard,
  args: {
    tradeOffer: baseOffer,
  },
} satisfies Meta<typeof TradeOfferCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Closed: Story = {
  args: {
    tradeOffer: {
      ...baseOffer,
      status: "closed",
    },
  },
};

export const Minimal: Story = {
  args: {
    tradeOffer: {
      id: "offer-2",
      userId: "user-2",
      status: "active",
      createdAt: new Date("2025-11-12T12:00:00+09:00"),
      updatedAt: new Date("2025-11-12T12:00:00+09:00"),
      cards: [],
    },
  },
};
