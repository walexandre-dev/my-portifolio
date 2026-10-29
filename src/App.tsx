import React, { useEffect, useState, useCallback } from 'react';
import { ArrowDown, ArrowRight, Terminal, ShieldCheck, Layers } from 'lucide-react';
import { PROFILE_DATA, ABOUT_HIGHLIGHTS } from './data/portfolioData';
import { Navbar } from './components/Navbar';
import { ParallaxBackdrop } from './components/ParallaxBackdrop';
import { HeroScene3D } from './components/HeroScene3D';
import { TiltCard } from './components/TiltCard';
import { ProjectsSection } from './components/ProjectsSection';
import { ServicesSection } from './components/ServicesSection';
import { Infrastructure3DSection } from './components/Infrastructure3DSection';
import { SkillsAndWorkflowSection } from './components/SkillsAndWorkflowSection';
import { ContactAndFooterSection } from './components/ContactAndFooterSection';

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  const [selectedServiceForContact, setSelectedServiceForContact] = useState('');
  const [selectedNoteForContact, setSelectedNoteForContact] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll & Mouse Tracking with requestAnimationFrame throttling
  useEffect(() => {
    let rafScroll = 0;
    let rafMouse = 0;

    const handleScroll = () => {
      if (rafScroll) return;
      rafScroll = window.requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset || 0;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        setScrollY(currentY);
        setScrollProgress(currentY / maxScroll);
        rafScroll = 0;
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || rafMouse) return;
      rafMouse = window.requestAnimationFrame(() => {
        const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
        const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
        setMouseNorm({
          x: Number(nx.toFixed(3)),
          y: Number(ny.toFixed(3)),
        });
        rafMouse = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafScroll) cancelAnimationFrame(rafScroll);
      if (rafMouse) cancelAnimationFrame(rafMouse);
    };
  }, []);

  const handleSelectServiceAndScroll = useCallback((serviceValue: string, note = '') => {
    setSelectedServiceForContact(serviceValue);
    if (note) {
      setSelectedNoteForContact(note);
    }
    const contactEl = document.getElementById('contato');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleRequestSimilarProject = useCallback(
    (category: string, projectTitle: string) => {
      let mappedService = 'Desenvolvimento de Sistemas';
      if (category === 'Infraestrutura de TI') mappedService = 'Implantação de Servidores';
      else if (category === 'Manutenção e suporte') mappedService = 'Manutenção de Computadores';
      else if (category === 'Automação' || category === 'Banco de dados') {
        mappedService = 'Banco de Dados e Automação';
      }

      handleSelectServiceAndScroll(
        mappedService,
        `Tenho interesse em uma solução técnica semelhante ao projeto demonstrativo "${projectTitle}" (${category}).`
      );
    },
    [handleSelectServiceAndScroll]
  );

  return (
    <div id="topo" className="relative min-h-screen bg-[#07090e] text-slate-100">
      {/* 3-Layer Spatial Parallax System */}
      <ParallaxBackdrop
        scrollY={scrollY}
        mouseNorm={mouseNorm}
        reducedMotion={reducedMotion}
      />

      {/* Top Navigation Bar */}
      <Navbar scrollProgress={scrollProgress} />

      <main className="relative z-10">
        {/* SECTION 3: HERO SECTION — EXPERIÊNCIA 3D INICIAL */}
        <section
          aria-labelledby="hero-heading"
          className="relative flex min-h-[calc(100vh-70px)] flex-col justify-between py-12 lg:py-20"
        >
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Professional Identity & Magnetic Actions */}
              <div className="lg:col-span-6">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-medium text-cyan-400">
                  <span>Portfólio Técnico</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">{PROFILE_DATA.name}</span>
                </div>

                <h1
                  id="hero-heading"
                  className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.1]"
                >
                  Desenvolvimento de Software &amp; Infraestrutura de TI
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {PROFILE_DATA.tagline} Soluções estruturadas para desenvolver aplicações,
                  organizar servidores e manter estações e redes operando com estabilidade.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#projetos"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-cyan-300 whitespace-nowrap shrink-0"
                  >
                    <span>Explorar projetos</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <a
                    href="#servicos"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0c1220] px-6 py-3.5 text-sm font-semibold text-slate-100 transition-all hover:border-cyan-500/60 hover:bg-slate-900 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0"
                  >
                    <span>Conhecer serviços</span>
                  </a>
                </div>

                {/* Unboxed Technical Pillars */}
                <div className="mt-10 grid grid-cols-1 gap-4 border-t border-slate-800/80 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-cyan-400">Software &amp; Dados</p>
                    <p className="mt-1 text-xs text-slate-300">
                      React · Python · Flask · SQL · APIs REST
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-cyan-400">Servidores &amp; Redes</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Linux · Windows · TCP/IP · Controle de Acesso
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-cyan-400">Suporte &amp; Hardware</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Diagnóstico · Manutenção · Backup · Otimização
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Workstation, Code & Server Composition */}
              <div className="lg:col-span-6">
                <HeroScene3D
                  mouseNorm={mouseNorm}
                  scrollOffset={scrollY}
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>
          </div>

          {/* Bottom Scroll Indicator */}
          <div className="mx-auto mt-10 flex max-w-7xl justify-center px-6">
            <a
              href="#sobre"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-cyan-400"
              aria-label="Rolar para a seção Sobre Mim"
            >
              <span className="font-mono">Rolar para explorar</span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5 text-cyan-400" />
            </a>
          </div>
        </section>

        {/* SECTION 6: SEÇÃO SOBRE MIM */}
        <section
          id="sobre"
          aria-labelledby="about-heading"
          className="relative border-t border-slate-800/80 bg-[#090d16] py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="font-mono text-xs font-medium text-cyan-400">
                  01. Apresentação Profissional
                </p>
                <h2
                  id="about-heading"
                  className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
                >
                  Transformando tecnologia em soluções práticas.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  Atuo na convergência entre o desenvolvimento de software e a sustentação de
                  infraestrutura de TI. Essa visão integrada permite tanto criar aplicações web,
                  bancos de dados e rotinas de automação quanto diagnosticar problemas físicos em
                  computadores, estruturar redes locais e implantar servidores com segurança.
                </p>

                <div className="mt-8 space-y-4 border-t border-slate-800/80 pt-6">
                  <div className="flex items-start gap-3">
                    <Terminal className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white">
                        Código Limpo &amp; Automação Confiável
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Desenvolvimento de sistemas web, APIs REST e scripts Python voltados à
                        redução de retrabalho operacional e organização de dados em SQL.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white">
                        Infraestrutura Organizada &amp; Previsível
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Manutenção criteriosa de computadores, configuração de servidores locais,
                        permissões de rede e rotinas verificadas de backup.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Layers className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white">
                        Compromisso com a Clareza Técnica
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Diagnósticos objetivos, documentação das configurações aplicadas e evolução
                        técnica constante nas ferramentas do ecossistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 7 Pillars of Competence */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ABOUT_HIGHLIGHTS.map((item) => (
                    <TiltCard
                      key={item.id}
                      reducedMotion={reducedMotion}
                      maxTiltDegrees={4}
                      className="rounded-2xl border border-slate-800/90 bg-[#0c1220] p-6 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono font-bold text-cyan-400">{item.index}</span>
                        <span className="font-mono text-slate-400">{item.domainTag}</span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">
                        {item.description}
                      </p>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: PORTFÓLIO DE PROJETOS */}
        <ProjectsSection
          reducedMotion={reducedMotion}
          onRequestSimilarProject={handleRequestSimilarProject}
        />

        {/* SECTION 8: SEÇÃO DE SERVIÇOS DE TI */}
        <ServicesSection
          reducedMotion={reducedMotion}
          onSelectService={(serviceVal) => handleSelectServiceAndScroll(serviceVal)}
        />

        {/* SECTION 9: SEÇÃO DE INFRAESTRUTURA 3D */}
        <Infrastructure3DSection
          reducedMotion={reducedMotion}
          onRequestService={(serviceVal) => handleSelectServiceAndScroll(serviceVal)}
        />

        {/* SECTIONS 11 & 12: COMPETÊNCIAS E PROCESSO DE TRABALHO */}
        <SkillsAndWorkflowSection />

        {/* SECTIONS 13 & 14: CONTATO E RODAPÉ */}
        <ContactAndFooterSection
          preselectedService={selectedServiceForContact}
          preselectedNote={selectedNoteForContact}
        />
      </main>
    </div>
  );
}
