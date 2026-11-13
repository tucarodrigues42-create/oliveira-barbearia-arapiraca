import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { formatPrice, siteContent as content, type Plan } from "@/lib/site-content";
import clubLogo from "@/assets/clube-olvr-branco.png.asset.json";

function PlanCard({ plan, bookingWindow }: { plan: Plan; bookingWindow: string }) {
  return (
    <li className="plan-card" data-highlight={plan.highlight ? "" : undefined}>
      {plan.highlight && plan.highlightLabel && (
        <span className="plan-badge">{plan.highlightLabel}</span>
      )}
      <h4>{plan.label}</h4>
      <p className="plan-price">
        {formatPrice(plan.price)}
        <span>/mês</span>
      </p>
      <p className="plan-days">Atendimento: {plan.includedDays.toLowerCase()}</p>
      {plan.benefit && <p className="plan-benefit">{plan.benefit}</p>}
      <details className="plan-more">
        <summary>
          Serviços e regras
          <ChevronDown aria-hidden="true" />
        </summary>
        <dl>
          <div>
            <dt>Nome no Cash Barber</dt>
            <dd>{plan.name}</dd>
          </div>
          <div>
            <dt>Inclui</dt>
            <dd>{plan.includes.join(", ")}</dd>
          </div>
          {plan.allowance && (
            <div>
              <dt>Franquia</dt>
              <dd>{plan.allowance}</dd>
            </div>
          )}
          <div>
            <dt>Dias incluídos</dt>
            <dd>{plan.includedDays}</dd>
          </div>
          {plan.extras && (
            <div>
              <dt>{plan.extras.days}</dt>
              <dd>
                {plan.extras.charges
                  .map((c) => `${c.service} ${formatPrice(c.price)}${c.note ? ` (${c.note})` : ""}`)
                  .join(" · ")}
              </dd>
            </div>
          )}
          <div>
            <dt>Antecedência</dt>
            <dd>{bookingWindow}</dd>
          </div>
        </dl>
      </details>
    </li>
  );
}

export function PlansSection({ action }: { action: ReactNode }) {
  const sub = content.subscription;
  const [family, setFamily] = useState<string>(sub.families[0]?.id ?? "black");
  return (
    <section
      id="planos"
      className="section plans-section"
      tabIndex={-1}
      aria-labelledby="plans-title"
    >
      <div className="page-container">
        <div className="plans-intro">
          <div>
            <p className="eyebrow">{sub.description}</p>
            <h2 id="plans-title">{sub.name}</h2>
            <p className="club-tagline">{sub.title}</p>
            <p className="lead">{sub.text}</p>
          </div>
          <img
            className="club-logo"
            src={clubLogo.url}
            width={1660}
            height={844}
            loading="lazy"
            decoding="async"
            alt="Marca oficial do Clube OLVR, clube de assinatura da Oliveira Barbearia"
          />
        </div>

        <TabsPrimitive.Root value={family} onValueChange={setFamily} className="plan-tabs">
          <TabsPrimitive.List className="plan-tablist" aria-label="Famílias de planos">
            {sub.families.map((f) => (
              <TabsPrimitive.Trigger
                key={f.id}
                value={f.id}
                className="plan-tab"
                data-track="plans-family"
                data-track-origin={`tab-${f.id}`}
              >
                {f.name}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
          {sub.families.map((f) => (
            <TabsPrimitive.Content key={f.id} value={f.id} className="plan-panel">
              <div className="plan-panel-head">
                <h3>{f.name}</h3>
                <p>{f.valueHighlight ?? f.summary}</p>
                <ul className="plan-family-meta">
                  <li>{f.days}</li>
                  <li>{f.bookingWindow}</li>
                </ul>
              </div>
              <p className="swipe-hint" aria-hidden="true">
                Deslize para ver os planos <ArrowRight />
              </p>
              <ul className="plan-cards">
                {f.plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} bookingWindow={f.bookingWindow} />
                ))}
              </ul>
            </TabsPrimitive.Content>
          ))}
        </TabsPrimitive.Root>

        <div className="plan-conditions">
          <details className="plan-more">
            <summary>
              Condições de todos os planos
              <ChevronDown aria-hidden="true" />
            </summary>
            <ul>
              {sub.conditions.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="note">{sub.conditionsNote}</p>
          </details>
          <div className="plan-conditions-action">{action}</div>
        </div>
      </div>
    </section>
  );
}
