import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LeadForm, buildLeadMessage } from "@/components/lead-form";

afterEach(cleanup);

describe("Lead form", () => {
  it("builds the WhatsApp message from confirmed plan data", () => {
    expect(
      buildLeadMessage({ name: " Ana ", planLabel: "Black Corte", price: 67.9, period: "Noite" }),
    ).toBe("Olá! Sou Ana. Quero saber mais sobre o Black Corte, de R$ 67,90 por mês. Costumo preferir ir à noite.");
    expect(buildLeadMessage({ name: "", planLabel: "Black Barba", price: 67.9, period: "" })).toBe(
      "Olá! Quero saber mais sobre o Black Barba, de R$ 67,90 por mês.",
    );
  });

  it("sends a GET to wa.me with the message ready, without storing anything", () => {
    const { container } = render(<LeadForm />);
    const form = container.querySelector("form")!;
    expect(form).toHaveAttribute("action", "https://wa.me/5582981820974");
    expect(form).toHaveAttribute("method", "get");
    const text = () => container.querySelector<HTMLInputElement>('input[name="text"]')!.value;
    expect(text()).toContain("Black Corte e Barba");
    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Rui" } });
    fireEvent.change(screen.getByLabelText("Plano de interesse"), {
      target: { value: "black-barba" },
    });
    expect(text()).toContain("Sou Rui.");
    expect(text()).toContain("Black Barba");
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByText(/Nada é salvo neste site/)).toBeInTheDocument();
  });
});
