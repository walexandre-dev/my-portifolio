import React, { useState, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Mail,
  Github,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { PROFILE_DATA, SERVICES_DATA } from '../data/portfolioData';
import {
  ContactPayload,
  validateContactPayload,
  buildWhatsAppLink,
  buildMailtoLink,
} from '../utils/portfolioLogic';

interface ContactAndFooterSectionProps {
  preselectedService: string;
  preselectedNote: string;
}

interface SubmissionReceipt {
  protocol: string;
  createdAt: string;
  message: string;
  name: string;
  email: string;
  serviceType: string;
  description: string;
  deliveryMode: 'server' | 'static-pages';
}

const envFormspreeEndpoint =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FORMSPREE_ENDPOINT) || '';

export const ContactAndFooterSection: React.FC<ContactAndFooterSectionProps> = ({
  preselectedService,
  preselectedNote,
}) => {
  const [formData, setFormData] = useState<ContactPayload>({
    name: '',
    email: '',
    serviceType: preselectedService || '',
    description: preselectedNote || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceType: preselectedService,
        description: preselectedNote || prev.description,
      }));
      setErrors((prev) => ({ ...prev, serviceType: undefined }));
    }
  }, [preselectedService, preselectedNote]);

  const handleFieldChange = (
    field: keyof ContactPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const saveStaticFallbackSubmission = (sanitized: ContactPayload) => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const protocol = `PAG-${new Date().getFullYear()}-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    try {
      const existingRaw = localStorage.getItem('portfolio_contact_requests');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      if (Array.isArray(existing)) {
        existing.unshift({ protocol, ...sanitized, createdAt });
        localStorage.setItem(
          'portfolio_contact_requests',
          JSON.stringify(existing.slice(0, 50))
        );
      }
    } catch {
      // Ignore storage quota errors
    }

    setReceipt({
      protocol,
      createdAt,
      message:
        'Dados validados e formatados com sucesso. Como esta página está em hospedagem estática (GitHub Pages), conclua o envio direto com um clique via WhatsApp ou E-mail abaixo.',
      name: sanitized.name,
      email: sanitized.email,
      serviceType: sanitized.serviceType,
      description: sanitized.description,
      deliveryMode: 'static-pages',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateContactPayload(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      // 1. If an external Formspree / Serverless endpoint is configured for GitHub Pages
      if (envFormspreeEndpoint && /^https?:\/\//i.test(envFormspreeEndpoint)) {
        const extRes = await fetch(envFormspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(validation.sanitized),
        });
        if (extRes.ok) {
          const protocol = `EXT-${new Date().getFullYear()}-${Math.floor(
            100000 + Math.random() * 900000
          )}`;
          setReceipt({
            protocol,
            createdAt: new Date().toISOString(),
            message:
              'Solicitação enviada com sucesso através do serviço de formulários. Você também pode iniciar conversa imediata pelo WhatsApp.',
            ...validation.sanitized,
            deliveryMode: 'server',
          });
          setErrors({});
          return;
        }
      }

      // 2. Try the integrated Express backend (/api/contact)
      const response = await fetch('./api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.sanitized),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Running on static GitHub Pages where ./api/contact is not a Node server
        saveStaticFallbackSubmission(validation.sanitized);
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (response.status === 404 || response.status === 405) {
          saveStaticFallbackSubmission(validation.sanitized);
          return;
        }
        if (data.errors) {
          setErrors(data.errors);
        }
        setServerError(
          data.message || 'Não foi possível registrar sua solicitação no momento.'
        );
        return;
      }

      setReceipt({
        protocol: data.protocol,
        createdAt: data.createdAt,
        message: data.message,
        name: validation.sanitized.name,
        email: validation.sanitized.email,
        serviceType: validation.sanitized.serviceType,
        description: validation.sanitized.description,
        deliveryMode: 'server',
      });
      setErrors({});
    } catch {
      // Network error or static file environment without backend route -> use static fallback
      saveStaticFallbackSubmission(validation.sanitized);
    } finally {
      setSubmitting(false);
    }
  };

  const activeName = receipt ? receipt.name : formData.name;
  const activeEmail = receipt ? receipt.email : formData.email;
  const activeService = receipt ? receipt.serviceType : formData.serviceType;
  const activeDescription = receipt ? receipt.description : formData.description;

  const whatsappDirectHref = buildWhatsAppLink({
    phone: PROFILE_DATA.whatsappNumber,
    name: activeName,
    serviceType: activeService,
    description: activeDescription,
  });

  const mailtoDirectHref = buildMailtoLink({
    recipientEmail: PROFILE_DATA.email,
    name: activeName,
    senderEmail: activeEmail,
    serviceType: activeService,
    description: activeDescription,
    protocol: receipt?.protocol,
  });

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* SECTION 13: CONTATO E CONVERSÃO */}
      <section
        id="contato"
        aria-labelledby="contact-heading"
        className="relative border-t border-slate-800/80 bg-[#090d16] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Direct Channels & Context */}
            <div className="lg:col-span-5">
              <p className="font-mono text-xs font-medium text-cyan-400">
                07. Atendimento Técnico &amp; Propostas
              </p>
              <h2
                id="contact-heading"
                className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Vamos transformar sua necessidade em uma solução.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Preencha o formulário para registrar sua demanda técnica ou inicie uma conversa
                direta pelo WhatsApp com os dados preenchidos automaticamente.
              </p>

              {/* Direct Contact Cards */}
              <div className="mt-8 space-y-4">
                <a
                  href={whatsappDirectHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090e] p-4 transition-colors hover:border-cyan-500/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-cyan-400">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">WhatsApp com Mensagem Pronta</p>
                      <p className="text-xs text-slate-400">
                        Abre conversa com o resumo preenchido no formulário
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-cyan-400 shrink-0" />
                </a>

                <a
                  href={mailtoDirectHref}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090e] p-4 transition-colors hover:border-cyan-500/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-cyan-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">E-mail Profissional</p>
                      <p className="font-mono text-xs text-slate-300">{PROFILE_DATA.email}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-cyan-400 shrink-0" />
                </a>

                <a
                  href={PROFILE_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#07090e] p-4 transition-colors hover:border-cyan-500/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-cyan-400">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">GitHub</p>
                      <p className="font-mono text-xs text-slate-400">
                        Repositórios, scripts e projetos de código
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-cyan-400 shrink-0" />
                </a>
              </div>
            </div>

            {/* Right Column: Validated Contact Form Connected to Express Backend / Static Pages Fallback */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-800 bg-[#07090e] p-6 sm:p-8">
                {receipt ? (
                  <div
                    data-testid="contact-receipt"
                    className="rounded-xl border border-cyan-500/50 bg-[#0b1524] p-6"
                  >
                    <div className="flex items-center gap-3 text-cyan-400">
                      <CheckCircle2 className="h-6 w-6 shrink-0" />
                      <h3 className="font-display text-xl font-bold text-white">
                        {receipt.deliveryMode === 'server'
                          ? 'Solicitação Registrada com Sucesso'
                          : 'Solicitação Validada e Pronta para Envio'}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      {receipt.message}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-800 bg-[#07090e] p-4 text-xs sm:grid-cols-2">
                      <div>
                        <span className="text-slate-400">Protocolo de Registro: </span>
                        <strong className="font-mono text-cyan-400">{receipt.protocol}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Serviço: </span>
                        <strong className="text-white">{receipt.serviceType}</strong>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={whatsappDirectHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 whitespace-nowrap shrink-0"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Enviar via WhatsApp</span>
                      </a>

                      <a
                        href={mailtoDirectHref}
                        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-slate-950 whitespace-nowrap shrink-0"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Enviar via E-mail</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setReceipt(null);
                          setFormData({
                            name: '',
                            email: '',
                            serviceType: '',
                            description: '',
                          });
                        }}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
                      >
                        Nova Solicitação
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Nome */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-semibold text-slate-200"
                        >
                          Nome ou Empresa *
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          placeholder="Seu nome completo"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'error-contact-name' : undefined}
                          className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0b101b] px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
                        />
                        {errors.name && (
                          <p
                            id="error-contact-name"
                            role="alert"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* E-mail */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-semibold text-slate-200"
                        >
                          E-mail para retorno *
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          placeholder="voce@exemplo.com.br"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? 'error-contact-email' : undefined}
                          className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0b101b] px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
                        />
                        {errors.email && (
                          <p
                            id="error-contact-email"
                            role="alert"
                            className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tipo de serviço */}
                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-semibold text-slate-200"
                      >
                        Tipo de serviço *
                      </label>
                      <select
                        id="contact-service"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                        aria-invalid={Boolean(errors.serviceType)}
                        aria-describedby={errors.serviceType ? 'error-contact-service' : undefined}
                        className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0b101b] px-4 py-2.5 text-sm text-white transition-colors focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">Selecione a modalidade técnica</option>
                        {SERVICES_DATA.map((srv) => (
                          <option key={srv.id} value={srv.formServiceValue}>
                            {srv.title}
                          </option>
                        ))}
                        <option value="Outro / Consultoria Técnica">
                          Outro / Consultoria Técnica
                        </option>
                      </select>
                      {errors.serviceType && (
                        <p
                          id="error-contact-service"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.serviceType}</span>
                        </p>
                      )}
                    </div>

                    {/* Descrição da necessidade */}
                    <div>
                      <label
                        htmlFor="contact-description"
                        className="block text-xs font-semibold text-slate-200"
                      >
                        Descrição da necessidade *
                      </label>
                      <textarea
                        id="contact-description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Descreva o equipamento, ambiente de rede, servidor ou sistema que deseja desenvolver ou manter..."
                        aria-invalid={Boolean(errors.description)}
                        aria-describedby={
                          errors.description ? 'error-contact-description' : undefined
                        }
                        className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0b101b] p-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
                      />
                      {errors.description && (
                        <p
                          id="error-contact-description"
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.description}</span>
                        </p>
                      )}
                    </div>

                    {serverError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-xs text-rose-300"
                      >
                        {serverError}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-50 whitespace-nowrap shrink-0"
                      >
                        <Send className="h-4 w-4" />
                        <span>
                          {submitting ? 'Registrando solicitação...' : 'Enviar Solicitação Técnica'}
                        </span>
                      </button>

                      <a
                        href={whatsappDirectHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-white whitespace-nowrap shrink-0"
                      >
                        <MessageSquare className="h-4 w-4 text-cyan-400" />
                        <span>Conversar via WhatsApp</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: RODAPÉ */}
      <footer className="relative border-t border-slate-800/90 bg-[#05070b] py-16 text-slate-400">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Professional Identity */}
            <div className="md:col-span-5">
              <a
                href="#topo"
                className="font-display text-xl font-bold tracking-tight text-white"
              >
                {PROFILE_DATA.name}
              </a>
              <p className="mt-2 text-sm text-cyan-400">{PROFILE_DATA.roleTitle}</p>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
                {PROFILE_DATA.tagline}
              </p>
            </div>

            {/* Areas of Actuation */}
            <div className="md:col-span-4">
              <h3 className="font-display text-xs font-semibold tracking-wider text-slate-200">
                ÁREAS DE ATUAÇÃO
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                {PROFILE_DATA.areasOfActuation.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>

            {/* Quick Navigation & Direct Links */}
            <div className="md:col-span-3">
              <h3 className="font-display text-xs font-semibold tracking-wider text-slate-200">
                NAVEGAÇÃO &amp; CONTATO
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a href="#sobre" className="hover:text-white transition-colors">
                    Sobre Mim
                  </a>
                </li>
                <li>
                  <a href="#projetos" className="hover:text-white transition-colors">
                    Portfólio de Projetos
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="hover:text-white transition-colors">
                    Serviços de TI
                  </a>
                </li>
                <li>
                  <a href="#infraestrutura" className="hover:text-white transition-colors">
                    Infraestrutura 3D
                  </a>
                </li>
                <li>
                  <a href="#competencias" className="hover:text-white transition-colors">
                    Competências &amp; Processo
                  </a>
                </li>
                <li className="pt-2">
                  <a
                    href={`mailto:${PROFILE_DATA.email}`}
                    className="font-mono text-cyan-400 hover:underline"
                  >
                    {PROFILE_DATA.email}
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE_DATA.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                  <span aria-hidden="true" className="mx-2 text-slate-600">
                    ·
                  </span>
                  <a
                    href={whatsappDirectHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
            <p>
              &copy; {currentYear} {PROFILE_DATA.name}. Todos os direitos reservados.
            </p>
            <p>
              Desenvolvimento de Software · Infraestrutura de TI · Suporte &amp; Automação
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
