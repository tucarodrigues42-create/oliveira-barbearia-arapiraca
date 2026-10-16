import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Clock, Instagram, MapPin, Menu, MessageCircle, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteContent as content } from '@/lib/site-content';
import logo from '@/assets/oliveira-logo-oficial.png.asset.json';
import clubLogo from '@/assets/clube-olvr-branco.png.asset.json';

const title = 'Oliveira Barbearia | Barbearia por assinatura em Arapiraca–AL';
const description = 'Seu estilo. Sua presença. Sempre em dia. Conheça a Oliveira Barbearia e o Clube OLVR em Arapiraca, consulte planos e agende pelo Cash Barber.';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title }, { name: 'description', content: description },
      { property: 'og:title', content: title }, { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' }, { property: 'og:url', content: '/' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [{ rel: 'canonical', href: '/' }],
  }),
  component: Index,
});

function ExternalLink({ href, children, variant = 'editorial', className = '' }: { href: string; children: ReactNode; variant?: 'editorial' | 'editorialOutline' | 'editorialLink'; className?: string }) {
  return <Button asChild variant={variant} className={className}><a href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight aria-hidden="true" /></a></Button>;
}

function Logo({ className = '' }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src={logo.url} width={1314} height={451} alt="Oliveira Barbearia" />;
}

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
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onResize);
    return () => { document.removeEventListener('keydown', onKeyDown); desktop.removeEventListener('change', onResize); };
  }, [menuOpen]);

  const selectSection = (id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }));
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="page-container header-inner">
          <a className="logo-link" href="#inicio" aria-label="Oliveira Barbearia — início"><Logo /></a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {content.navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}
          </nav>
          <ExternalLink className="header-booking" href={content.links.booking}>Agendar horário</ExternalLink>
          <Button ref={menuButton} variant="menu" size="icon" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        <nav ref={mobileNav} id="mobile-navigation" className="mobile-nav" aria-label="Navegação móvel" hidden={!menuOpen}>
          {content.navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => selectSection(item.id)}>{item.label}<ArrowUpRight aria-hidden="true" /></a>)}
          <ExternalLink href={content.links.booking}>Agendar horário</ExternalLink>
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="opening" id="inicio" aria-labelledby="opening-title">
          <div className="page-container opening-inner">
            <div className="eyebrow opening-location"><span className="location-dot" />{content.city}</div>
            <div className="opening-composition">
              <div className="opening-copy">
                <h1 id="opening-title">Seu estilo.<br />Sua presença.<br /><span>Sempre em dia.</span></h1>
                <p>{content.introduction}</p>
                <div className="opening-actions"><ExternalLink href={content.links.booking}>Agendar horário</ExternalLink><ExternalLink href={content.links.whatsapp} variant="editorialOutline"><MessageCircle aria-hidden="true" />WhatsApp</ExternalLink></div>
                <Button asChild variant="editorialLink" className="opening-club-link"><a href="#planos">Conhecer o Clube OLVR<ArrowDown aria-hidden="true" /></a></Button>
              </div>
              <div className="brand-composition" aria-hidden="true">
                <div className="brand-frame"><span className="brand-frame-top">ESTILO É PRESENÇA</span><Logo /><div className="brand-frame-bottom"><span>BARBEARIA POR ASSINATURA</span><span>AL / BR</span></div></div>
                <span className="brand-caption">O cuidado começa com você.</span>
              </div>
            </div>
            <div className="opening-bottom"><span>SANTA ESMERALDA, ARAPIRACA</span><a href="#sobre">DESLIZE PARA CONHECER<ArrowDown size={15} aria-hidden="true" /></a></div>
          </div>
        </section>

        <div className="identity-strip" aria-hidden="true"><span>SEU ESTILO EM DIA</span><span>✳</span><span>OLIVEIRA BARBEARIA</span><span>✳</span><span>ARAPIRACA · AL</span><span>✳</span><span>SEU ESTILO EM DIA</span></div>

        <section id="sobre" className="section about-section" tabIndex={-1} aria-labelledby="about-title">
          <div className="page-container two-column"><div><p className="eyebrow">01 / A BARBEARIA</p><h2 id="about-title">O cuidado faz<br />parte do <em>estilo.</em></h2></div><div className="section-copy"><p>{content.about.text}</p><ExternalLink variant="editorialLink" href={content.links.instagram}><Instagram aria-hidden="true" />Veja os trabalhos no Instagram</ExternalLink><span className="small-label">{content.instagramHandle}</span></div></div>
        </section>

        <section id="planos" className="section subscription-section" tabIndex={-1} aria-labelledby="plans-title">
          <div className="page-container club-layout"><div className="club-identity"><p className="eyebrow">02 / {content.subscription.description}</p><h2 id="plans-title">{content.subscription.name}</h2><p className="club-tagline">{content.subscription.title}</p></div><img className="club-logo" src={clubLogo.url} width={1660} height={844} alt="Marca oficial do Clube OLVR, clube de assinatura da Oliveira Barbearia" /><div className="section-copy"><p>{content.subscription.text}</p><ExternalLink href={content.links.booking}>{content.subscription.action}</ExternalLink><div className="subscription-note"><Check size={16} aria-hidden="true" /><span>Opções e condições no Cash Barber</span></div></div></div>
        </section>

        <section className="section booking-section" aria-labelledby="booking-title">
          <div className="page-container"><div className="section-heading"><div><p className="eyebrow">03 / SEU PRÓXIMO HORÁRIO</p><h2 id="booking-title">Agendar é simples.</h2></div><p>Seu atendimento começa no Cash Barber.</p></div><ol className="steps">{content.steps.map((step, index) => <li key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><ExternalLink variant="editorialOutline" href={content.links.booking}>Abrir agendamento</ExternalLink></div>
        </section>

        <section id="avaliacoes" className="section reviews-section" tabIndex={-1} aria-labelledby="reviews-title">
          <div className="page-container"><div className="reviews-layout"><div><p className="eyebrow">AVALIAÇÕES NO GOOGLE</p><h2 id="reviews-title">A experiência<br />de quem <em>já veio.</em></h2><p className="review-intro">Conheça as opiniões dos clientes no perfil da Oliveira Barbearia.</p><ExternalLink variant="editorialLink" href={content.reviews.profileUrl}>Ver avaliações no Google</ExternalLink></div><div className="rating-block"><div className="stars" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={21} />)}</div><p className="rating"><span>{content.reviews.rating.toFixed(1).replace('.', ',')}</span><span className="rating-total">/ 5</span></p><p className="rating-count">{content.reviews.count} avaliações no Google</p></div></div><p className="review-source">{content.reviews.source} em {content.reviews.date} · Atualização manual</p></div>
        </section>

        <section id="contato" className="section contact-section" tabIndex={-1} aria-labelledby="contact-title"><div className="page-container two-column"><div><p className="eyebrow">04 / VENHA ATÉ A OLIVEIRA</p><h2 id="contact-title">Nos vemos<br />na <em>barbearia.</em></h2><address><MapPin size={20} aria-hidden="true" /><div>{content.address.street}<br />{content.address.neighborhood} · {content.address.city}<br /><span>CEP {content.address.postalCode}</span></div></address><ExternalLink variant="editorialLink" href={content.links.maps}>Como chegar</ExternalLink></div><div className="contact-links"><a href={content.links.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /><div><span className="eyebrow">FALE COM A EQUIPE</span><h3>WhatsApp</h3><span>{content.phone}</span></div><ArrowUpRight aria-hidden="true" /></a><a href={content.links.instagram} target="_blank" rel="noopener noreferrer"><Instagram aria-hidden="true" /><div><span className="eyebrow">ACOMPANHE A OLIVEIRA</span><h3>Instagram</h3><span>{content.instagramHandle}</span></div><ArrowUpRight aria-hidden="true" /></a><p className="opening-hours"><Clock size={18} aria-hidden="true" /><span><strong>Horário de funcionamento</strong><br />{content.openingHours.days}, das {content.openingHours.hours}</span></p><p>Para consultar valores, entre em contato com a equipe.</p></div></div></section>

        <section className="section faq-section" aria-labelledby="faq-title"><div className="page-container two-column"><div><p className="eyebrow">ANTES DA SUA VISITA</p><h2 id="faq-title">Dúvidas<br /><em>frequentes.</em></h2></div><div className="faq-list">{content.faq.map(item => <details key={item.question}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}<ExternalLink variant="editorialLink" href={content.links.whatsapp}>Falar pelo WhatsApp</ExternalLink></div></div></section>
      </main>

      <footer className="site-footer"><div className="page-container footer-top"><a href="#inicio" className="footer-logo" aria-label="Oliveira Barbearia — voltar ao início"><Logo /></a><p>Seu estilo. Sua presença.<br /><span>Sempre em dia.</span></p><ExternalLink variant="editorialOutline" href={content.links.booking}>Agendar horário</ExternalLink></div><div className="page-container footer-bottom"><span>© {new Date().getUTCFullYear()} Oliveira Barbearia</span><span>Arapiraca · Alagoas</span><a href={content.links.phone}>{content.phone}</a></div></footer>
      <div className="mobile-booking"><ExternalLink href={content.links.booking}>Agendar horário</ExternalLink><Button asChild variant="editorialOutline" size="icon" className="quick-whatsapp"><a href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Atendimento pelo WhatsApp" title="Atendimento pelo WhatsApp"><MessageCircle aria-hidden="true" /></a></Button></div>
    </>
  );
}
