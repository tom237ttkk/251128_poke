import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { CardList } from "../card-list";
import type { CardCollection } from "@/lib/types";

const mockCards: CardCollection[] = [
  {
    id: "1",
    userId: "u1",
    cardName: "Pikachu",
    cardType: "wanted",
    quantity: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "u1",
    cardName: "Charizard",
    cardType: "wanted",
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    userId: "u1",
    cardName: "Bulbasaur",
    cardType: "offered",
    quantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("CardList Integration", () => {
  it("renders wanted cards correctly", () => {
    render(<CardList cards={mockCards} type="wanted" />);
    expect(screen.getByText("欲しいカード")).toBeInTheDocument();
    expect(screen.getByText("Pikachu")).toBeInTheDocument();
    expect(screen.getByText("数量: 2")).toBeInTheDocument();
    expect(screen.getByText("Charizard")).toBeInTheDocument();
    expect(screen.queryByText("Bulbasaur")).not.toBeInTheDocument(); // Wrong type
  });

  it("renders offered cards correctly", () => {
    render(<CardList cards={mockCards} type="offered" />);
    expect(screen.getByText("出せるカード")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.queryByText("Pikachu")).not.toBeInTheDocument();
  });

  it("shows empty message when no cards match", () => {
    render(<CardList cards={[]} type="wanted" />);
    expect(
      screen.getByText("欲しいカードがまだ登録されていません")
    ).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = vi.fn();
    render(
      <CardList
        cards={mockCards}
        type="wanted"
        isEditable={true}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText("削除");
    fireEvent.click(deleteButtons[0]); // Click first delete button (Pikachu)

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("calls onUpdateQuantity when quantity is changed", () => {
    const mockOnUpdate = vi.fn();
    render(
      <CardList
        cards={mockCards}
        type="wanted"
        isEditable={true}
        onUpdateQuantity={mockOnUpdate}
      />
    );

    const quantityInputs = screen.getAllByRole("spinbutton"); // number input
    fireEvent.change(quantityInputs[0], { target: { value: "3" } }); // Change Pikachu quantity

    expect(mockOnUpdate).toHaveBeenCalledWith("1", 3);
  });

  it("does not show edit controls when isEditable is false", () => {
    render(<CardList cards={mockCards} type="wanted" isEditable={false} />);
    expect(screen.queryByText("削除")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });
});
