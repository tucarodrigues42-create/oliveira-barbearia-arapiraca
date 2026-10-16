import { describe, expect, it } from "vitest";
import { estimatePlan, formatCents, simulate } from "@/lib/plan-calculator";
import { siteContent } from "@/lib/site-content";

const plans = siteContent.subscription.families.flatMap((f) => f.plans);
const byId = (id: string) => plans.find((p) => p.id === id)!;

describe("plan calculator", () => {
  it("Clube One: 1 incluído + R$ 15 por corte adicional", () => {
    const two = estimatePlan(byId("clube-one"), { service: "corte", visits: 2, days: "qui-sab" })!;
    expect(two.totalCents).toBe(4190);
    const r2 = simulate(plans, { service: "corte", visits: 2, days: "seg-qua" });
    expect(r2.best?.plan.id).toBe("clube-one");
    expect(r2.differenceCents).toBe(1810);
    const four = estimatePlan(byId("clube-one"), { service: "corte", visits: 4, days: "seg-qua" })!;
    expect(four.totalCents).toBe(7190);
    expect(simulate(plans, { service: "corte", visits: 4, days: "seg-qua" }).singleCents).toBe(12000);
  });

  it("Smart combo seg–qua 2 visitas: 107,90 vs 120, economia 12,10", () => {
    const r = simulate(plans, { service: "combo", visits: 2, days: "seg-qua" });
    expect(r.best?.plan.id).toBe("smart-corte-barba");
    expect(r.best?.totalCents).toBe(10790);
    expect(r.differenceCents).toBe(1210);
  });

  it("Black combo 2 visitas = 117,90", () => {
    const e = estimatePlan(byId("black-corte-barba"), { service: "combo", visits: 2, days: "qui-sab" })!;
    expect(e.totalCents).toBe(11790);
  });

  it("Smart combo qui–sáb 2 visitas = 167,90 e avulso fica mais barato", () => {
    const e = estimatePlan(byId("smart-corte-barba"), { service: "combo", visits: 2, days: "qui-sab" })!;
    expect(e.totalCents).toBe(16790);
    const r = simulate(plans, { service: "combo", visits: 2, days: "qui-sab" });
    expect(r.best?.plan.id).toBe("black-corte-barba");
    expect(r.differenceCents).toBe(12000 - 11790);
  });

  it("only compares plans that cover every chosen service", () => {
    const r = simulate(plans, { service: "combo", visits: 3, days: "seg-qua" });
    expect(r.estimates.map((e) => e.plan.id).sort()).toEqual(["black-corte-barba", "smart-corte-barba"]);
    const barba = simulate(plans, { service: "barba", visits: 3, days: "seg-qua" });
    expect(barba.estimates.map((e) => e.plan.id)).not.toContain("clube-one");
  });

  it("reports negative difference when single visits are cheaper", () => {
    const r = simulate(plans, { service: "barba", visits: 2, days: "qui-sab" });
    expect(r.singleCents).toBe(6000);
    expect(r.differenceCents).toBeLessThan(0);
  });

  it("works in integer cents and formats BRL", () => {
    const e = estimatePlan(byId("smart-corte"), { service: "corte", visits: 3, days: "qui-sab" })!;
    expect(e.totalCents).toBe(5790 + 4500);
    expect(e.perVisitCents).toBe(Math.round(10290 / 3));
    expect(formatCents(4190)).toBe("R$ 41,90");
  });
});
