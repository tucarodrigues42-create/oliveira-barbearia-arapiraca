import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { formatPrice, siteContent as content, type PlanFamily } from "@/lib/site-content";
import clubLogo from "@/assets/clube-olvr-branco.png.asset.json";

function Family({ family }: { family: PlanFamily }) {
  const headingId = `familia-${family.id}`;
  return (
    <section className="plan-family" aria-labelledby={headingId}>
      <header className="plan-family-head">
        <h3 id={headingId}>{family.name}</h3>
        <p>{family.summary}</p>
        <ul className="plan-family-meta">
          <li>{family.days}</li>
          <li>{family.bookingWindow}</li>
        </ul>
      </header>
      <ul className="plan-rows">
        {family.plans.map((plan) => (
          <li key={plan.id} className="plan-row">
            <div className="plan-name">
              <h4>{plan.name}</h4>
              <p className="plan-price">
                {formatPrice(plan.price)}
                <span>/mês</span>
              </p>
            </div>
            <dl className="plan-details">
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
                      .map(
                        (c) =>
                          `${c.service} ${formatPrice(c.price)}${c.note ? ` (${c.note})` : ""}`,
                      )
                      .join(" · ")}
                  </dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlansSection({ action }: { action: ReactNode }) {
  const sub = content.subscription;
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
            <p className="eyebrow">02 / {sub.description}</p>
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
        <div className="plan-families">
          {sub.families.map((family) => (
            <Family key={family.id} family={family} />
          ))}
        </div>
        <div className="plan-conditions">
          <div>
            <h3>Condições para todos os planos</h3>
            <ul>
              {sub.conditions.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="note">{sub.conditionsNote}</p>
          </div>
          <div className="plan-conditions-action">{action}</div>
        </div>
      </div>
    </section>
  );
}
