import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, siteContent as content } from "@/lib/site-content";

const periodPhrase: Record<string, string> = {
  Manhã: "pela manhã",
  Tarde: "à tarde",
  Noite: "à noite",
};

export function buildLeadMessage(input: {
  name: string;
  planLabel: string;
  price: number;
  period: string;
}): string {
  const name = input.name.trim();
  return [
    "Olá!",
    name ? `Sou ${name}.` : "",
    `Quero saber mais sobre o ${input.planLabel}, de ${formatPrice(input.price)} por mês.`,
    input.period ? `Costumo preferir ir ${periodPhrase[input.period] ?? input.period.toLowerCase()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Transforma o visitante em conversa com contexto: o formulário só monta a mensagem e abre o WhatsApp.
 * Funciona sem JavaScript (GET para wa.me) e nada é salvo neste site.
 */
export function LeadForm() {
  const plans = content.subscription.families.find((family) => family.id === "black")?.plans ?? [];
  const [name, setName] = useState("");
  const [planId, setPlanId] = useState(plans.find((plan) => plan.highlight)?.id ?? plans[0]?.id ?? "");
  const plan = plans.find((item) => item.id === planId);
  if (!plan) return null;
  const text = buildLeadMessage({ name, planLabel: plan.label, price: plan.price, period: "" });

  return (
    <section id="converse" className="section lead-section" tabIndex={-1} aria-labelledby="lead-title">
      <div className="page-container two-column">
        <div>
          <h2 id="lead-title">Converse antes de assinar.</h2>
          <p className="lead">
            Escolha o plano e abrimos o WhatsApp com a mensagem pronta. É só enviar.
          </p>
        </div>
        <form className="lead-form" action={content.links.whatsapp} method="get" target="_blank">
          <div className="field">
            <label htmlFor="lead-name">Seu nome</label>
            <input
              id="lead-name"
              type="text"
              autoComplete="given-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Como podemos te chamar?"
            />
          </div>
          <div className="field">
            <label htmlFor="lead-plan">Plano de interesse</label>
            <select id="lead-plan" value={planId} onChange={(event) => setPlanId(event.target.value)}>
              {plans.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} · {formatPrice(item.price)}/mês
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="text" value={text} />
          <Button type="submit" variant="editorial" data-track="whatsapp" data-track-origin="lead-form">
            <MessageCircle aria-hidden="true" />
            Enviar pelo WhatsApp
          </Button>
          <p className="note">Nada é salvo neste site. A conversa acontece só no seu WhatsApp.</p>
        </form>
      </div>
    </section>
  );
}
