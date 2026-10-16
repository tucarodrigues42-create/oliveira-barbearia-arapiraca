/**
 * Fonte única do conteúdo factual do site. Todos os preços, planos e condições
 * abaixo foram fornecidos e confirmados pelo proprietário. Não adicione dados
 * sem confirmação.
 */

export type TrackTarget =
  "booking" | "whatsapp" | "plans" | "reviews" | "instagram" | "maps" | "phone";

export interface Service {
  name: string;
  price: number;
}

export interface ExtraCharge {
  service: string;
  price: number;
  note?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  includes: string[];
  /** Franquia exibida junto ao plano sempre que houver serviços incluídos. */
  allowance?: string;
  includedDays: string;
  extras?: { days: string; charges: ExtraCharge[] };
  /** Frase curta de benefício direto, derivada apenas dos serviços incluídos — sem alegações não comprovadas. */
  benefit?: string;
  /** Verdadeiro apenas para o plano mais completo em serviços incluídos (não é uma alegação de popularidade/vendas). */
  highlight?: boolean;
  highlightLabel?: string;
}

export interface PlanFamily {
  id: "black" | "smart" | "one";
  name: string;
  summary: string;
  days: string;
  bookingWindow: string;
  /** Frase curta explicando para quem a família faz mais sentido. */
  valueHighlight?: string;
  plans: Plan[];
}

const ALLOWANCE = "Até 100 usos por mês de cada serviço incluído";

const services: Service[] = [
  { name: "Corte", price: 30 },
  { name: "Barba", price: 30 },
  { name: "Pezinho", price: 15 },
  { name: "Barba Express", price: 20 },
];

const planFamilies: PlanFamily[] = [
  {
    id: "black",
    name: "Black",
    summary: "Uso incluído em todos os dias de funcionamento.",
    days: "Segunda a sábado",
    bookingWindow: "Agendamento com até 30 dias de antecedência",
    valueHighlight: "Para quem corta e faz a barba sem contar os dias da semana.",
    plans: [
      {
        id: "black-corte",
        name: "Black Corte Ilimitado",
        price: 67.9,
        includes: ["Corte", "Pezinho"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a sábado",
        benefit: "Corte e pezinho sempre em dia, sem pensar em agenda, de segunda a sábado.",
      },
      {
        id: "black-barba",
        name: "Black Barba Ilimitada",
        price: 67.9,
        includes: ["Barba", "Barba Express"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a sábado",
        benefit: "Barba sempre alinhada, com Barba Express incluído, de segunda a sábado.",
      },
      {
        id: "black-corte-barba",
        name: "Black Corte e Barba",
        price: 117.9,
        includes: ["Corte", "Barba", "Pezinho", "Barba Express"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a sábado",
        benefit: "Corte, barba, pezinho e Barba Express em um único plano, todos os dias de funcionamento.",
        highlight: true,
        highlightLabel: "Plano completo",
      },
    ],
  },
  {
    id: "smart",
    name: "Smart",
    summary: "Uso incluído de segunda a quarta; de quinta a sábado, valores reduzidos.",
    days: "Incluído de segunda a quarta",
    bookingWindow: "Agendamento com até 7 dias de antecedência",
    valueHighlight: "Para quem concentra o cuidado no início da semana e economiza no resto.",
    plans: [
      {
        id: "smart-corte",
        name: "Smart Corte Ilimitado",
        price: 57.9,
        includes: ["Corte", "Pezinho"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a quarta",
        benefit: "Corte e pezinho incluídos de segunda a quarta; de quinta a sábado, corte com 50% de desconto.",
        extras: {
          days: "Quinta a sábado",
          charges: [{ service: "Corte", price: 15, note: "50% de R$ 30" }],
        },
      },
      {
        id: "smart-corte-barba",
        name: "Smart Corte e Barba",
        price: 107.9,
        includes: ["Corte", "Barba", "Barba Express"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a quarta",
        benefit: "Corte, barba e Barba Express incluídos de segunda a quarta; de quinta a sábado, com desconto por atendimento.",
        extras: {
          days: "Quinta a sábado",
          charges: [
            { service: "Corte", price: 15 },
            { service: "Barba", price: 15 },
            { service: "Barba Express", price: 10 },
          ],
        },
      },
      {
        id: "smart-barba",
        name: "Smart Barba Limitado",
        price: 57.9,
        includes: ["Barba", "Barba Express"],
        allowance: ALLOWANCE,
        includedDays: "Segunda a quarta",
        benefit: "Barba e Barba Express incluídos de segunda a quarta; de quinta a sábado, com desconto por atendimento.",
        extras: {
          days: "Quinta a sábado",
          charges: [
            { service: "Barba", price: 15 },
            { service: "Barba Express", price: 10 },
          ],
        },
      },
    ],
  },
  {
    id: "one",
    name: "One",
    summary: "Um corte por mês, com adicionais a valor reduzido.",
    days: "Segunda a sábado",
    bookingWindow: "Agendamento com até 30 dias de antecedência",
    valueHighlight: "Para manter o corte em dia gastando pouco por mês.",
    plans: [
      {
        id: "clube-one",
        name: "Clube One",
        price: 26.9,
        includes: ["1 corte por mês"],
        includedDays: "Segunda a sábado",
        benefit: "1 corte incluído por mês, com cortes extras por R$ 15 cada.",
        extras: {
          days: "Cortes adicionais",
          charges: [{ service: "Corte adicional", price: 15, note: "cada" }],
        },
      },
    ],
  },
];

export const siteContent = {
  name: "Oliveira Barbearia",
  city: "Arapiraca · Alagoas",
  hero: {
    eyebrow: "Santa Esmeralda · Arapiraca–AL",
    title: "Corte e barba em Arapiraca.",
    titleAccent: "Cuidado que cabe na sua rotina.",
    tagline: "Você em sua melhor versão.",
    text: "Atendimento avulso ou pelos planos do Clube OLVR, na Santa Esmeralda. Segunda a sábado, das 9h às 20h.",
    ratingBadge: "5,0 ★ · 315 avaliações no Google",
    cta: {
      primary: { label: "Agendar meu horário", target: "booking" as TrackTarget },
      secondary: { label: "Comparar planos", anchor: "planos" },
    },
  },
  links: {
    booking: "https://cashbarber.com.br/oliveirabsara",
    whatsapp: "https://wa.me/5582981820974",
    instagram: "https://www.instagram.com/oliveirabsarapiraca/",
    maps: "https://maps.app.goo.gl/x1bCGX52mGnLAja78",
    phone: "tel:+5582981820974",
  },
  phone: "(82) 98182-0974",
  openingHours: { days: "Segunda a sábado", hours: "9h às 20h", schema: "Mo-Sa 09:00-20:00" },
  instagramHandle: "@oliveirabsarapiraca",
  address: {
    street: "Rua Justino Sebastião da Silva, 75",
    neighborhood: "Santa Esmeralda",
    city: "Arapiraca–AL",
    postalCode: "57312-070",
  },
  about: {
    text: "Na Oliveira, o cuidado com o visual tem lugar na sua rotina. Conheça a barbearia, acompanhe os trabalhos e escolha seu próximo horário.",
  },
  services,
  servicesNote: "Valores avulsos informados pela barbearia. Confirme no Cash Barber ao agendar.",
  subscription: {
    name: "Clube OLVR",
    description: "Clube de assinatura da Oliveira Barbearia",
    title: "Seu estilo não tira folga.",
    text: "Três famílias de planos: Black para usar a semana toda, Smart para quem prefere o início da semana e One para um corte por mês.",
    action: "Assinar pelo Cash Barber",
    families: planFamilies,
    conditions: [
      "Mensalidade cobrada no cartão de crédito, com vigência indeterminada.",
      "Cancelamento a qualquer momento, sem multa.",
      "10% de desconto em serviços extras e produtos.",
      "Serviços adicionais mediante autorização prévia.",
      "Assinatura para maiores de 18 anos.",
    ],
    conditionsNote:
      "Resumo comercial das condições informadas. A contratação e as condições completas ficam no Cash Barber.",
    logo: { status: "provided", sourceFile: "Logos_OLVR.pdf / página 2 (versão branca)" },
  },
  reviews: {
    rating: 5.0,
    count: 315,
    date: "13/10/2026",
    source: "Dados do perfil Google fornecidos",
    profileUrl: "https://maps.app.goo.gl/x1bCGX52mGnLAja78",
    independentlyVerified: false,
    quotes: [
      {
        author: "Deatrax Logane",
        text: "Ambiente organizado, profissionais atenciosos e corte sempre do jeito que pedi.",
      },
      {
        author: "Ruy Falcão",
        text: "Um dos melhores atendimentos da cidade, todos muito preparados e competentes",
      },
      {
        author: "Salez xita",
        text: "Um lugar aconchegante, atencioso aos detalhes irei voltar outras vezes.",
      },
    ],
    quotesNote:
      "Trechos de avaliações do Google fornecidos pela barbearia, não verificados automaticamente.",
  },
  navigation: [
    { id: "servicos", label: "Serviços" },
    { id: "planos", label: "Clube OLVR" },
    { id: "avaliacoes", label: "Avaliações" },
    { id: "contato", label: "Contato" },
  ],
  steps: [
    { title: "Acesse a agenda", text: "Abra o agendamento online da Oliveira no Cash Barber." },
    {
      title: "Escolha seu atendimento",
      text: "Consulte as opções e os horários disponíveis no sistema.",
    },
    {
      title: "Finalize sua reserva",
      text: "Siga as orientações e confira a confirmação do seu agendamento.",
    },
  ],
  whatsappCta: {
    title: "Ficou com dúvida sobre qual plano escolher?",
    text: "Fala com a gente no WhatsApp antes de assinar — a gente te ajuda a decidir entre Black, Smart e One.",
    buttonLabel: "Chamar no WhatsApp",
    target: "whatsapp" as TrackTarget,
  },
  faq: [
    {
      question: "Qual a diferença entre Black e Smart?",
      answer:
        "No Black, os serviços incluídos podem ser usados de segunda a sábado e o agendamento abre com até 30 dias de antecedência. No Smart, o uso incluído vale de segunda a quarta; de quinta a sábado há valores reduzidos por serviço, e o agendamento abre com até 7 dias de antecedência.",
    },
    {
      question: "Como funciona o Clube One?",
      answer:
        "Por R$ 26,90 por mês você tem 1 corte incluído. Cortes adicionais custam R$ 15 cada. Vale de segunda a sábado, com agendamento até 30 dias antes.",
    },
    {
      question: "O que é cobrado de quinta a sábado nos planos Smart?",
      answer:
        "Smart Corte Ilimitado: corte a R$ 15. Smart Corte e Barba: corte R$ 15, barba R$ 15 e Barba Express R$ 10. Smart Barba Limitado: barba R$ 15 e Barba Express R$ 10.",
    },
    {
      question: "Os planos ilimitados têm limite?",
      answer:
        'Os planos com "Ilimitado" no nome têm franquia de 100 utilizações mensais de cada serviço incluído, conforme informado pelo sistema.',
    },
    {
      question: "Como pago e como cancelo?",
      answer:
        "A mensalidade é cobrada no cartão de crédito, com vigência indeterminada. O cancelamento pode ser feito a qualquer momento, sem multa.",
    },
    {
      question: "Como agendo ou assino?",
      answer:
        "Agendamentos avulsos e assinaturas do Clube OLVR são feitos no Cash Barber, sistema da barbearia. Este site não realiza reservas nem pagamentos.",
    },
    {
      question: "Onde fica e qual o horário?",
      answer:
        "Rua Justino Sebastião da Silva, 75, Santa Esmeralda, Arapiraca–AL. Funcionamos de segunda a sábado, das 9h às 20h.",
    },
  ],
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

/** Formata preços em reais; valores inteiros saem sem centavos ("R$ 30"). */
export function formatPrice(value: number): string {
  if (Number.isInteger(value)) return `R$ ${value}`;
  return currency.format(value).replace(/\u00a0/g, " ");
}
