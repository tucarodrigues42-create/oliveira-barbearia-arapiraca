import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlackSelector } from "@/components/plan-simulator";

afterEach(cleanup);
describe("Black selector", () => {
  it("updates the chosen plan, booking label and WhatsApp message together", () => {
    render(<BlackSelector />);
    for (const [choice, plan, price] of [
      ["BARBA", "Black Barba", "67,90"],
      ["CORTE + BARBA", "Black Corte e Barba", "117,90"],
      ["CORTE", "Black Corte", "67,90"],
    ] as const) {
      fireEvent.click(screen.getByRole("radio", { name: choice }));
      expect(screen.getByText(plan, { selector: "p.eyebrow" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Assinar o ${plan}` })).toHaveAttribute(
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
  it("calculates all three comparisons from confirmed service prices", () => {
    render(<BlackSelector />);
    const radios = screen.getAllByRole("radio");
    for (const [index, total, saving, label] of [
      [0, "R$ 120", "52,10", "4 cortes avulsos"],
      [1, "R$ 120", "52,10", "4 barbas avulsas"],
      [2, "R$ 240", "122,10", "4 cortes + 4 barbas"],
    ] as const) {
      fireEvent.click(radios[index]!);
      expect(screen.getByText(total)).toBeInTheDocument();
      expect(screen.getByText(`Economize R$ ${saving} no mês`)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
  it("keeps allowance, rules and alternative plans available", () => {
    render(<BlackSelector />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText("Veja o que você ganha").closest("details")).not.toHaveAttribute(
      "open",
    );
    expect(screen.getByRole("link", { name: /Conhecer também Smart/ })).toHaveAttribute(
      "href",
      "#planos",
    );
    expect(screen.queryByText(/Menor custo/)).not.toBeInTheDocument();
  });
});
