import { Check, Star } from "lucide-react";
import { siteContent as content } from "@/lib/site-content";

/** Reversão de risco e prova social no ponto do clique. Só fatos já confirmados em site-content. */
export function TrustRow({ className = "" }: { className?: string }) {
  const rating = content.reviews.rating.toFixed(1).replace(".", ",");
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
      <li>
        <Star aria-hidden="true" />
        {rating} · {content.reviews.count} avaliações no Google
      </li>
    </ul>
  );
}
