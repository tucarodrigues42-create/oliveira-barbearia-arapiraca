import { Check } from "lucide-react";

/** Reversão de risco no ponto do clique. Só fatos já confirmados em site-content. */
export function TrustRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`trust-row ${className}`.trim()} aria-label="Garantias e avaliações">
      <li>
        <Check aria-hidden="true" />
        Cancele quando quiser, sem multa
      </li>
      <li>
        <Check aria-hidden="true" />
        Cobrança mensal no cartão de crédito
      </li>
    </ul>
  );
}
