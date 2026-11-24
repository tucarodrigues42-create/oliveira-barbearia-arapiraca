import { ArrowRight } from "lucide-react";

/** Fotos reais da barbearia, tratadas em preto e branco para combinar com o site (arquivos em /public/fotos). */
const photos = [
  {
    id: "salao",
    alt: "Salão da Oliveira Barbearia com cadeiras pretas, espelhos grandes e iluminação de LED em formato hexagonal no teto.",
    position: "50% 38%",
  },
  {
    id: "cadeira",
    alt: "Cadeira de barbeiro preta com detalhes cromados diante do espelho, com prateleiras de produtos ao fundo.",
    position: "50% 55%",
  },
  {
    id: "entrada",
    alt: "Entrada da barbearia vista por dentro: divisória de grade preta, balcão branco e porta de vidro com a marca Clube OLVR.",
    position: "50% 60%",
  },
] as const;

export function SpaceGallery() {
  return (
    <section id="espaco" className="section space-section" aria-labelledby="space-title">
      <div className="page-container">
        <div className="space-head">
          <h2 id="space-title">Veja onde o corte acontece.</h2>
          <p className="lead">
            Passe aqui antes de assinar. Atendemos de segunda a sábado, das 9h às 20h.
          </p>
        </div>
        <p className="swipe-hint" aria-hidden="true">
          Deslize para ver mais <ArrowRight />
        </p>
        <ul className="space-gallery">
          {photos.map((photo) => (
            <li key={photo.id}>
              <figure>
                <img
                  src={`/fotos/${photo.id}-900.webp`}
                  srcSet={`/fotos/${photo.id}-600.webp 600w, /fotos/${photo.id}-900.webp 900w`}
                  sizes="(max-width: 759px) 78vw, 33vw"
                  width={900}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                  alt={photo.alt}
                  style={{ objectPosition: photo.position }}
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
