# Oliveira Barbearia — Arapiraca–AL

Site institucional de página única (TanStack Start). Sem backend, login, agenda ou pagamento próprios: agendamentos e assinaturas acontecem no Cash Barber (https://cashbarber.com.br/oliveirabsara).

## Conteúdo centralizado
Todo texto factual fica em `src/lib/site-content.ts`: abertura, links oficiais, horário, endereço, serviços avulsos, famílias de planos do Clube OLVR (Black, Smart, One), condições, avaliações fornecidas (5,0/315 em 13/10/2026, atualização manual), passos e FAQ. Edite apenas esse arquivo para atualizar preços ou condições; `src/test/site-content.test.ts` garante que planos "Ilimitado" exibam a franquia de 100 utilizações.

## Mensuração
Nenhuma ferramenta de analytics está configurada. Links de ação têm `data-track` (`booking`, `whatsapp`, `plans`, `reviews`, `instagram`, `maps`, `phone`) e `data-track-origin` (ex.: `hero`, `header`, `plans`, `sticky-bar`). Ao instalar uma ferramenta, leia esses atributos num ouvinte de clique, sem dados pessoais. Clique em agendar ≠ agendamento concluído.

## Pendências externas
- Fotos reais autorizadas do espaço (nenhuma usada).
- Imagem social (og:image): aguarda foto ou arte autorizada. Canonical, og:url e sitemap já usam https://oliveirabarbearia.vercel.app/.
