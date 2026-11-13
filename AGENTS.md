<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Site architecture
- Keep institutional copy, contact URLs, navigation and manually sourced reviews in `src/lib/site-content.ts` so factual updates have a single source.
- Use a single scrolling index with semantic anchor sections because this site's navigation explicitly requires in-page anchors; do not add a backend or booking implementation.
- Preserve the original horizontal logo through its asset pointer for header, hero and footer; derive favicon/apple-touch/small icons only from the owner-supplied framed O monogram (empty margins trimmed, full artwork kept), never from the horizontal logo.
- Define the editorial visual system in `src/styles.css` and use Button variants for commands and external calls to action to keep styling consistent.
- Keep the owner-supplied club mark as a separate full-aspect asset from the principal brand so club updates cannot replace header/footer identity.
- Plan families, prices and conditions live as typed data in `site-content.ts` and render through `src/components/plans-section.tsx`; any plan named "Ilimitado" must carry its allowance in the same block (enforced by `src/test/site-content.test.ts`).
- Outbound CTAs carry `data-track` + `data-track-origin` attributes only; no analytics vendor is installed, so never claim collected metrics or call a booking click a completed booking.
- Canonical, og:url and sitemap use the definitive address https://oliveirabarbearia.vercel.app/ (confirmed 13/11/2026); never emit relative URLs for them. Keep og:image omitted until an authorized image exists. If the address changes, update index.tsx, public/sitemap.xml and public/robots.txt together.
