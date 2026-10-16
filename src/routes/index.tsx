import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown, Clock, Instagram, MapPin, Menu, MessageCircle, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlansSection } from '@/components/plans-section';
import { formatPrice, siteContent as content, type TrackTarget } from '@/lib/site-content';
import logo from '@/assets/oliveira-logo-oficial.png.asset.json';

const title = 'Oliveira Barbearia | Corte, barba e Clube OLVR em Arapiraca–AL';
const description =
  'Corte e barba na Santa Esmeralda, Arapiraca–AL. Atendimento avulso ou planos do Clube OLVR a partir de R$ 26,90/mês. Segunda a sábado, 9h às 20h. Agende pelo Cash Barber.';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'pt_BR' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
  }),
  component: Index,
});

type Variant = 'editorial' | 'editorialOutline' | 'editorialLink';

/** Link externo seguro. data-track/data-track-origin preparam mensuração futura (nenhuma ferramenta instalada). */
function ExternalLink({ href, children, track, origin, variant = 'editorial', className = '' }: { href: string; children: ReactNode; track: TrackTarget; origin: string; variant?: Variant; className?: string }) {
  return (
    <Button asChild variant={variant} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer" data-track={track} data-track-origin={origin}>
        {children}
        <ArrowUpRight aria-hidden="true" />
      </a>
    </Button>
  );
}

function Logo({ className = '', lazy = false }: { className?: string; lazy?: boolean }) {
  return <img className={`brand-logo ${className}`} src={logo.url} width={1314} height={451} alt="Oliveira Barbearia" loading={lazy ? 'lazy' : 'eager'} decoding="async" />;
}

const ratingText = content.reviews.rating.toFixed(1).replace('.', ',');

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    mobileNav.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 960px)');
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

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
            {content.navigation.map(item => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <ExternalLink className="header-booking" href={content.links.booking} track="booking" origin="header">
            Agendar horário
          </ExternalLink>
          <Button ref={menuButton} variant="menu" size="icon" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <nav ref={mobileNav} id="mobile-navigation" className="mobile-nav" aria-label="Navegação móvel" hidden={!menuOpen}>
          {content.navigation.map(item => (
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
              <p className="eyebrow hero-eyebrow">
                <span className="location-dot" aria-hidden="true" />
                {content.hero.eyebrow}
              </p>
              <h1 id="hero-title">
                {content.hero.title} <span>{content.hero.titleAccent}</span>
              </h1>
              <p className="lead">{content.hero.text}</p>
              <div className="hero-actions">
                <ExternalLink href={content.links.booking} track="booking" origin="hero">
                  Agendar meu horário
                </ExternalLink>
                <Button asChild variant="editorialOutline">
                  <a href="#planos" data-track="plans" data-track-origin="hero">
                    Comparar planos
                    <ArrowDown aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <div className="hero-trust">
                <a href="#avaliacoes" className="hero-rating" data-track="reviews" data-track-origin="hero">
                  <Star aria-hidden="true" />
                  <span>
                    <strong>{ratingText}/5</strong> · {content.reviews.count} avaliações no Google
                  </span>
                </a>
                <span className="note">Dados fornecidos em {content.reviews.date}</span>
                <a className="text-link" href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-origin="hero">
                  Dúvidas? Fale pelo WhatsApp
                </a>
              </div>
            </div>
            <div className="hero-brand" aria-hidden="true">
              <Logo />
              <span>Barbearia por assinatura · AL</span>
            </div>
          </div>
        </section>

        <section id="servicos" className="section services-section" tabIndex={-1} aria-labelledby="services-title">
          <div className="page-container two-column">
            <div>
              <p className="eyebrow">01 / Atendimento avulso</p>
              <h2 id="services-title">
                Serviços e <em>valores.</em>
              </h2>
              <p className="lead">{content.about.text}</p>
              <ExternalLink variant="editorialLink" href={content.links.instagram} track="instagram" origin="services">
                <Instagram aria-hidden="true" />
                Veja os trabalhos no Instagram
              </ExternalLink>
            </div>
            <div>
              <ul className="price-list">
                {content.services.map(s => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <span className="price-dots" aria-hidden="true" />
                    <strong>{formatPrice(s.price)}</strong>
                  </li>
                ))}
              </ul>
              <p className="note">{content.servicesNote}</p>
              <ExternalLink className="section-action" href={content.links.booking} track="booking" origin="services">
                Agendar meu horário
              </ExternalLink>
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

        <section className="section booking-section" aria-labelledby="booking-title">
          <div className="page-container">
            <p className="eyebrow">03 / Seu próximo horário</p>
            <h2 id="booking-title">Agendar é simples.</h2>
            <ol className="steps">
              {content.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
            <ExternalLink href={content.links.booking} track="booking" origin="steps">
              Abrir agendamento
            </ExternalLink>
          </div>
        </section>

        <section id="avaliacoes" className="section reviews-section" tabIndex={-1} aria-labelledby="reviews-title">
          <div className="page-container">
            <div className="reviews-layout">
              <div>
                <p className="eyebrow">04 / Avaliações no Google</p>
                <h2 id="reviews-title">
                  A experiência de quem <em>já veio.</em>
                </h2>
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
              </div>
            </div>
            <ul className="review-quotes">
              {content.reviews.quotes.map(q => (
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
              <ExternalLink variant="editorialOutline" href={content.reviews.profileUrl} track="reviews" origin="reviews">
                Ver avaliações no Google
              </ExternalLink>
              <p className="note">
                {content.reviews.quotesNote} {content.reviews.source} em {content.reviews.date} · Atualização manual.
              </p>
            </div>
          </div>
        </section>

        <section id="contato" className="section contact-section" tabIndex={-1} aria-labelledby="contact-title">
          <div className="page-container two-column">
            <div>
              <p className="eyebrow">05 / Venha até a Oliveira</p>
              <h2 id="contact-title">
                Nos vemos na <em>barbearia.</em>
              </h2>
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
              <ExternalLink variant="editorialLink" href={content.links.maps} track="maps" origin="contact">
                Como chegar
              </ExternalLink>
            </div>
            <div className="contact-links">
              <a href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-origin="contact">
                <MessageCircle aria-hidden="true" />
                <span>
                  <span className="eyebrow">Fale com a equipe</span>
                  <span className="contact-title">WhatsApp</span>
                  <span>{content.phone}</span>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={content.links.instagram} target="_blank" rel="noopener noreferrer" data-track="instagram" data-track-origin="contact">
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
              <p className="eyebrow">Antes da sua visita</p>
              <h2 id="faq-title">
                Dúvidas <em>frequentes.</em>
              </h2>
            </div>
            <div className="faq-list">
              {content.faq.map(item => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
              <a className="text-link" href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp" data-track-origin="faq">
                Outra dúvida? Fale pelo WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-top">
          <a href="#inicio" className="footer-logo" aria-label="Oliveira Barbearia — voltar ao início">
            <Logo lazy />
          </a>
          <p>
            Corte e barba em Arapiraca.
            <br />
            <span>Sempre em dia.</span>
          </p>
          <ExternalLink className="footer-booking" href={content.links.booking} track="booking" origin="footer">
            Agendar meu horário
          </ExternalLink>
        </div>
        <div className="page-container footer-bottom">
          <span>© {new Date().getUTCFullYear()} Oliveira Barbearia</span>
          <span>
            {content.openingHours.days}, {content.openingHours.hours}
          </span>
          <a href={content.links.phone} data-track="phone" data-track-origin="footer">
            {content.phone}
          </a>
        </div>
      </footer>
      <div className="mobile-booking">
        <ExternalLink href={content.links.booking} track="booking" origin="sticky-bar">
          Agendar meu horário
        </ExternalLink>
        <Button asChild variant="editorialOutline" size="icon" className="quick-whatsapp">
          <a href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Dúvidas pelo WhatsApp" title="Dúvidas pelo WhatsApp" data-track="whatsapp" data-track-origin="sticky-bar">
            <MessageCircle aria-hidden="true" />
          </a>
        </Button>
      </div>
    </>
  );
}
