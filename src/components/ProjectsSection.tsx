import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, CheckCircle2, Terminal, Layers } from 'lucide-react';
import {
  PROJECT_CATEGORIES,
  PROJECTS_DATA,
  ProjectItem,
  PROFILE_DATA,
} from '../data/portfolioData';
import {
  ProjectCategory,
  filterProjectsByCategory,
} from '../utils/portfolioLogic';
import { TiltCard } from './TiltCard';
import { ProjectSchematicArt } from './ProjectSchematicArt';

interface ProjectsSectionProps {
  reducedMotion: boolean;
  onRequestSimilarProject: (category: string, projectTitle: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  reducedMotion,
  onRequestSimilarProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('Todos');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filteredProjects = filterProjectsByCategory(PROJECTS_DATA, selectedCategory);

  // Close modal on Escape key
  useEffect(() => {
    if (!activeProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  return (
    <section
      id="projetos"
      aria-labelledby="projects-heading"
      className="relative border-t border-slate-800/80 bg-[#07090e] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading + Filter Bar */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-medium text-cyan-400">
              02. Portfólio de Projetos &amp; Arquiteturas Demonstrativas
            </p>
            <h2
              id="projects-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Soluções aplicadas da interface web à infraestrutura física.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Projetos demonstrativos estruturados para evidenciar modelagem técnica, organização de
              código, automação de rotinas e padronização de infraestrutura de TI.
            </p>
          </div>

          <div className="font-mono text-xs text-slate-400 tabular-nums">
            Exibindo <strong className="text-white">{filteredProjects.length}</strong> de{' '}
            {PROJECTS_DATA.length} projetos
          </div>
        </div>

        {/* Interactive Category Filter Controls (Functional Buttons) */}
        <div
          role="tablist"
          aria-label="Filtrar projetos por categoria"
          className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800/90 bg-[#0b101b] p-2"
        >
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div
          data-testid="projects-grid"
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              reducedMotion={reducedMotion}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0b101b] transition-colors hover:border-slate-700"
            >
              <div>
                {/* Schematic Preview with Parallax Hover */}
                <ProjectSchematicArt theme={project.visualTheme} title={project.title} />

                <div className="p-6">
                  {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono font-semibold text-cyan-400">{project.index}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-200">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{project.demoBadgeLabel}</span>
                  </div>

                  {/* Card Title */}
                  <h3 className="mt-3 font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                    {project.description}
                  </p>

                  {/* Unboxed Technologies List with Typographic Separators */}
                  <div className="mt-4 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Tecnologias: </span>
                    {project.technologies.map((tech, i) => (
                      <React.Fragment key={tech}>
                        {i > 0 && (
                          <span aria-hidden="true" className="mx-1.5 text-slate-600">
                            ·
                          </span>
                        )}
                        <span className="font-mono text-slate-300">{tech}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#080c15] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setActiveProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0"
                  aria-label={`Visualizar detalhes de ${project.title}`}
                >
                  <span>Visualizar detalhes</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <span className="font-mono text-xs text-slate-500">Estudo Técnico</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Accessible Project Detail Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveProject(null);
          }}
        >
          <div className="relative my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0b101b] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono font-semibold text-cyan-400">
                    PROJETO {activeProject.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.demoBadgeLabel}</span>
                </div>
                <h3
                  id="modal-project-title"
                  className="mt-2 font-display text-2xl font-bold text-white"
                >
                  {activeProject.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">{activeProject.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400"
                aria-label="Fechar detalhes do projeto"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Problem & Solution Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800/90 bg-[#070b13] p-5">
                <h4 className="font-display text-sm font-semibold text-white">
                  Problema Abordado
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {activeProject.problem}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/90 bg-[#070b13] p-5">
                <h4 className="font-display text-sm font-semibold text-cyan-400">
                  Solução Implementada
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {activeProject.solution}
                </p>
              </div>
            </div>

            {/* Main Functionalities */}
            <div className="mt-6">
              <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Principais Funcionalidades</span>
              </h4>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {activeProject.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-800/70 bg-[#080d17] p-3 text-xs leading-relaxed text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code / Configuration Excerpt */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span>Trecho Técnico / Implementação de Referência</span>
                </h4>
                <span className="font-mono text-xs text-slate-400">
                  {activeProject.architectureSummary}
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-[#06080f] p-4 font-mono text-xs leading-relaxed text-slate-200">
                <code>{activeProject.sourcePreviewSnippet}</code>
              </pre>
            </div>

            {/* Technologies & Modal Actions */}
            <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Stack utilizada: </span>
                {activeProject.technologies.join(' · ')}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={PROFILE_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:text-white whitespace-nowrap shrink-0"
                >
                  Ver Repositórios GitHub
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const cat = activeProject.category;
                    const title = activeProject.title;
                    setActiveProject(null);
                    onRequestSimilarProject(cat, title);
                  }}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 whitespace-nowrap shrink-0"
                >
                  Solicitar Solução Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
