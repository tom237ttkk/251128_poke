import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { CardCollection } from "@/lib/types";
import { CardList } from "./card-list";

const sampleCards: CardCollection[] = [
  {
    id: "1",
    userId: "user-1",
    cardId: "card-1",
    cardName: "ピカチュウ",
    cardType: "wanted",
    quantity: 1,
    createdAt: "2025-11-01T00:00:00+09:00",
    updatedAt: "2025-11-01T00:00:00+09:00",
  },
  {
    id: "2",
    userId: "user-1",
    cardId: "card-2",
    cardName: "リザードン",
    cardType: "wanted",
    quantity: 2,
    createdAt: "2025-11-01T00:00:00+09:00",
    updatedAt: "2025-11-01T00:00:00+09:00",
  },
  {
    id: "3",
    userId: "user-1",
    cardId: "card-3",
    cardName: "フシギダネ",
    cardType: "offered",
    quantity: 3,
    createdAt: "2025-11-01T00:00:00+09:00",
    updatedAt: "2025-11-01T00:00:00+09:00",
  },
];

const meta = {
  title: "Components/CardList",
  component: CardList,
  args: {
    cards: sampleCards,
    type: "wanted",
    onDelete: fn(),
    onUpdateQuantity: fn(),
  },
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wanted: Story = {};

export const Offered: Story = {
  args: {
    type: "offered",
  },
};

export const Editable: Story = {
  args: {
    isEditable: true,
  },
};

export const Empty: Story = {
  args: {
    cards: [],
    type: "wanted",
  },
};
