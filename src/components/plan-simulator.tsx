import { useState } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, siteContent as content } from "@/lib/site-content";

/** Reuses the former simulator module so existing installations need no file deletion. */
export function BlackSelector() {
  const family = content.subscription.families.find((item) => item.id === "black");
  const [selectedId, setSelectedId] = useState("black-corte");
  const selected = family?.plans.find((plan) => plan.id === selectedId);
  if (!family || !selected) return null;
  const choice = content.blackSelector.choices.find((item) => item.planId === selected.id);
  const services = choice?.comparisonServices.map((name) =>
    content.services.find((service) => service.name === name),
  );
  // Hide the comparison if a confirmed service price is missing; never assume zero.
  const hasPrices = services?.length && services.every((service) => service !== undefined);
  const totalCents =
    services?.reduce((sum, service) => sum + Math.round((service?.price ?? 0) * 100) * 4, 0) ?? 0;
  const savingCents = totalCents - Math.round(selected.price * 100);
  const whatsapp = new URL(content.links.whatsapp);
  whatsapp.searchParams.set(
    "text",
    `Olá! Gostaria de saber mais sobre o ${selected.label}, de ${formatPrice(selected.price)} por mês.`,
  );

  return (
    <section
      id="seu-black"
      className="section black-selector"
      aria-labelledby="black-selector-title"
      tabIndex={-1}
    >
      <span id="simulador" className="legacy-anchor" aria-hidden="true" />
      <div className="page-container">
        <p className="eyebrow">Clube OLVR / Encontre meu plano</p>
        <h2 id="black-selector-title">{content.blackSelector.title}</h2>
        <p className="lead">{content.blackSelector.text}</p>
        <fieldset className="black-choices">
          <legend>O que você quer manter em dia?</legend>
          <div className="black-choice-grid">
            {content.blackSelector.choices.map((choice) => {
              const plan = family.plans.find((item) => item.id === choice.planId);
              if (!plan) return null;
              return (
                <label
                  key={choice.planId}
                  className="black-choice"
                  data-selected={selectedId === plan.id ? "true" : undefined}
                >
                  <input
                    type="radio"
                    name="black-care"
                    value={plan.id}
                    checked={selectedId === plan.id}
                    onChange={() => setSelectedId(plan.id)}
                    aria-controls="black-result"
                    data-track="black-choice"
                    data-track-origin={plan.id}
                  />
                  <span>
                    <strong>{choice.label}</strong>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div id="black-result" className="black-result">
          <div className="black-result-copy">
            <div aria-live="polite" aria-atomic="true">
              <p className="eyebrow">{selected.label}</p>
              <h3 className="black-unlimited">{choice?.headline}</h3>
              <p className="plan-price">
                {formatPrice(selected.price)}
                <span>/mês</span>
              </p>
            </div>
            <p>{family.days} · Mediante agendamento.</p>
            <div className="black-result-actions">
              <Button asChild variant="editorial">
                <a
                  href={content.links.booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="booking"
                  data-track-origin={`black-selector-${selected.id}`}
                >
                  Conhecer o {selected.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              <p className="note">
                Abre o Cash Barber. Selecione o {selected.label} para consultar e contratar.
              </p>
              <Button asChild variant="editorialOutline">
                <a
                  href={whatsapp.toString()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp"
                  data-track-origin={`black-selector-${selected.id}`}
                >
                  <MessageCircle aria-hidden="true" />
                  Tirar dúvidas sobre este Black
                </a>
              </Button>
            </div>
          </div>
          <div className="black-result-details">
            {Boolean(hasPrices) && choice && (
              <div
                className="black-comparison"
                aria-label="Comparação com serviços avulsos"
                aria-live="polite"
                aria-atomic="true"
              >
                <h4>{choice.comparisonTitle}</h4>
                <p className="note">
                  {services
                    ?.map((service) => `${service!.name}: ${formatPrice(service!.price)} avulso`)
                    .join(" · ")}
                </p>
                <dl>
                  <div>
                    <dt>{choice.comparisonLabel}</dt>
                    <dd>{formatPrice(totalCents / 100)}</dd>
                  </div>
                  <div>
                    <dt>{selected.label} por mês</dt>
                    <dd>{formatPrice(selected.price)}</dd>
                  </div>
                </dl>
                <p className="black-saving">
                  {savingCents > 0
                    ? `Economize ${formatPrice(savingCents / 100)} no mês`
                    : "Compare os serviços e benefícios do plano"}
                </p>
                <p className="note">
                  Comparação para quem faz {choice.comparisonLabel.toLowerCase()} no mês.{" "}
                  {choice.benefit} Economia condicionada a essa frequência de uso.
                </p>
              </div>
            )}
            <details className="plan-more black-benefits" key={selected.id}>
              <summary>
                Veja o que você ganha <span aria-hidden="true">+</span>
              </summary>
              <ul>
                {selected.includes.map((service) => (
                  <li key={service}>
                    <Check aria-hidden="true" />
                    {service} sem pagar a mais
                  </li>
                ))}
                <li>
                  <Check aria-hidden="true" />
                  {family.bookingWindow}
                </li>
                <li>
                  <Check aria-hidden="true" />
                  {content.blackSelector.extras}
                </li>
              </ul>
            </details>
            <details className="plan-more black-terms">
              <summary>
                Pagamento, cancelamento e regras <span aria-hidden="true">+</span>
              </summary>
              <p className="note">{selected.allowance} · Mediante agendamento.</p>
              <ul>
                {content.subscription.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="note">{content.subscription.conditionsNote}</p>
            </details>
          </div>
        </div>
        <a href="#planos" className="text-link black-other-plans">
          Conhecer também Smart e Clube One <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
