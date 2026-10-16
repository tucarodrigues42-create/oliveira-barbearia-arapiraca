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
