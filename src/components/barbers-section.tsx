import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ArrowUpRight } from "lucide-react";

type Barber = {
  id: string;
  name: string;
  role: string;
  /** Texto curto sobre o profissional. Só informações confirmadas por ele. */
  about: string;
  /** Caminho da foto em /public/fotos/equipe. Sem foto, a seção mostra as iniciais. */
  photo?: string;
  photoAlt?: string;
};

/** Equipe da barbearia. Fotos e textos só entram com autorização de cada profissional. */
export const barbers: readonly Barber[] = [
  {
    id: "joao-paulo",
    name: "João Paulo",
    role: "Dono e criador da Oliveira Barbearia",
    about: "Criou a Oliveira Barbearia e o Clube OLVR, em Arapiraca.",
  },
  {
    id: "jackson-delano",
    name: "Jackson Delano",
    role: "Barbeiro",
    about: "Barbeiro da equipe da Oliveira Barbearia, em Arapiraca.",
  },
  {
    id: "arthur-vinicius",
    name: "Arthur Vinícius",
    role: "Barbeiro",
    about: "Barbeiro da equipe da Oliveira Barbearia, em Arapiraca.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function BarbersSection({ bookingHref }: { bookingHref: string }) {
  return (
    <section id="quem-corta" className="section barbers-section" aria-labelledby="barbers-title">
      <div className="page-container">
        <div className="space-head">
          <h2 id="barbers-title">Quem corta o seu cabelo.</h2>
          <p className="lead">Conheça os barbeiros da Oliveira antes de marcar o seu horário.</p>
        </div>
        <TabsPrimitive.Root defaultValue={barbers[0].id} className="barbers-tabs">
          <TabsPrimitive.List className="plan-tablist" aria-label="Barbeiros da Oliveira">
            {barbers.map((barber) => (
              <TabsPrimitive.Trigger
                key={barber.id}
                value={barber.id}
                className="plan-tab"
                data-track="barbers"
                data-track-origin={`tab-${barber.id}`}
              >
                {barber.name}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
          {barbers.map((barber) => (
            <TabsPrimitive.Content key={barber.id} value={barber.id} className="barber-panel">
              <figure className="barber-photo">
                {barber.photo ? (
                  <img
                    src={barber.photo}
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    alt={barber.photoAlt ?? `${barber.name}, ${barber.role}`}
                  />
                ) : (
                  <span aria-hidden="true">{initials(barber.name)}</span>
                )}
              </figure>
              <div className="barber-text">
                <h3>{barber.name}</h3>
                <p className="barber-role">{barber.role}</p>
                <p className="barber-about">{barber.about}</p>
                <a
                  className="barber-link"
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="booking"
                  data-track-origin={`barber-${barber.id}`}
                >
                  Agendar no Cash Barber <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            </TabsPrimitive.Content>
          ))}
        </TabsPrimitive.Root>
      </div>
    </section>
  );
}
