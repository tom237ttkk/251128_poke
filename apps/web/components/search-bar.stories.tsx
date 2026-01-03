import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { SearchBar } from "./search-bar";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  args: {
    onSearch: fn(),
    placeholder: "カード名で検索",
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortPlaceholder: Story = {
  args: {
    placeholder: "検索",
  },
};
