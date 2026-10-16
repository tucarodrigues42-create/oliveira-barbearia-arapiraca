import type { SimChoice, SimDays, SimFrequency } from "./plan-calculator";

export const serviceOptions: { value: SimChoice; label: string }[] = [
  { value: "corte", label: "Corte" },
  { value: "barba", label: "Barba" },
  { value: "combo", label: "Corte e barba" },
];
export const frequencyOptions: SimFrequency[] = [2, 3, 4];
export const dayOptions: { value: SimDays; label: string; short: string }[] = [
  { value: "seg-qua", label: "Segunda a quarta", short: "seg–qua" },
  { value: "qui-sab", label: "Quinta a sábado", short: "qui–sáb" },
];
