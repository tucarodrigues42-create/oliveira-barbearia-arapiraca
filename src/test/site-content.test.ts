import { describe, expect, it } from "vitest";
import { formatPrice, siteContent } from "@/lib/site-content";

const plans = siteContent.subscription.families.flatMap((f) => f.plans);

describe("Clube OLVR content", () => {
  it("lists the 7 confirmed plans in three families", () => {
    expect(siteContent.subscription.families.map((f) => f.id)).toEqual(["black", "smart", "one"]);
    expect(plans).toHaveLength(7);
  });

  it('never presents an "Ilimitado" plan without its monthly allowance', () => {
    for (const plan of plans.filter((p) => /ilimitad/i.test(p.name))) {
      // Aceita variações de redação da franquia, desde que exponha os 100 usos mensais.
      expect(plan.allowance).toMatch(/100\s*(utilizações|usos)/i);
    }
  });

  it("keeps visible labels free of 'ilimitado' and simulator rules consistent with extras", () => {
    for (const plan of plans) {
      expect(plan.label).not.toMatch(/ilimitad/i);
      for (const [service, price] of Object.entries(plan.simulator.offDayExtra ?? {})) {
        const charge = plan.extras?.charges.find((c) => c.service.toLowerCase() === service);
        expect(charge?.price).toBe(price);
      }
    }
  });

  it("keeps Pezinho out of Smart Corte e Barba", () => {
    expect(plans.find((p) => p.id === "smart-corte-barba")?.includes).not.toContain("Pezinho");
  });

  it("formats prices in BRL", () => {
    expect(formatPrice(67.9)).toBe("R$ 67,90");
    expect(formatPrice(30)).toBe("R$ 30");
  });
});
