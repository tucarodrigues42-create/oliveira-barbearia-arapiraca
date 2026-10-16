import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlackSelector } from "@/components/plan-simulator";

afterEach(cleanup);
describe("Black selector", () => {
  it("updates the chosen plan, booking label and WhatsApp message together", () => {
    render(<BlackSelector />);
    for (const [choice, plan, price] of [
      ["Minha barba", "Black Barba", "67,90"],
      ["Visual completo", "Black Corte e Barba", "117,90"],
      ["Meu cabelo", "Black Corte", "67,90"],
    ] as const) {
      fireEvent.click(screen.getByRole("radio", { name: new RegExp(choice!) }));
      expect(screen.getByRole("heading", { name: plan })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Conhecer o ${plan}` })).toHaveAttribute(
        "href",
        "https://cashbarber.com.br/oliveirabsara",
      );
      const href = screen
        .getByRole("link", { name: "Tirar dúvidas sobre este Black" })
        .getAttribute("href")!;
      const url = new URL(href);
      expect(url.origin + url.pathname).toBe("https://wa.me/5582981820974");
      expect(url.searchParams.get("text")).toContain(plan);
      expect(url.searchParams.get("text")).toContain(price);
    }
  });
  it("keeps allowance, rules and alternative plans available", () => {
    render(<BlackSelector />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText("Veja todos os benefícios").closest("details")).not.toHaveAttribute(
      "open",
    );
    expect(screen.getByRole("link", { name: /Conhecer também Smart/ })).toHaveAttribute(
      "href",
      "#planos",
    );
    expect(screen.queryByText(/Menor custo/)).not.toBeInTheDocument();
  });
});
