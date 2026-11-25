/**
 * Mensuração de cliques com Umami Cloud (sem cookies).
 *
 * Os botões já carregam `data-track` + `data-track-origin`; um único ouvinte no
 * documento traduz esses atributos em eventos. Um clique em "agendar" ou "assinar"
 * é apenas a ida ao Cash Barber, nunca um agendamento ou assinatura concluída.
 */
import { siteContent } from "@/lib/site-content";

export const UMAMI_SCRIPT_SRC = "https://cloud.umami.is/script.js";

export type AnalyticsEventName =
  "agendar" | "assinar" | "whatsapp" | "instagram" | "maps" | "phone";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  data: { origem: string };
}

/** Origens de "booking" que saem da seção de planos contam como intenção de assinar. */
const SUBSCRIBE_ORIGINS = /^(plans|black-selector)/;

const PASSTHROUGH: ReadonlySet<string> = new Set(["whatsapp", "instagram", "maps", "phone"]);

export function umamiWebsiteId(): string {
  return siteContent.analytics.umamiWebsiteId.trim();
}

/** Converte os atributos data-track de um elemento em evento; null para cliques que não medimos. */
export function resolveTrackEvent(
  track: string | null,
  origin: string | null,
): AnalyticsEvent | null {
  if (!track) return null;
  const origem = origin?.trim() || "desconhecida";
  if (track === "booking") {
    return { name: SUBSCRIBE_ORIGINS.test(origem) ? "assinar" : "agendar", data: { origem } };
  }
  if (PASSTHROUGH.has(track)) return { name: track as AnalyticsEventName, data: { origem } };
  return null;
}

type UmamiWindow = Window & {
  umami?: { track: (name: string, data?: Record<string, string>) => void };
};

/** Liga o ouvinte de cliques; devolve a função que o remove. */
export function installClickTracking(doc: Document = document): () => void {
  const onClick = (event: MouseEvent) => {
    const el = (event.target as Element | null)?.closest?.("[data-track]");
    if (!el) return;
    const tracked = resolveTrackEvent(
      el.getAttribute("data-track"),
      el.getAttribute("data-track-origin"),
    );
    if (!tracked) return;
    try {
      (doc.defaultView as UmamiWindow | null)?.umami?.track(tracked.name, tracked.data);
    } catch {
      // Falha de mensuração nunca pode atrapalhar o clique.
    }
  };
  doc.addEventListener("click", onClick, { capture: true });
  return () => doc.removeEventListener("click", onClick, { capture: true });
}
