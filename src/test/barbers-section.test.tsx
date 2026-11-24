import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BarbersSection } from "@/components/barbers-section";

afterEach(cleanup);
describe("Quem corta", () => {
  it("mostra uma aba por barbeiro e começa pelo dono", () => {
    render(<BarbersSection bookingHref="https://exemplo.test/agenda" />);
    expect(screen.getByRole("heading", { name: "Quem corta o seu cabelo." })).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(["João Paulo", "Jackson Delano", "Arthur Vinícius"]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Dono e criador da Oliveira Barbearia")).toBeInTheDocument();
  });

  it("troca o conteúdo ao escolher outro barbeiro e mantém o link de agenda", () => {
    render(<BarbersSection bookingHref="https://exemplo.test/agenda" />);
    // O Radix ativa a aba no mouseDown, não no click.
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Jackson Delano" }), { button: 0, ctrlKey: false });
    expect(screen.getByRole("heading", { name: "Jackson Delano" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Agendar no Cash Barber/ })).toHaveAttribute(
      "href",
      "https://exemplo.test/agenda",
    );
  });
});
