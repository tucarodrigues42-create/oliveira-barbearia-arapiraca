import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import {
  formatPrice,
  siteContent as content,
  type Plan,
  type TrackTarget,
} from "@/lib/site-content";
import logo from "@/assets/oliveira-logo-oficial.png.asset.json";

const title = "Oliveira Barbearia | Corte, barba e Clube OLVR em Arapiraca–AL";
const description =
  "Corte e barba em Arapiraca–AL. Atendimento avulso ou planos Black do Clube OLVR a partir de R$ 79,90/mês. Segunda a sábado, 9h às 20h. Agende pelo Cash Barber.";

/** Endereço definitivo informado pelo proprietário em 13/11/2026. Se mudar, atualize também public/sitemap.xml e public/robots.txt. */
const siteUrl = "https://oliveirabarbearia.vercel.app/";

/** Imagem de compartilhamento (1200×630) recortada da foto da fachada enviada pelo proprietário. */
const ogImage = `${siteUrl}og-image.jpg`;
const ogImageAlt =
  "Fachada da Barbearia Oliveira em Arapiraca, com o letreiro “Você em sua melhor versão”";

/**
 * Dados estruturados do negócio local, só com informações já exibidas no site.
 * Não inclui aggregateRating: a nota é informada pelo proprietário e não pode ser verificada
 * pelo Google; marcação de avaliação própria vai contra as diretrizes de dados estruturados.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: content.name,
  url: siteUrl,
  telephone: "+5582981820974",
  priceRange: "R$ 40 – R$ 149,90",
  slogan: "Você em sua melhor versão.",
  address: {
    "@type": "PostalAddress",
    streetAddress: content.address.street,
    addressLocality: "Arapiraca",
    addressRegion: "AL",
    postalCode: content.address.postalCode,
    addressCountry: "BR",
  },
  openingHours: content.openingHours.schema,
  image: ogImage,
  hasMap: content.links.maps,
  sameAs: [content.links.instagram],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: ogImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: ogImageAlt },
      { name: "google-site-verification", content: "LKIR6oUAxTfFsgO4nigKmjjv_oTEFbZeNjcO8bkRVqM" },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessJsonLd) }],
  }),
  component: Index,
});

/* ------------------------------------------------------------------ */
/* Dados derivados: tudo sai de site-content.ts, nada é inventado aqui. */
/* ------------------------------------------------------------------ */

const ratingText = content.reviews.rating.toFixed(1).replace(".", ",");
const allPlans = content.subscription.families.flatMap((family) => family.plans);
const lowestPlanPrice = Math.min(...allPlans.map((plan) => plan.price));
const fullAddress = `${content.address.street}, ${content.address.neighborhood}, ${content.address.city}, ${content.address.postalCode}`;
const whatsappWithText = `${content.links.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site da Oliveira Barbearia e quero agendar um horário.")}`;

/** Um serviço avulso está "no plano" quando algum plano o inclui (o Clube One cobre o corte). */
function plansCovering(serviceName: string) {
  const key = serviceName.toLowerCase();
  return content.subscription.families.filter((family) =>
    family.plans.some(
      (plan) =>
        plan.includes.includes(serviceName) || (plan.simulator.covers as string[]).includes(key),
    ),
  );
}

const serviceDetails: Record<string, string> = {
  Corte: "Corte de cabelo masculino, do jeito que você pedir.",
  Barba: "Barba feita e alinhada.",
  Pezinho: "Acabamento do contorno para manter o corte em dia.",
  "Barba Express": "Ajuste rápido da barba.",
};

const marqueeItems = [
  ...content.services.map((service) => service.name),
  "Clube OLVR",
  ...content.subscription.families.map((family) => family.name),
];

/* ------------------------------------------------------------------ */
/* Peças reutilizáveis                                                  */
/* ------------------------------------------------------------------ */

function TrackedLink({
  href,
  track,
  origin,
  className = "btn",
  children,
  label,
}: {
  href: string;
  track: TrackTarget;
  origin: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track={track}
      data-track-origin={origin}
      aria-label={label}
    >
      {children}
    </a>
  );
}

function Logo({ className = "", lazy = false }: { className?: string; lazy?: boolean }) {
  return (
    <img
      className={`brand-logo ${className}`}
      src={logo.url}
      width={1314}
      height={451}
      alt="Oliveira Barbearia"
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
    />
  );
}

function Photo({
  file,
  alt,
  sizes,
  eager = false,
  className = "",
}: {
  file: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={`/fotos/${file}-600.webp`}
      srcSet={`/fotos/${file}-600.webp 600w, /fotos/${file}-1200.webp 1200w`}
      sizes={sizes}
      width={600}
      height={1067}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
    />
  );
}

function SectionHead({
  id,
  kicker,
  title,
  text,
  children,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <p className="kicker">{kicker}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {(text || children) && (
        <div className="section-head-aside">
          {text && <p className="lead">{text}</p>}
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Janela "Agendar horário": explica o caminho antes de sair do site.   */
/* ------------------------------------------------------------------ */

function BookingDialog({ dialogRef }: { dialogRef: RefObject<HTMLDialogElement | null> }) {
  const close = () => dialogRef.current?.close();
  return (
    <dialog
      ref={dialogRef}
      className="booking-dialog"
      aria-labelledby="booking-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="booking-panel">
        <button
          type="button"
          className="icon-btn booking-close"
          onClick={close}
          aria-label="Fechar"
        >
          <X aria-hidden="true" />
        </button>
        <p className="kicker">Agendamento online</p>
        <h2 id="booking-title">Agendar horário</h2>
        <ol className="booking-steps">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-n">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="booking-actions">
          <TrackedLink href={content.links.booking} track="booking" origin="booking-dialog">
            <CalendarCheck aria-hidden="true" />
            Abrir agenda online
          </TrackedLink>
          <TrackedLink
            className="btn btn-outline"
            href={whatsappWithText}
            track="whatsapp"
            origin="booking-dialog"
          >
            <MessageCircle aria-hidden="true" />
            Agendar pelo WhatsApp
          </TrackedLink>
        </div>
        <p className="note">A agenda abre no Cash Barber, o sistema de agendamento da Oliveira.</p>
      </div>
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Galeria com ampliação                                                */
/* ------------------------------------------------------------------ */

function Gallery() {
  const photos = content.space.photos;
  const [current, setCurrent] = useState(0);
  const viewer = useRef<HTMLDialogElement>(null);

  const open = (index: number) => {
    setCurrent(index);
    viewer.current?.showModal();
  };
  const active = photos[current] ?? photos[0]!;
  const step = (delta: number) =>
    setCurrent((index) => (index + delta + photos.length) % photos.length);

  return (
    <>
      <ul className="gallery-grid">
        {photos.map((photo, index) => (
          <li key={photo.file}>
            <button
              type="button"
              className="gallery-item"
              onClick={() => open(index)}
              aria-label={`Ampliar foto: ${photo.alt}`}
            >
              <Photo file={photo.file} alt={photo.alt} sizes="(max-width: 759px) 50vw, 25vw" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={viewer}
        className="lightbox"
        aria-label="Foto ampliada"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) viewer.current?.close();
        }}
      >
        <figure>
          <img
            src={`/fotos/${active.file}-1200.webp`}
            width={1200}
            height={2134}
            alt={active.alt}
          />
          <figcaption>
            {current + 1} / {photos.length}
          </figcaption>
        </figure>
        <button
          type="button"
          className="icon-btn lightbox-close"
          onClick={() => viewer.current?.close()}
          aria-label="Fechar"
        >
          <X aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn lightbox-prev"
          onClick={() => step(-1)}
          aria-label="Foto anterior"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn lightbox-next"
          onClick={() => step(1)}
          aria-label="Próxima foto"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Cartão de plano                                                      */
/* ------------------------------------------------------------------ */

function PlanRow({ plan }: { plan: Plan }) {
  return (
    <li className={`plan-row${plan.highlight ? " is-highlight" : ""}`}>
      <div className="plan-row-top">
        <h4>
          {plan.label}
          {plan.highlight && plan.highlightLabel && (
            <span className="tag tag-solid">{plan.highlightLabel}</span>
          )}
        </h4>
        <p className="plan-price">
          {formatPrice(plan.price)}
          <span>/mês</span>
        </p>
      </div>
      <p className="plan-includes">{plan.includes.join(" · ")}</p>
      {plan.extras && (
        <p className="plan-extra">
          {plan.extras.days}:{" "}
          {plan.extras.charges
            .map(
              (charge) =>
                `${charge.service} ${formatPrice(charge.price)}${charge.note ? ` ${charge.note}` : ""}`,
            )
            .join(" · ")}
        </p>
      )}
      {plan.allowance && (
        <p className="plan-allowance">
          {plan.name}: {plan.allowance.toLowerCase()}.
        </p>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                               */
/* ------------------------------------------------------------------ */

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bookingDialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const openBooking = () => {
    setMenuOpen(false);
    bookingDialog.current?.showModal();
  };

  // Cabeçalho transparente sobre a foto do topo; fica sólido ao rolar.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // Entrada suave ao rolar. Sem JS ou com "reduzir movimento", tudo aparece direto.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((node) => io.observe(node));
    document.documentElement.classList.add("reveal-ready");
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  const bookingButton = (origin: string, label = "Agendar horário", className = "btn") => (
    <a
      className={className}
      href={content.links.booking}
      target="_blank"
      rel="noopener noreferrer"
      data-track="booking"
      data-track-origin={origin}
      onClick={(event) => {
        // Com JS, mostra antes os passos e a opção de WhatsApp; sem JS, o link abre o Cash Barber direto.
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        openBooking();
      }}
    >
      {label}
    </a>
  );

  return (
    <>
      <a className="skip-link" href="#servicos">
        Pular para os serviços
      </a>

      <header className={`site-header${scrolled || menuOpen ? " is-solid" : ""}`}>
        <div className="container header-inner">
          <a className="logo-link" href="#topo" aria-label="Oliveira Barbearia, voltar ao início">
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {content.navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          {bookingButton("header", "Agendar", "btn btn-sm header-cta")}
          <button
            ref={menuButton}
            type="button"
            className="icon-btn menu-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navegação móvel"
          hidden={!menuOpen}
        >
          {content.navigation.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>
              <span className="mobile-nav-n">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
          {bookingButton("mobile-menu", "Agendar horário", "btn btn-block")}
        </nav>
      </header>

      <main>
        {/* Topo */}
        <section className="hero" id="topo" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Photo file="salao" alt="" sizes="100vw" eager />
          </div>
          <div className="container hero-inner">
            <p className="kicker hero-kicker">{content.hero.eyebrow}</p>
            <Logo className="hero-logo" />
            <h1 id="hero-title">
              Barbearia <em>por assinatura</em> em Arapiraca.
            </h1>
            <div className="hero-actions">
              {bookingButton("hero", "Agendar horário", "btn btn-lg")}
              <a
                className="btn btn-lg btn-ghost"
                href="#servicos"
                data-track="plans"
                data-track-origin="hero"
              >
                Ver serviços e preços
              </a>
            </div>
            <ul className="hero-facts">
              <li>
                <a
                  href={content.reviews.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="reviews"
                  data-track-origin="hero"
                >
                  <strong>
                    {ratingText} <Star aria-hidden="true" />
                  </strong>
                  <span>{content.reviews.count} avaliações no Google</span>
                </a>
              </li>
              <li>
                <strong>Seg a Sáb</strong>
                <span>{content.openingHours.hours}</span>
              </li>
              <li>
                <strong>{formatPrice(lowestPlanPrice)}/mês</strong>
                <span>Clube OLVR a partir de</span>
              </li>
            </ul>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <span key={copy}>
                  {marqueeItems.map((item) => (
                    <span key={item} className="marquee-item">
                      {item}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section id="servicos" className="section" aria-labelledby="servicos-title">
          <div className="container">
            <SectionHead
              id="servicos-title"
              kicker="Serviços"
              title="Escolha o serviço. A gente cuida do resto."
              text="Preço avulso de cada atendimento. Quem é do Clube OLVR usa os serviços do plano por uma mensalidade fixa."
            />
            <ul className="service-list" data-reveal>
              {content.services.map((service) => {
                const families = plansCovering(service.name);
                return (
                  <li key={service.name} className="service-row">
                    <div className="service-info">
                      <h3>{service.name}</h3>
                      <p>{serviceDetails[service.name]}</p>
                      {families.length > 0 && (
                        <span className="tag">
                          No plano {families.map((family) => family.name).join(", ")}
                        </span>
                      )}
                    </div>
                    <p className="service-price">{formatPrice(service.price)}</p>
                    <TrackedLink
                      className="btn btn-sm btn-outline"
                      href={content.links.booking}
                      track="booking"
                      origin={`service-${service.name}`}
                      label={`Agendar ${service.name} no Cash Barber`}
                    >
                      Agendar
                    </TrackedLink>
                  </li>
                );
              })}
            </ul>
            <p className="note">{content.servicesNote}</p>
          </div>
        </section>

        {/* Clube OLVR */}
        <section
          id="assinatura"
          className="section section-light"
          aria-labelledby="assinatura-title"
        >
          <div className="container">
            <SectionHead
              id="assinatura-title"
              kicker={content.subscription.name}
              title="Barbearia por assinatura."
              text="Uma mensalidade fixa e o visual sempre em dia. Escolha a rotina que combina com você e assine pelo celular."
            >
              <TrackedLink href={content.links.booking} track="plans" origin="subscription-head">
                Assinar no Cash Barber
                <ArrowUpRight aria-hidden="true" />
              </TrackedLink>
            </SectionHead>

            <ol className="feature-cards" data-reveal>
              <li>
                <span className="feature-n">01</span>
                <h3>Sempre alinhado</h3>
                <p>
                  Planos para corte, barba ou os dois, com pezinho e Barba Express incluídos
                  conforme o plano.
                </p>
              </li>
              <li>
                <span className="feature-n">02</span>
                <h3>Do seu jeito</h3>
                <p>
                  Black para usar de segunda a sábado, Smart para o início da semana e One para um
                  corte por mês.
                </p>
              </li>
              <li>
                <span className="feature-n">03</span>
                <h3>Tudo pelo celular</h3>
                <p>
                  Assine, pague e agende online pelo Cash Barber. Cancelamento a qualquer momento,
                  sem multa.
                </p>
              </li>
            </ol>

            <div className="plan-families" id="planos" data-reveal>
              {content.subscription.families.map((family) => (
                <article key={family.id} className={`plan-card plan-card-${family.id}`}>
                  <header>
                    <p className="kicker">Plano</p>
                    <h3>{family.name}</h3>
                    <p className="plan-card-days">
                      <Clock aria-hidden="true" />
                      {family.days}
                    </p>
                    {family.valueHighlight && (
                      <p className="plan-card-text">{family.valueHighlight}</p>
                    )}
                  </header>
                  <ul className="plan-rows">
                    {family.plans.map((plan) => (
                      <PlanRow key={plan.id} plan={plan} />
                    ))}
                  </ul>
                  <p className="plan-card-window">{family.bookingWindow}</p>
                  <TrackedLink
                    className={`btn btn-block${family.id === "black" ? "" : " btn-outline"}`}
                    href={content.links.booking}
                    track="booking"
                    origin={`plan-${family.id}`}
                  >
                    Assinar o {family.name}
                    <ArrowUpRight aria-hidden="true" />
                  </TrackedLink>
                </article>
              ))}
            </div>

            <details className="conditions">
              <summary>
                Condições da assinatura
                <ChevronDown aria-hidden="true" />
              </summary>
              <ul>
                {content.subscription.conditions.map((condition) => (
                  <li key={condition}>{condition}</li>
                ))}
              </ul>
              <p className="note">{content.subscription.conditionsNote}</p>
            </details>
          </div>
        </section>

        {/* Galeria */}
        <section id="galeria" className="section" aria-labelledby="galeria-title">
          <div className="container">
            <SectionHead
              id="galeria-title"
              kicker="Galeria"
              title="Por dentro da Oliveira."
              text={content.space.text}
            >
              <TrackedLink
                className="text-link"
                href={content.links.instagram}
                track="instagram"
                origin="gallery"
              >
                Tem mais no Instagram: {content.instagramHandle}
                <ArrowUpRight aria-hidden="true" />
              </TrackedLink>
            </SectionHead>
            <div data-reveal>
              <Gallery />
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section id="equipe" className="section section-tight" aria-labelledby="equipe-title">
          <div className="container">
            <SectionHead
              id="equipe-title"
              kicker="Equipe"
              title="Quem vai te atender."
              text="Os barbeiros da Oliveira, em Arapiraca."
            />
            <ul className="team-grid" data-reveal>
              {content.team.map((member) => (
                <li key={member.name} className="team-card">
                  <span className="team-avatar" aria-hidden="true">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Onde estamos */}
        <section id="local" className="section section-light" aria-labelledby="local-title">
          <div className="container">
            <SectionHead id="local-title" kicker="Onde estamos" title="Em Arapiraca." />
            <div className="local-grid" data-reveal>
              <div className="local-info">
                <div className="info-block">
                  <h3>
                    <MapPin aria-hidden="true" /> Endereço
                  </h3>
                  <address>
                    {content.address.street}
                    <br />
                    {content.address.neighborhood} · {content.address.city}
                    <br />
                    CEP {content.address.postalCode}
                  </address>
                  <TrackedLink
                    className="text-link"
                    href={content.links.maps}
                    track="maps"
                    origin="local"
                  >
                    Como chegar <ArrowRight aria-hidden="true" />
                  </TrackedLink>
                </div>
                <div className="info-block">
                  <h3>
                    <Clock aria-hidden="true" /> Horário
                  </h3>
                  <table className="hours">
                    <tbody>
                      <tr>
                        <th scope="row">Segunda a sábado</th>
                        <td>09:00 às 20:00</td>
                      </tr>
                      <tr>
                        <th scope="row">Domingo</th>
                        <td>Fechado</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="info-block">
                  <h3>
                    <MessageCircle aria-hidden="true" /> Contato
                  </h3>
                  <p className="contact-links">
                    <TrackedLink
                      className="text-link"
                      href={content.links.whatsapp}
                      track="whatsapp"
                      origin="local"
                    >
                      WhatsApp {content.phone}
                    </TrackedLink>
                    <TrackedLink
                      className="text-link"
                      href={content.links.instagram}
                      track="instagram"
                      origin="local"
                    >
                      Instagram {content.instagramHandle}
                    </TrackedLink>
                  </p>
                </div>
              </div>
              <div className="local-media">
                <Photo
                  className="local-photo"
                  file="fachada"
                  alt={
                    content.space.photos.find((photo) => photo.file === "fachada")?.alt ??
                    "Fachada da Oliveira Barbearia"
                  }
                  sizes="(max-width: 759px) 100vw, 30vw"
                />
                <iframe
                  className="map-frame"
                  title="Mapa da Oliveira Barbearia na Santa Esmeralda, Arapiraca"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dúvidas */}
        <section id="duvidas" className="section" aria-labelledby="faq-title">
          <div className="container faq-layout">
            <SectionHead id="faq-title" kicker="Dúvidas" title="Perguntas frequentes." />
            <div className="faq-list" data-reveal>
              {content.faq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Fechamento */}
        <section className="closing" aria-labelledby="closing-title">
          <div className="closing-media" aria-hidden="true">
            <Photo file="cadeira" alt="" sizes="100vw" />
          </div>
          <div className="container closing-inner" data-reveal>
            <p className="kicker">{content.hero.slogan}</p>
            <h2 id="closing-title">Bora ficar em dia?</h2>
            <p className="lead">Agende em menos de um minuto e chegue no seu horário.</p>
            <div className="hero-actions">
              {bookingButton("closing", "Agendar horário", "btn btn-lg")}
              <TrackedLink
                className="btn btn-lg btn-ghost"
                href={whatsappWithText}
                track="whatsapp"
                origin="closing"
              >
                <MessageCircle aria-hidden="true" />
                Chamar no WhatsApp
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a href="#topo" className="footer-logo" aria-label="Oliveira Barbearia, voltar ao início">
            <Logo lazy />
          </a>
          <p className="footer-address">{fullAddress}</p>
          <nav className="footer-links" aria-label="Redes e contato">
            <TrackedLink
              className="footer-link"
              href={content.links.instagram}
              track="instagram"
              origin="footer"
            >
              <Instagram aria-hidden="true" /> Instagram
            </TrackedLink>
            <TrackedLink
              className="footer-link"
              href={content.links.whatsapp}
              track="whatsapp"
              origin="footer"
            >
              <MessageCircle aria-hidden="true" /> WhatsApp
            </TrackedLink>
            <TrackedLink
              className="footer-link"
              href={content.links.maps}
              track="maps"
              origin="footer"
            >
              <MapPin aria-hidden="true" /> Google Maps
            </TrackedLink>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getUTCFullYear()} Oliveira Barbearia · CNPJ 59.631.144/0001-99</span>
          <span>Agendamento online pelo Cash Barber.</span>
        </div>
      </footer>

      <div className="sticky-bar">
        <TrackedLink
          className="btn btn-outline"
          href={whatsappWithText}
          track="whatsapp"
          origin="sticky-bar"
        >
          <MessageCircle aria-hidden="true" />
          WhatsApp
        </TrackedLink>
        {bookingButton("sticky-bar", "Agendar horário", "btn")}
      </div>

      <BookingDialog dialogRef={bookingDialog} />
    </>
  );
}
