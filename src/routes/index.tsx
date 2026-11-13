import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Instagram,
  MapPin,
  Crown,
  CalendarCheck,
  Menu,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlansSection } from "@/components/plans-section";
import { BlackSelector } from "@/components/plan-simulator";
import { LeadForm } from "@/components/lead-form";
import { formatPrice, siteContent as content, type TrackTarget } from "@/lib/site-content";
import logo from "@/assets/oliveira-logo-oficial.png.asset.json";

const title = "Oliveira Barbearia | Corte, barba e Clube OLVR em Arapiraca–AL";
const description =
  "Corte e barba na Santa Esmeralda, Arapiraca–AL. Atendimento avulso ou planos Black do Clube OLVR a partir de R$ 67,90/mês. Segunda a sábado, 9h às 20h. Agende pelo Cash Barber.";

/** Endereço definitivo informado pelo proprietário em 13/11/2026. Se mudar, atualize também public/sitemap.xml e public/robots.txt. */
const siteUrl = "https://oliveirabarbearia.vercel.app/";

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
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "google-site-verification", content: "LKIR6oUAxTfFsgO4nigKmjjv_oTEFbZeNjcO8bkRVqM" },
    ],
    links: [{ rel: "canonical", href: siteUrl }],
  }),
  component: Index,
});

type Variant = "editorial" | "editorialOutline" | "editorialLink";

/** Link externo seguro. data-track/data-track-origin preparam mensuração futura (nenhuma ferramenta instalada). */
function ExternalLink({
  href,
  children,
  track,
  origin,
  variant = "editorial",
  className = "",
}: {
  href: string;
  children: ReactNode;
  track: TrackTarget;
  origin: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Button asChild variant={variant} className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-track={track}
        data-track-origin={origin}
      >
        {children}
        <ArrowUpRight aria-hidden="true" />
      </a>
    </Button>
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

const fullAddress = `${content.address.street}, ${content.address.neighborhood}, ${content.address.city}, ${content.address.postalCode}`;

const bottomItems = [{ id: "economia", label: "Meu plano", Icon: Crown }] as const;

function BottomNav() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = bottomItems
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="bottom-nav" aria-label="Atalhos">
      {bottomItems.map(({ id, label, Icon }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>
          <Icon aria-hidden="true" />
          {label}
        </a>
      ))}
      <a
        href={content.links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp"
        data-track-origin="bottom-nav"
      >
        <MessageCircle aria-hidden="true" />
        WhatsApp
      </a>
      <a
        className="bottom-book"
        href={content.links.booking}
        target="_blank"
        rel="noopener noreferrer"
        data-track="booking"
        data-track-origin="bottom-nav"
      >
        <CalendarCheck aria-hidden="true" />
        Assinar
      </a>
    </nav>
  );
}

const ratingText = content.reviews.rating.toFixed(1).replace(".", ",");

/** Conta do hero: apenas preços confirmados em site-content (4 cortes avulsos x Black Corte). */
const corteAvulso = content.services.find((service) => service.name === "Corte");
const blackCorte = content.subscription.families
  .find((family) => family.id === "black")
  ?.plans.find((plan) => plan.id === "black-corte");
const ledger =
  corteAvulso && blackCorte
    ? (() => {
        const singleCents = Math.round(corteAvulso.price * 100) * 4;
        const planCents = Math.round(blackCorte.price * 100);
        return {
          single: singleCents / 100,
          plan: blackCorte.price,
          saving: (singleCents - planCents) / 100,
          positive: singleCents > planCents,
          // Menor número de cortes avulsos no mês que já passa do preço do plano.
          breakEvenVisits: Math.floor(blackCorte.price / corteAvulso.price) + 1,
          breakEvenTotal: (Math.floor(blackCorte.price / corteAvulso.price) + 1) * corteAvulso.price,
        };
      })()
    : null;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    mobileNav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 960px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  // Cabeçalho do celular: esconde ao descer e volta ao subir, liberando a tela para o conteúdo.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;
    if (menuOpen) {
      header.classList.remove("is-hidden");
      return;
    }
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) header.classList.toggle("is-hidden", y > 160 && y > last);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      header.classList.remove("is-hidden");
    };
  }, [menuOpen]);

  // Entrada suave ao rolar (só no celular, via CSS). Sem JS ou com "reduzir movimento", tudo aparece direto.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = document.querySelectorAll<HTMLElement>(
      ".hero-copy, .hero-ledger, .section .page-container > *",
    );
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
    targets.forEach((node) => {
      node.classList.add("reveal");
      io.observe(node);
    });
    document.documentElement.classList.add("reveal-ready");
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
      targets.forEach((node) => node.classList.remove("reveal", "is-in"));
    };
  }, []);

  const selectSection = (id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="page-container header-inner">
          <a className="logo-link" href="#inicio" aria-label="Oliveira Barbearia — início">
            <Logo />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {content.navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <ExternalLink
            className="header-booking"
            href={content.links.booking}
            track="booking"
            origin="header"
          >
            Agendar horário
          </ExternalLink>
          <Button
            ref={menuButton}
            variant="menu"
            size="icon"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <nav
          ref={mobileNav}
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navegação móvel"
          hidden={!menuOpen}
        >
          {content.navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => selectSection(item.id)}>
              {item.label}
              <ArrowDown aria-hidden="true" />
            </a>
          ))}
          <ExternalLink href={content.links.booking} track="booking" origin="mobile-menu">
            Agendar meu horário
          </ExternalLink>
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="page-container hero-inner">
            <div className="hero-copy">
              <p className="hero-kicker">{content.hero.kicker}</p>
              <h1 id="hero-title">Pare de pagar corte por corte.</h1>
              <p className="lead">{content.hero.subheadline}</p>
              <div className="hero-actions">
                <ExternalLink href={content.links.booking} track="booking" origin="hero">
                  Assinar o Black
                </ExternalLink>
                <Button asChild variant="editorialOutline">
                  <a href="#economia" data-track="plans" data-track-origin="hero">
                    Ver quanto eu economizo
                    <ArrowDown aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
            {ledger && ledger.positive && (
              <aside
                className="hero-ledger is-inverted"
                aria-label="Comparação entre cortes avulsos e o plano Black Corte"
              >
                <p className="ledger-title">Um mês de corte na Oliveira</p>
                <dl className="ledger-rows">
                  <div className="ledger-old">
                    <dt>4 cortes avulsos</dt>
                    <dd>{formatPrice(ledger.single)}</dd>
                  </div>
                  <div>
                    <dt>{blackCorte?.label}</dt>
                    <dd>{formatPrice(ledger.plan)}</dd>
                  </div>
                </dl>
                <p className="ledger-saving">
                  <strong>{formatPrice(ledger.saving)}</strong>
                  <span>a menos no mês</span>
                </p>
                <p className="note ledger-note">
                  Considera 4 cortes no mês a {formatPrice(corteAvulso?.price ?? 0)} cada. O plano
                  inclui o pezinho. {blackCorte?.allowance}.
                </p>
              </aside>
            )}
          </div>
        </section>

        <div className="location-strip">
          <div className="page-container">
            <a
              className="proof-rating"
              href="#avaliacoes"
              data-track="reviews"
              data-track-origin="proof-strip"
            >
              <Star aria-hidden="true" />
              {ratingText} · {content.reviews.count} avaliações no Google
            </a>
            <span>
              {content.openingHours.days}, {content.openingHours.hours}
            </span>
          </div>
        </div>
        <BlackSelector />

        <section
          id="avaliacoes"
          className="section reviews-section is-inverted"
          tabIndex={-1}
          aria-labelledby="reviews-title"
        >
          <div className="page-container">
            <div className="reviews-layout">
              <div>
                <h2 id="reviews-title">Quem já veio, volta.</h2>
              </div>
              <div className="rating-block">
                <div className="stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="rating">
                  <span>{ratingText}</span>
                  <span className="rating-total">/ 5</span>
                </p>
                <p className="rating-count">{content.reviews.count} avaliações no Google</p>
                <p className="note">
                  Dados do perfil Google informados pela barbearia em {content.reviews.date}.
                </p>
              </div>
            </div>
            <p className="swipe-hint" aria-hidden="true">
              Deslize para ver mais <ArrowRight />
            </p>
            <ul className="review-quotes">
              {content.reviews.quotes.map((q) => (
                <li key={q.author}>
                  <figure>
                    <blockquote>
                      <p>“{q.text}”</p>
                    </blockquote>
                    <figcaption>
                      <span>{q.author}</span>
                      <span>via Google</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className="quotes-footer">
              <ExternalLink
                variant="editorialOutline"
                href={content.reviews.profileUrl}
                track="reviews"
                origin="reviews"
              >
                Ver avaliações no Google
              </ExternalLink>
            </div>
          </div>
        </section>

        <section
          id="servicos"
          className="section services-section"
          tabIndex={-1}
          aria-labelledby="services-title"
        >
          <div className="page-container two-column">
            <div>
              <h2 id="services-title">Prefere pagar por visita?</h2>
              <p className="lead">
                {ledger?.positive
                  ? `Sem compromisso. Mas na ${ledger.breakEvenVisits}ª visita do mês o ${blackCorte?.label} já sai mais barato: ${formatPrice(ledger.breakEvenTotal)} avulso contra ${formatPrice(ledger.plan)}.`
                  : content.about.text}
              </p>
            </div>
            <div>
              <ul className="service-cards">
                {content.services.map((s) => (
                  <li key={s.name} className="service-card">
                    <h3>{s.name}</h3>
                    <strong>{formatPrice(s.price)}</strong>
                    <a
                      href={content.links.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="booking"
                      data-track-origin={`service-${s.name}`}
                      aria-label={`Agendar ${s.name} no Cash Barber`}
                    >
                      Agendar <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="note">{content.servicesNote}</p>
            </div>
          </div>
        </section>

        <PlansSection
          action={
            <ExternalLink href={content.links.booking} track="booking" origin="plans">
              {content.subscription.action}
            </ExternalLink>
          }
        />

        <LeadForm />

        <section
          id="contato"
          className="section contact-section"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <div className="page-container two-column">
            <div>
              <h2 id="contact-title">Nos vemos na barbearia.</h2>
              <address>
                <MapPin aria-hidden="true" />
                <span>
                  {content.address.street}
                  <br />
                  {content.address.neighborhood} · {content.address.city}
                  <br />
                  CEP {content.address.postalCode}
                </span>
              </address>
              <p className="opening-hours">
                <Clock aria-hidden="true" />
                <span>
                  <strong>Horário de funcionamento</strong>
                  <br />
                  {content.openingHours.days}, das {content.openingHours.hours}
                </span>
              </p>
              <ExternalLink
                variant="editorialLink"
                href={content.links.maps}
                track="maps"
                origin="contact"
              >
                Abrir rota no Google Maps
              </ExternalLink>
            </div>
            <div className="contact-links">
              <iframe
                className="map-frame"
                title="Mapa da Oliveira Barbearia na Santa Esmeralda, Arapiraca"
                src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                width={600}
                height={450}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={content.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-track-origin="contact"
              >
                <MessageCircle aria-hidden="true" />
                <span>
                  <span className="eyebrow">Fale com a equipe</span>
                  <span className="contact-title">WhatsApp</span>
                  <span>{content.phone}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a
                href={content.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-track="instagram"
                data-track-origin="contact"
              >
                <Instagram aria-hidden="true" />
                <span>
                  <span className="eyebrow">Acompanhe a Oliveira</span>
                  <span className="contact-title">Instagram</span>
                  <span>{content.instagramHandle}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="page-container two-column">
            <div>
              <h2 id="faq-title">Dúvidas frequentes.</h2>
            </div>
            <div className="faq-list">
              {content.faq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
              <a
                className="text-link"
                href={content.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp"
                data-track-origin="faq"
              >
                Outra dúvida? Fale pelo WhatsApp
              </a>
            </div>
          </div>
        </section>
        <section className="section final-cta is-inverted" aria-labelledby="final-title">
          <div className="page-container">
            <h2 id="final-title">{content.finalCta.title}</h2>
            <div className="final-cta-actions">
              <ExternalLink href={content.links.booking} track="booking" origin="final-cta">
                {content.finalCta.primary}
              </ExternalLink>
              <ExternalLink
                variant="editorialOutline"
                href={content.links.booking}
                track="booking"
                origin="final-cta-avulso"
              >
                {content.finalCta.secondary}
              </ExternalLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-top">
          <a
            href="#inicio"
            className="footer-logo"
            aria-label="Oliveira Barbearia — voltar ao início"
          >
            <Logo lazy />
          </a>
          <p>
            Você em sua
            <br />
            <span>melhor versão.</span>
          </p>
          <ExternalLink
            className="footer-booking"
            href={content.links.booking}
            track="booking"
            origin="footer"
          >
            Agendar meu horário
          </ExternalLink>
        </div>
        <div className="page-container footer-bottom">
          <span>© {new Date().getUTCFullYear()} Oliveira Barbearia · CNPJ 59.631.144/0001-99</span>
          <span>
            {content.openingHours.days}, {content.openingHours.hours}
          </span>
          <a href={content.links.phone} data-track="phone" data-track-origin="footer">
            {content.phone}
          </a>
        </div>
      </footer>
      <a
        className="whatsapp-fab"
        href={`${content.links.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site da Oliveira Barbearia e tenho uma dúvida.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        data-track="whatsapp"
        data-track-origin="fab"
      >
        <MessageCircle aria-hidden="true" />
      </a>
      <BottomNav />
    </>
  );
}
