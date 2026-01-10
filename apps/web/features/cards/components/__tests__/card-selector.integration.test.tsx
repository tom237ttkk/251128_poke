import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { CardSelector } from "../card-selector";

describe("CardSelector Integration", () => {
  it('renders correctly for "wanted" type', () => {
    render(<CardSelector type="wanted" onAdd={vi.fn()} />);
    expect(screen.getByText("欲しいカードを追加")).toBeInTheDocument();
    expect(screen.getByLabelText("カード名")).toBeInTheDocument();
    expect(screen.getByLabelText("数量")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  it('renders correctly for "offered" type', () => {
    render(<CardSelector type="offered" onAdd={vi.fn()} />);
    expect(screen.getByText("出せるカードを追加")).toBeInTheDocument();
  });

  it("calls onAdd when form is submitted", async () => {
    const mockOnAdd = vi.fn().mockResolvedValue(undefined);
    render(<CardSelector type="wanted" onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText("カード名"), {
      target: { value: "Pikachu" },
    });
    fireEvent.change(screen.getByLabelText("数量"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith("Pikachu", 2);
    });
  });

  it("clears form after successful submission", async () => {
    const mockOnAdd = vi.fn().mockResolvedValue(undefined);
    render(<CardSelector type="wanted" onAdd={mockOnAdd} />);

    const nameInput = screen.getByLabelText("カード名");
    const quantityInput = screen.getByLabelText("数量");

    fireEvent.change(nameInput, { target: { value: "Charizard" } });
    fireEvent.change(quantityInput, { target: { value: "1" } }); // Set to non-default if needed, but 1 is default
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(quantityInput).toHaveValue(1);
    });
  });

  it("shows loading state during submission", async () => {
    let resolvePromise: (value: void) => void;
    const mockOnAdd = vi.fn().mockReturnValue(
      new Promise<void>((resolve) => {
        resolvePromise = resolve;
      })
    );
    render(<CardSelector type="wanted" onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText("カード名"), {
      target: { value: "Mewtwo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveTextContent("追加中...");

    resolvePromise!();

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
      expect(screen.getByRole("button")).toHaveTextContent("追加");
    });
  });

  it("does not submit if card name is empty", () => {
    const mockOnAdd = vi.fn();
    render(<CardSelector type="wanted" onAdd={mockOnAdd} />);

    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
