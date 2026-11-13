import type { Plan, SimService } from "@/lib/site-content";

export type SimChoice = "corte" | "barba" | "combo";
export type SimDays = "seg-qua" | "qui-sab" | "seg-sab";
export type SimFrequency = 2 | 3 | 4;

export interface SimInput {
  service: SimChoice;
  visits: SimFrequency;
  days: SimDays;
}

export interface PlanEstimate {
  plan: Plan;
  /** Mensalidade em centavos. */
  baseCents: number;
  /** Cobranças além da mensalidade, em centavos. */
  extraCents: number;
  totalCents: number;
  perVisitCents: number;
}

export interface SimResult {
  input: SimInput;
  singleCents: number;
  estimates: PlanEstimate[];
  best: PlanEstimate | null;
  /** avulso − melhor plano; positivo = plano mais barato. */
  differenceCents: number;
}

/** Preço avulso por visita, em centavos (Corte R$ 40, Barba R$ 40). */
const SINGLE_CENTS: Record<SimService, number> = { corte: 4000, barba: 4000 };

const toCents = (value: number) => Math.round(value * 100);

export function needed(service: SimChoice): SimService[] {
  return service === "combo" ? ["corte", "barba"] : [service];
}

export function covers(plan: Plan, service: SimChoice): boolean {
  return needed(service).every((s) => plan.simulator.covers.includes(s));
}

/** Custo mensal de um plano para o regime escolhido, ou null se o plano não cobre o serviço. */
export function estimatePlan(plan: Plan, input: SimInput): PlanEstimate | null {
  if (!covers(plan, input.service)) return null;
  const rules = plan.simulator;
  // Without a split of visits by day, Smart has no exact full-week total.
  if (input.days === "seg-sab" && rules.offDayExtra) return null;
  const services = needed(input.service);
  const baseCents = toCents(plan.price);
  let extraCents = 0;
  if (rules.includedVisits !== undefined) {
    const paidVisits = Math.max(0, input.visits - rules.includedVisits);
    extraCents = paidVisits * toCents(rules.additionalVisit ?? 0);
  } else if (input.days === "qui-sab" && rules.offDayExtra) {
    const perVisit = services.reduce((sum, s) => sum + toCents(rules.offDayExtra?.[s] ?? 0), 0);
    extraCents = perVisit * input.visits;
  }
  const totalCents = baseCents + extraCents;
  return {
    plan,
    baseCents,
    extraCents,
    totalCents,
    perVisitCents: Math.round(totalCents / input.visits),
  };
}

export function singleCost(input: SimInput): number {
  return needed(input.service).reduce((sum, s) => sum + SINGLE_CENTS[s], 0) * input.visits;
}

/**
 * Compara todos os planos que cobrem o serviço escolhido. Recomenda o de menor custo
 * calculado (empate: o primeiro na ordem do catálogo) e mantém a diferença real
 * para o avulso, que pode ser negativa.
 */
export function simulate(plans: Plan[], input: SimInput): SimResult {
  const estimates = plans
    .map((p) => estimatePlan(p, input))
    .filter((e): e is PlanEstimate => e !== null)
    .sort((a, b) => a.totalCents - b.totalCents);
  const singleCents = singleCost(input);
  const best = estimates[0] ?? null;
  return {
    input,
    singleCents,
    estimates,
    best,
    differenceCents: best ? singleCents - best.totalCents : 0,
  };
}

export function formatCents(cents: number): string {
  const value = (Math.abs(cents) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${value}`;
}
