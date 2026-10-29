export type ProjectCategory =
  | 'Todos'
  | 'Desenvolvimento web'
  | 'Sistemas e aplicações'
  | 'Automação'
  | 'Banco de dados'
  | 'Infraestrutura de TI'
  | 'Manutenção e suporte';

export type SkillCategory =
  | 'Todos'
  | 'Desenvolvimento'
  | 'Banco de Dados'
  | 'Infraestrutura'
  | 'Ferramentas';

export type SkillLevel =
  | 'Experiência'
  | 'Conhecimento prático'
  | 'Em aprendizado';

export interface ContactPayload {
  name: string;
  email: string;
  serviceType: string;
  description: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactPayload, string>>;
  sanitized: ContactPayload;
}

const VALID_SERVICES = [
  'Manutenção de Computadores',
  'Suporte Técnico',
  'Implantação de Servidores',
  'Redes e Infraestrutura',
  'Desenvolvimento de Sistemas',
  'Banco de Dados e Automação',
  'Outro / Consultoria Técnica',
];

export function sanitizeText(input: unknown, maxLength = 1500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLength);
}

export function validateContactPayload(raw: Partial<ContactPayload>): ContactValidationResult {
  const name = sanitizeText(raw.name, 120);
  const email = sanitizeText(raw.email, 160).toLowerCase();
  const serviceType = sanitizeText(raw.serviceType, 100);
  const description = sanitizeText(raw.description, 2000);

  const errors: Partial<Record<keyof ContactPayload, string>> = {};

  if (!name || name.length < 2) {
    errors.name = 'Informe seu nome completo ou identificação profissional (mínimo de 2 caracteres).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email) {
    errors.email = 'Informe um endereço de e-mail válido para retorno.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'O formato do e-mail informado é inválido.';
  }

  if (!serviceType) {
    errors.serviceType = 'Selecione a modalidade de serviço ou área técnica.';
  } else if (!VALID_SERVICES.includes(serviceType)) {
    errors.serviceType = 'Modalidade de serviço selecionada não é reconhecida.';
  }

  if (!description || description.length < 15) {
    errors.description = 'Descreva brevemente o cenário ou necessidade técnica (mínimo de 15 caracteres).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      serviceType,
      description,
    },
  };
}

export function checkRateLimit(
  historyMap: Map<string, number[]>,
  clientKey: string,
  nowMs: number,
  windowMs = 60_000,
  maxRequests = 5
): { allowed: boolean; retryAfterSeconds: number } {
  const timestamps = historyMap.get(clientKey) || [];
  const active = timestamps.filter((t) => nowMs - t < windowMs);

  if (active.length >= maxRequests) {
    const oldest = active[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (nowMs - oldest)) / 1000));
    historyMap.set(clientKey, active);
    return { allowed: false, retryAfterSeconds };
  }

  active.push(nowMs);
  historyMap.set(clientKey, active);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function filterProjectsByCategory<T extends { category: ProjectCategory }>(
  projects: readonly T[],
  selectedCategory: ProjectCategory
): T[] {
  if (selectedCategory === 'Todos') {
    return [...projects];
  }
  return projects.filter((p) => p.category === selectedCategory);
}

export function filterSkills<
  T extends { category: Exclude<SkillCategory, 'Todos'>; level: SkillLevel }
>(
  skills: readonly T[],
  category: SkillCategory,
  level: SkillLevel | 'Todos' = 'Todos'
): T[] {
  return skills.filter((item) => {
    const matchCategory = category === 'Todos' || item.category === category;
    const matchLevel = level === 'Todos' || item.level === level;
    return matchCategory && matchLevel;
  });
}

export function buildWhatsAppLink(params: {
  phone?: string;
  name?: string;
  serviceType?: string;
  description?: string;
}): string {
  const cleanPhone = (params.phone || '').replace(/\D/g, '');
  const intro = params.name
    ? `Olá Alex, meu nome é ${params.name.trim()}.`
    : 'Olá Alex, visitei seu portfólio profissional de Desenvolvimento de Software & Infraestrutura de TI.';
  const serviceLine = params.serviceType
    ? ` Tenho interesse em: ${params.serviceType.trim()}.`
    : ' Gostaria de conversar sobre uma demanda técnica.';
  const detailLine = params.description
    ? ` Resumo da necessidade: ${params.description.trim()}`
    : '';

  const fullText = `${intro}${serviceLine}${detailLine}`.trim();
  const encoded = encodeURIComponent(fullText);

  if (cleanPhone.length >= 10) {
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function computeCardTilt(
  normX: number,
  normY: number,
  maxDegrees = 6
): { rotateX: number; rotateY: number; glareX: number; glareY: number } {
  const clampedX = Math.max(-0.5, Math.min(0.5, normX));
  const clampedY = Math.max(-0.5, Math.min(0.5, normY));

  const rotateX = Number((-clampedY * maxDegrees * 2).toFixed(2));
  const rotateY = Number((clampedX * maxDegrees * 2).toFixed(2));
  const glareX = Math.round((clampedX + 0.5) * 100);
  const glareY = Math.round((clampedY + 0.5) * 100);

  return { rotateX, rotateY, glareX, glareY };
}

export function computeParallaxOffset(
  scrollY: number,
  speedMultiplier: number,
  maxOffset = 240
): number {
  const raw = scrollY * speedMultiplier;
  if (raw > maxOffset) return maxOffset;
  if (raw < -maxOffset) return -maxOffset;
  return Number(raw.toFixed(2));
}
