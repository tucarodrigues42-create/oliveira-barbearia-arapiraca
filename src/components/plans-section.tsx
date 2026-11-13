import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ArrowRight, Check, ChevronDown, Minus } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { formatPrice, siteContent as content, type Plan } from "@/lib/site-content";
import clubLogo from "@/assets/clube-olvr-branco.png.asset.json";

function PlanCompare({ plans }: { plans: Plan[] }) {
  const services = [...new Set(plans.flatMap((plan) => plan.includes))];
  if (plans.length < 2) return null;
  return (
    <div className="plan-compare-box">
      <div className="plan-compare" role="region" aria-label="Comparação dos planos" tabIndex={0}>
        <table>
          <caption className="sr-only">O que cada plano inclui</caption>
          <thead>
            <tr>
              <th scope="col">Inclui</th>
              {plans.map((plan) => (
                <th scope="col" key={plan.id}>
                  {plan.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service}>
                <th scope="row">{service}</th>
                {plans.map((plan) => (
                  <td key={plan.id}>
                    {plan.includes.includes(service) ? (
                      <Check aria-label="Incluso" />
                    ) : (
                      <Minus className="no" aria-label="Não incluso" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Dias</th>
              {plans.map((plan) => (
                <td key={plan.id}>{plan.includedDays}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Por mês</th>
              {plans.map((plan) => (
                <td key={plan.id} className="price-cell">
                  {formatPrice(plan.price)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="swipe-hint swipe-hint-table" aria-hidden="true">
        Deslize a tabela para ver todos <ArrowRight />
      </p>
    </div>
  );
}

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
  // Todos os planos ficam recolhidos para não poluir; abrem ao tocar ou ao chegar por um link "#planos".
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#planos") setOpen(true);
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href="#planos"]');
      if (link) setOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      document.removeEventListener("click", onClick);
    };
  }, []);
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
            <h2 id="plans-title">{sub.name}</h2>
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

        <details
          className="plans-all"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary>
            Ver todos os planos
            <ChevronDown aria-hidden="true" />
          </summary>
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
              <PlanCompare plans={f.plans} />
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
        </details>
      </div>
    </section>
  );
}
