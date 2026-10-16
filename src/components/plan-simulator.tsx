import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCents, simulate, type SimInput } from "@/lib/plan-calculator";
import { siteContent as content } from "@/lib/site-content";

import { serviceOptions, frequencyOptions, dayOptions } from "@/lib/simulator-options";

const allPlans = content.subscription.families.flatMap((f) => f.plans);

function Choice<T extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
  track,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  track: string;
}) {
  return (
    <fieldset className="sim-field">
      <legend>{legend}</legend>
      <div className="sim-options">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <span key={id}>
              <input
                type="radio"
                id={id}
                name={name}
                value={String(o.value)}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
                data-track={track}
                data-track-origin="simulator"
              />
              <label htmlFor={id}>{o.label}</label>
            </span>
          );
        })}
      </div>
    </fieldset>
  );
}

export function PlanSimulator({
  input,
  onChange,
}: {
  input: SimInput;
  onChange: (input: SimInput) => void;
}) {
  const result = simulate(allPlans, input);
  const { best, differenceCents, singleCents } = result;
  const dayShort = dayOptions.find((d) => d.value === input.days)?.short ?? "";
  const regime = `${serviceOptions.find((s) => s.value === input.service)?.label}, ${input.visits} visitas por mês, ${dayShort}`;

  let headline = "";
  let detail = "";
  if (best) {
    if (differenceCents > 0) {
      headline = `Menor custo estimado: ${best.plan.label}`;
      detail = `Estimativa de ${formatCents(differenceCents)} a menos por mês que o avulso.`;
    } else if (differenceCents < 0) {
      headline = "Para este regime, o avulso sai mais barato";
      detail = `O avulso custa ${formatCents(differenceCents)} menos que o plano mais barato (${best.plan.label}).`;
    } else {
      headline = `Empate entre avulso e ${best.plan.label}`;
      detail = "O custo mensal estimado é o mesmo.";
    }
  }

  return (
    <section
      id="simulador"
      className="section simulator-section"
      tabIndex={-1}
      aria-labelledby="simulator-title"
    >
      <div className="page-container simulator-layout">
        <div className="simulator-form">
          <p className="eyebrow">01 / Simulador</p>
          <h2 id="simulator-title">{content.simulator.title}</h2>
          <p className="lead">{content.simulator.text}</p>
          <Choice
            legend="Serviço"
            name="sim-service"
            options={serviceOptions}
            value={input.service}
            onChange={(service) => onChange({ ...input, service })}
            track="simulator-service"
          />
          <Choice
            legend="Visitas por mês"
            name="sim-visits"
            options={frequencyOptions.map((n) => ({ value: n, label: `${n} visitas` }))}
            value={input.visits}
            onChange={(visits) => onChange({ ...input, visits })}
            track="simulator-frequency"
          />
          <Choice
            legend="Dias em que você costuma vir"
            name="sim-days"
            options={dayOptions}
            value={input.days}
            onChange={(days) => onChange({ ...input, days })}
            track="simulator-day"
          />
        </div>

        <div className="simulator-result">
          <div aria-live="polite" aria-atomic="true" className="sim-summary">
            <p className="eyebrow">Resultado · {regime}</p>
            <p className="sim-headline">{headline}</p>
            <p>{detail}</p>
            {best && (
              <dl className="sim-figures">
                <div>
                  <dt>Total mensal do plano</dt>
                  <dd>{formatCents(best.totalCents)}</dd>
                </div>
                <div>
                  <dt>Mensalidade</dt>
                  <dd>{formatCents(best.baseCents)}</dd>
                </div>
                <div>
                  <dt>Adicionais no mês</dt>
                  <dd>{formatCents(best.extraCents)}</dd>
                </div>
                <div>
                  <dt>Custo por visita</dt>
                  <dd>{formatCents(best.perVisitCents)}</dd>
                </div>
                <div>
                  <dt>Avulso no mês</dt>
                  <dd>{formatCents(singleCents)}</dd>
                </div>
              </dl>
            )}
          </div>

          <details className="plan-more sim-comparison">
            <summary>Comparar todas as opções</summary>
            <div className="sim-table-scroll">
              <table className="sim-table">
                <caption>Comparação completa para este regime</caption>
                <thead>
                  <tr>
                    <th scope="col">Opção</th>
                    <th scope="col">Total/mês</th>
                    <th scope="col">Por visita</th>
                  </tr>
                </thead>
                <tbody>
                  {result.estimates.map((e) => (
                    <tr key={e.plan.id} data-best={e === best ? "" : undefined}>
                      <th scope="row">
                        {e.plan.label}
                        {e.extraCents > 0 && (
                          <span>
                            {formatCents(e.baseCents)} + {formatCents(e.extraCents)} adicionais
                          </span>
                        )}
                      </th>
                      <td>{formatCents(e.totalCents)}</td>
                      <td>{formatCents(e.perVisitCents)}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Avulso</th>
                    <td>{formatCents(singleCents)}</td>
                    <td>{formatCents(singleCents / input.visits)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
          <p className="note">{content.simulator.disclaimer}</p>
          <div className="sim-actions">
            <Button asChild variant="editorial">
              <a
                href={content.links.booking}
                target="_blank"
                rel="noopener noreferrer"
                data-track="booking"
                data-track-origin="simulator"
              >
                {content.simulator.action}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <a
              className="text-link"
              href={content.links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp"
              data-track-origin="simulator"
            >
              {content.whatsappCta.title} Fale pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
