import React from 'react';
import {
  Cpu,
  Headphones,
  Server,
  Network,
  Code2,
  Database,
  Check,
  ArrowRight,
} from 'lucide-react';
import { SERVICES_DATA, ServiceItem } from '../data/portfolioData';
import { TiltCard } from './TiltCard';

interface ServicesSectionProps {
  reducedMotion: boolean;
  onSelectService: (serviceValue: string) => void;
}

function renderServiceIcon(iconKey: ServiceItem['iconKey']) {
  const iconClass = 'h-6 w-6 text-cyan-400';
  switch (iconKey) {
    case 'cpu':
      return <Cpu className={iconClass} />;
    case 'headphones':
      return <Headphones className={iconClass} />;
    case 'server':
      return <Server className={iconClass} />;
    case 'network':
      return <Network className={iconClass} />;
    case 'code':
      return <Code2 className={iconClass} />;
    case 'database':
      return <Database className={iconClass} />;
  }
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  reducedMotion,
  onSelectService,
}) => {
  return (
    <section
      id="servicos"
      aria-labelledby="services-heading"
      className="relative border-t border-slate-800/80 bg-[#090d16] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-cyan-400">
            03. Catálogo de Serviços Técnicos &amp; Engenharia
          </p>
          <h2
            id="services-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Soluções de TI para manter sua tecnologia funcionando.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Atuação técnica transparente em manutenção de hardware, suporte ao usuário, implantação
            de servidores, redes locais, desenvolvimento de sistemas e automação de dados. A
            contratação e o escopo detalhado são definidos a partir de avaliação técnica prévia do
            seu ambiente.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service) => (
            <TiltCard
              key={service.id}
              reducedMotion={reducedMotion}
              className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0c1220] p-7 transition-colors hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs font-semibold text-cyan-400">
                    {service.index}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-[#07090e]">
                    {renderServiceIcon(service.iconKey)}
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-white">
                  {service.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  {service.summary}
                </p>

                <ul className="mt-5 space-y-2 border-t border-slate-800/80 pt-5">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-200"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <p className="text-xs leading-relaxed text-slate-400">
                  {service.evaluationNote}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectService(service.formServiceValue)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0"
                  aria-label={`Solicitar atendimento para ${service.title}`}
                >
                  <span>Solicitar atendimento</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
