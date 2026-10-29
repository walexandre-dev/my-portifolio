import React, { useState } from 'react';
import { SKILLS_DATA, WORKFLOW_STEPS } from '../data/portfolioData';
import { SkillCategory, SkillLevel, filterSkills } from '../utils/portfolioLogic';

const SKILL_CATEGORIES: SkillCategory[] = [
  'Todos',
  'Desenvolvimento',
  'Banco de Dados',
  'Infraestrutura',
  'Ferramentas',
];

const SKILL_LEVELS: (SkillLevel | 'Todos')[] = [
  'Todos',
  'Experiência',
  'Conhecimento prático',
  'Em aprendizado',
];

export const SkillsAndWorkflowSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | 'Todos'>('Todos');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  const visibleSkills = filterSkills(SKILLS_DATA, selectedCategory, selectedLevel);

  return (
    <>
      {/* SECTION 11: COMPETÊNCIAS TÉCNICAS */}
      <section
        id="competencias"
        aria-labelledby="skills-heading"
        className="relative border-t border-slate-800/80 bg-[#090d16] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium text-cyan-400">
              05. Matriz de Competências &amp; Ferramentas
            </p>
            <h2
              id="skills-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Domínio técnico organizado por área e vivência real.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Classificação transparente baseada na aplicação prática de cada tecnologia — sem
              percentuais arbitrários. Filtre por categoria ou estágio de domínio para inspecionar o
              contexto de uso.
            </p>
          </div>

          {/* Interactive Filters for Category and Qualitative Level */}
          <div className="mt-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div
              role="group"
              aria-label="Filtrar competências por área"
              className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#07090e] p-1.5"
            >
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div
              role="group"
              aria-label="Filtrar competências por nível de vivência"
              className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#07090e] p-1.5"
            >
              {SKILL_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedLevel === lvl
                      ? 'bg-slate-200 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {lvl === 'Todos' ? 'Todos os níveis' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid (Zero Percentage Bars; Clean Unboxed Metadata Separators) */}
          <div
            data-testid="skills-grid"
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#07090e] p-5 transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">{skill.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-200">{skill.level}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {skill.name}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {skill.contextNote}
                  </p>
                </div>

                {/* Qualitative 3-Segment Indicator (No Arbitrary Percentages) */}
                <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-slate-800/70">
                  <div
                    className="h-1 flex-1 rounded-full bg-cyan-400"
                    aria-hidden="true"
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      skill.level === 'Conhecimento prático' || skill.level === 'Experiência'
                        ? 'bg-cyan-400'
                        : 'bg-slate-800'
                    }`}
                    aria-hidden="true"
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      skill.level === 'Experiência' ? 'bg-cyan-400' : 'bg-slate-800'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: PROCESSO DE TRABALHO (6-STEP TIMELINE) */}
      <section
        id="processo"
        aria-labelledby="workflow-heading"
        className="relative border-t border-slate-800/80 bg-[#07090e] py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-medium text-cyan-400">
              06. Metodologia de Atendimento &amp; Execução
            </p>
            <h2
              id="workflow-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Processo de trabalho estruturado em 6 etapas.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Do levantamento inicial até a documentação de entrega, cada atendimento segue um
              fluxo previsível para garantir clareza técnica e segurança operacional.
            </p>
          </div>

          {/* Horizontal Grid on Large Screens, Vertical Timeline on Mobile */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isSelected = idx === activeWorkflowStep;
              return (
                <button
                  key={step.index}
                  type="button"
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    isSelected
                      ? 'border-cyan-500/80 bg-[#0c1424] shadow-md'
                      : 'border-slate-800/90 bg-[#0a0f1a] hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
                        {step.index}
                      </span>
                      <span className="font-mono text-xs text-slate-500">Etapa</span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-800/80 pt-3">
                    <p className="font-mono text-[11px] text-cyan-300">
                      Entrega: {step.deliverable}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
