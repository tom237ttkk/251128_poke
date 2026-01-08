import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginPage from "./page";
import * as AuthContext from "@/features/auth/contexts/auth.context";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock useAuth
const mockLogin = vi.fn();
const mockRegister = vi.fn();
vi.mock("@/features/auth/contexts/auth.context", async (importOriginal) => {
  const actual = await importOriginal<typeof AuthContext>();
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      login: mockLogin,
      register: mockRegister,
      isAuthenticated: false,
      isLoading: false,
    })),
  };
});

describe("LoginPage Integration", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
  });

  it("renders login form by default", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { name: "ログイン" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("ポケポケユーザーID")
    ).toBeInTheDocument();
  });

  it("switches to registration form", () => {
    render(<LoginPage />);
    const switchButton = screen.getByText("新規登録はこちら");
    fireEvent.click(switchButton);
    expect(
      screen.getByRole("heading", { name: "新規登録" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  it("validates user ID format", () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText("ポケポケユーザーID");
    const submitButton = screen.getByRole("button", { name: "ログイン" });

    // Input invalid ID (too short)
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(submitButton);
    expect(
      screen.getByText("ポケポケユーザーIDは4-20文字の英数字で入力してください")
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls login and redirects on success", async () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText("ポケポケユーザーID");
    const submitButton = screen.getByRole("button", { name: "ログイン" });

    fireEvent.change(input, { target: { value: "testuser" } });
    mockLogin.mockResolvedValueOnce(undefined); // Success

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("testuser");
      expect(mockPush).toHaveBeenCalledWith("/profile");
    });
  });

  it("calls register and redirects on success", async () => {
    render(<LoginPage />);
    // Switch to register
    fireEvent.click(screen.getByText("新規登録はこちら"));

    const input = screen.getByPlaceholderText("ポケポケユーザーID");
    const submitButton = screen.getByRole("button", { name: "登録" });

    fireEvent.change(input, { target: { value: "newuser" } });
    mockRegister.mockResolvedValueOnce(undefined); // Success

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("newuser");
      expect(mockPush).toHaveBeenCalledWith("/profile");
    });
  });

  it("displays error message on failure", async () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText("ポケポケユーザーID");
    const submitButton = screen.getByRole("button", { name: "ログイン" });

    fireEvent.change(input, { target: { value: "failuser" } });
    mockLogin.mockRejectedValueOnce(new Error("Login failed"));

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Login failed")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
