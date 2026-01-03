import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./error-message";

const meta = {
  title: "Components/ErrorMessage",
  component: ErrorMessage,
  args: {
    message: "保存に失敗しました。もう一度お試しください。",
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongMessage: Story = {
  args: {
    message:
      "ネットワークが不安定なため処理に失敗しました。時間をおいて再度お試しください。",
  },
};
