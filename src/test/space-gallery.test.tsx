import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SpaceGallery } from "@/components/space-gallery";

afterEach(cleanup);
describe("Galeria do espaço", () => {
  it("mostra as três fotos com texto alternativo e carregamento preguiçoso", () => {
    render(<SpaceGallery />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    for (const image of images) {
      expect(image.getAttribute("alt")?.length).toBeGreaterThan(20);
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image.getAttribute("src")).toMatch(/^\/fotos\/[a-z]+-900\.webp$/);
    }
    expect(screen.getByRole("heading", { name: "Veja onde o corte acontece." })).toBeInTheDocument();
  });
});
