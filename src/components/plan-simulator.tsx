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
        <p className="eyebrow">Clube OLVR / Encontre seu Black</p>
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
                    <span>{formatPrice(plan.price)} / mês</span>
                  </span>
                  <Check aria-hidden="true" className="black-choice-check" />
                </label>
              );
            })}
          </div>
        </fieldset>
        <div id="black-result" className="black-result" key={selected.id}>
          <div className="black-result-copy">
            <div aria-live="polite" aria-atomic="true">
              <p className="eyebrow">Seu cuidado escolhido</p>
              <h3>{selected.label}</h3>
              <p className="black-inclusions">{selected.includes.join(" + ")} incluídos.</p>
              <p className="plan-price">
                {formatPrice(selected.price)}
                <span>/mês</span>
              </p>
            </div>
            <p>{family.days} · Mediante agendamento.</p>
            <p className="note">{selected.allowance}</p>
          </div>
          <div className="black-result-actions">
            <details className="plan-more black-benefits">
              <summary>
                Veja todos os benefícios <span aria-hidden="true">+</span>
              </summary>
              <ul>
                {selected.includes.map((service) => (
                  <li key={service}>
                    <Check aria-hidden="true" />
                    {service} incluído
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
              <ul>
                {content.subscription.conditions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="note">{content.subscription.conditionsNote}</p>
            </details>
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
        <a href="#planos" className="text-link black-other-plans">
          Conhecer também Smart e Clube One <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
