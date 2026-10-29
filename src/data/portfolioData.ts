import { ProjectCategory, SkillCategory, SkillLevel } from '../utils/portfolioLogic';

export interface ProfileConfig {
  name: string;
  roleTitle: string;
  tagline: string;
  email: string;
  githubUrl: string;
  whatsappNumber: string;
  location: string;
  areasOfActuation: string[];
}

export interface AboutHighlight {
  id: string;
  index: string;
  title: string;
  description: string;
  domainTag: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'Todos'>;
  isDemo: boolean;
  demoBadgeLabel: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  visualTheme: 'web-portal' | 'sys-control' | 'python-auto' | 'sql-engine' | 'server-rack' | 'hardware-diag';
  architectureSummary: string;
  demoSectionAnchor?: string;
  sourcePreviewSnippet: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  formServiceValue: string;
  summary: string;
  deliverables: string[];
  evaluationNote: string;
  iconKey: 'cpu' | 'headphones' | 'server' | 'network' | 'code' | 'database';
}

export interface InfraStage {
  step: number;
  index: string;
  title: string;
  subsystemLabel: string;
  description: string;
  technicalChecklist: string[];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  highlightGroup: 'overview' | 'chassis' | 'blades' | 'network' | 'security' | 'storage' | 'verification';
}

export interface SkillItem {
  name: string;
  category: Exclude<SkillCategory, 'Todos'>;
  level: SkillLevel;
  contextNote: string;
}

export interface WorkflowStep {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  deliverable: string;
}

const envEmail =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL) ||
  'alexsampaio2003@gmail.com';
const envGithub =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GITHUB_URL) ||
  'https://github.com/alexsampaio';
const envWhatsapp =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) ||
  '';

export const PROFILE_DATA: ProfileConfig = {
  name: 'Alex Sampaio',
  roleTitle: 'Desenvolvimento de Software & Infraestrutura de TI',
  tagline:
    'Engenharia de aplicações web, automação em Python, modelagem de bancos de dados SQL, implantação de servidores e manutenção especializada de ambientes computacionais.',
  email: envEmail,
  githubUrl: envGithub,
  whatsappNumber: envWhatsapp,
  location: 'Brasil · Atendimento Presencial & Remoto',
  areasOfActuation: [
    'Desenvolvimento de Software & Sistemas Web',
    'Manutenção Preventiva & Corretiva de Computadores',
    'Suporte Técnico & Diagnóstico de Conectividade',
    'Implantação e Administração de Servidores',
    'Redes Locais TCP/IP & Infraestrutura de TI',
    'Bancos de Dados SQL & Automação com Python',
  ],
};

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Todos',
  'Desenvolvimento web',
  'Sistemas e aplicações',
  'Automação',
  'Banco de dados',
  'Infraestrutura de TI',
  'Manutenção e suporte',
];

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    id: 'dev-apps',
    index: '01',
    title: 'Desenvolvimento de aplicações',
    description:
      'Construção de interfaces modernas em React, sistemas administrativos em Python/Flask e APIs REST estruturadas para operação cotidiana.',
    domainTag: 'Software & Web',
  },
  {
    id: 'tech-troubleshooting',
    index: '02',
    title: 'Resolução de problemas técnicos',
    description:
      'Diagnóstico metódico de falhas em sistemas operacionais, gargalos de rede, conflitos de software e indisponibilidade de serviços.',
    domainTag: 'Diagnóstico',
  },
  {
    id: 'pc-maintenance',
    index: '03',
    title: 'Manutenção de computadores',
    description:
      'Inspeção física de hardware, substituição de componentes, otimização térmica, atualização de BIOS/drivers e formatação limpa.',
    domainTag: 'Hardware & SO',
  },
  {
    id: 'server-deployment',
    index: '04',
    title: 'Implantação e configuração de servidores',
    description:
      'Preparação de servidores Windows e Linux, compartilhamento seguro de arquivos em rede, permissões de grupos e serviços essenciais.',
    domainTag: 'Servidores',
  },
  {
    id: 'infra-org',
    index: '05',
    title: 'Organização de infraestrutura',
    description:
      'Padronização de endereçamento IP, estruturação lógica de equipamentos de rede, mapeamento de ativos e documentação técnica.',
    domainTag: 'Redes TCP/IP',
  },
  {
    id: 'process-automation',
    index: '06',
    title: 'Automação de processos',
    description:
      'Criação de scripts em Python e consultas SQL para eliminar tarefas manuais repetitivas, integrar planilhas e gerar relatórios.',
    domainTag: 'Python & SQL',
  },
  {
    id: 'continuous-learning',
    index: '07',
    title: 'Aprendizado contínuo',
    description:
      'Aperfeiçoamento constante em conteinerização, arquitetura de bancos de dados, segurança de redes e boas práticas de engenharia.',
    domainTag: 'Evolução Técnica',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'proj-service-desk-web',
    index: '01',
    title: 'Portal Web de Chamados & Inventário de Ativos',
    subtitle: 'Aplicação web responsiva para abertura e rastreamento de ordens de serviço de TI',
    category: 'Desenvolvimento web',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Interface web full-stack desenvolvida para centralizar solicitações de suporte interno, vincular chamados ao patrimônio de hardware e acompanhar o histórico de manutenção por estação de trabalho.',
    problem:
      'Ambientes corporativos que registram solicitações de suporte por mensagens informais perdem o histórico de falhas recorrentes e não conseguem rastrear quais máquinas exigem substituição ou upgrade.',
    solution:
      'Desenvolvimento de uma aplicação web em React integrada a uma API REST em Python (Flask), permitindo abertura estruturada de chamados, classificação por prioridade e vínculo direto ao inventário de equipamentos.',
    features: [
      'Painel de triagem com filtros por status, setor e nível de criticidade',
      'Ficha técnica individual por computador (CPU, RAM, armazenamento, SO e histórico)',
      'Registro cronológico de intervenções técnicas e peças substituídas',
      'Exportação de relatórios operacionais em formato CSV e impressão de ordem de serviço',
    ],
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Python', 'Flask', 'APIs REST'],
    visualTheme: 'web-portal',
    architectureSummary: 'SPA React consumindo endpoints RESTful em Flask com persistência relacional e autenticação baseada em sessão.',
    sourcePreviewSnippet: `@app.route('/api/v1/tickets', methods=['POST'])
def create_service_ticket():
    payload = request.get_json(force=True)
    asset = Asset.query.filter_by(tag=payload['asset_tag']).first_or_404()
    ticket = ServiceTicket(
        title=payload['title'].strip(),
        priority=payload.get('priority', 'MEDIUM'),
        asset_id=asset.id,
        status='OPEN'
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify(ticket.to_dict()), 201`,
  },
  {
    id: 'proj-erp-control-system',
    index: '02',
    title: 'Sistema Administrativo de Controle Operacional e Cadastros',
    subtitle: 'Aplicação modular para controle de entradas, saídas de componentes e ordens técnicas',
    category: 'Sistemas e aplicações',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Sistema de gestão interna voltado ao controle de estoque de peças de reposição (SSDs, memórias, fontes, cabos), cadastro de fornecedores e vinculação de insumos às manutenções executadas.',
    problem:
      'A ausência de controle rigoroso sobre componentes de reposição gera divergências de estoque, atrasos em manutenções corretivas e falta de previsibilidade na reposição de insumos críticos.',
    solution:
      'Construção de um sistema administrativo estruturado com validação transacional, controle de movimentação de entrada/baixa de materiais e alertas automáticos de estoque mínimo.',
    features: [
      'Cadastro unificado de componentes, periféricos e insumos de rede',
      'Movimentação vinculada ao número da Ordem de Serviço com baixa automática',
      'Painel de indicadores com saldo físico e alerta de reposição preventiva',
      'Controle de acesso por perfil operacional e registro de auditoria',
    ],
    technologies: ['Python', 'Flask', 'SQLite', 'SQL', 'HTML', 'CSS', 'JavaScript'],
    visualTheme: 'sys-control',
    architectureSummary: 'Arquitetura MVC em Flask com transações atômicas em banco SQL para garantir integridade de saldo.',
    sourcePreviewSnippet: `def register_stock_movement(item_id: int, qty_delta: int, os_ref: str):
    with db.session.begin():
        item = InventoryItem.query.with_for_update().get(item_id)
        if item.quantity + qty_delta < 0:
            raise ValueError("Saldo insuficiente para baixa na OS.")
        item.quantity += qty_delta
        log = StockAuditLog(item_id=item_id, delta=qty_delta, reference=os_ref)
        db.session.add(log)`,
  },
  {
    id: 'proj-python-backup-automation',
    index: '03',
    title: 'Automação de Backup Incremental & Relatórios de Integridade',
    subtitle: 'Conjunto de scripts Python para cópia agendada, verificação SHA-256 e geração de logs',
    category: 'Automação',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Ferramenta de linha de comando em Python criada para automatizar rotinas de backup de diretórios compartilhados, validar a integridade dos arquivos compactados e emitir relatórios diários de execução.',
    problem:
      'Backups realizados manualmente são frequentemente esquecidos ou executados sem verificação de integridade, descobrindo-se falhas apenas no momento em que uma restauração urgente é necessária.',
    solution:
      'Automação em Python com compactação estruturada, cálculo de hash criptográfico SHA-256 de cada arquivo gerado, rotação automática de cópias antigas (política de retenção) e relatório consolidado.',
    features: [
      'Execução automatizada e silenciosa via agendador do sistema operacional',
      'Verificação de integridade pós-cópia via manifesto SHA-256',
      'Política de retenção configurável para evitar esgotamento de disco',
      'Geração automática de relatório técnico em JSON/CSV com tempos e volumes copiados',
    ],
    technologies: ['Python', 'SQL', 'Windows', 'Linux', 'Git'],
    visualTheme: 'python-auto',
    architectureSummary: 'Pipeline modular em Python utilizando bibliotecas nativas (pathlib, hashlib, tarfile, logging) sem dependências externas frágeis.',
    sourcePreviewSnippet: `def verify_archive_digest(archive_path: Path, expected_sha256: str) -> bool:
    hasher = hashlib.sha256()
    with archive_path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(65536), b''):
            hasher.update(chunk)
    calculated = hasher.hexdigest()
    return calculated == expected_sha256`,
  },
  {
    id: 'proj-sql-analytics-modeling',
    index: '04',
    title: 'Modelagem Relacional & Consolidação Analítica em SQL',
    subtitle: 'Estruturação de banco de dados PostgreSQL/MySQL com views otimizadas para indicadores',
    category: 'Banco de dados',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Projeto de normalização de dados, criação de índices estratégicos e desenvolvimento de consultas SQL analíticas para transformar planilhas dispersas em uma base relacional confiável.',
    problem:
      'Dados operacionais distribuídos em dezenas de planilhas desconexas causam duplicidade de cadastros, lentidão na consulta e inconsistência na geração de indicadores gerenciais.',
    solution:
      'Modelagem relacional em 3ª Forma Normal (3FN) no PostgreSQL, scripts Python de saneamento e carga (ETL) e views analíticas prontas para consumo em painéis como Power BI.',
    features: [
      'Esquema relacional normalizado com chaves estrangeiras e restrições de integridade',
      'Scripts SQL com CTEs e funções de janela para análise de desempenho mensal',
      'Índices compostos planejados para reduzir o tempo de busca em tabelas históricas',
      'Camada de views documentadas para conexão direta com ferramentas de BI',
    ],
    technologies: ['PostgreSQL', 'MySQL', 'SQL', 'Python', 'Power BI'],
    visualTheme: 'sql-engine',
    architectureSummary: 'Banco relacional PostgreSQL com camada de staging para higienização via Python e views analíticas indexadas.',
    sourcePreviewSnippet: `WITH monthly_sla AS (
  SELECT
    department_id,
    DATE_TRUNC('month', closed_at) AS ref_month,
    COUNT(*) AS total_tickets,
    AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600.0) AS avg_hours
  FROM service_tickets
  WHERE status = 'RESOLVED'
  GROUP BY department_id, DATE_TRUNC('month', closed_at)
)
SELECT d.name, m.ref_month, m.total_tickets, ROUND(m.avg_hours::numeric, 2) AS mttr_hours
FROM monthly_sla m
JOIN departments d ON d.id = m.department_id;`,
  },
  {
    id: 'proj-file-server-lan-infra',
    index: '05',
    title: 'Arquitetura de Servidor de Arquivos, Permissões & Rede Local',
    subtitle: 'Implantação padronizada de servidor local com controle de acesso por setor e topologia IP',
    category: 'Infraestrutura de TI',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Projeto demonstrativo de implantação de servidor de arquivos centralizado, organização lógica de sub-redes TCP/IP, matriz de permissões por grupo de trabalho e rotina de contingência.',
    problem:
      'Compartilhamentos de rede configurados sem controle de permissão expõem documentos sensíveis a usuários não autorizados e dificultam o backup centralizado da empresa.',
    solution:
      'Estruturação de servidor dedicado com grupos de segurança bem definidos (Financeiro, Operacional, Diretoria, Público), mapeamento automático de unidades de rede e endereçamento IP documentado.',
    features: [
      'Matriz de controle de acesso (leitura, gravação e restrição por departamento)',
      'Plano de endereçamento IP estático reservado para servidores, switches e impressoras',
      'Estrutura de diretórios padronizada com cotas de armazenamento',
      'Memorial descritivo completo da topologia física e lógica da rede',
    ],
    technologies: ['Servidores', 'Windows', 'Linux', 'Redes TCP/IP', 'Compartilhamento de arquivos', 'Backup e monitoramento'],
    visualTheme: 'server-rack',
    architectureSummary: 'Topologia estrela gigabit com servidor central, segmentação lógica de permissões ACL e cópia de segurança automatizada.',
    sourcePreviewSnippet: `# Exemplo de estrutura de permissões departamentais (Linux / Samba ACL)
[Financeiro]
   path = /srv/samba/financeiro
   valid users = @grp_financeiro @grp_diretoria
   read only = no
   create mask = 0660
   directory mask = 0770
   vfs objects = full_audit`,
  },
  {
    id: 'proj-workstation-diag-protocol',
    index: '06',
    title: 'Protocolo Técnico de Diagnóstico, Manutenção & Otimização de Estações',
    subtitle: 'Metodologia padronizada para recuperação de desempenho, estabilidade térmica e revisão de hardware',
    category: 'Manutenção e suporte',
    isDemo: true,
    demoBadgeLabel: 'Projeto de Demonstração',
    description:
      'Fluxo técnico estruturado para diagnóstico preciso de falhas intermitentes, manutenção preventiva e corretiva de desktops e notebooks, instalação limpa de sistemas e validação de estabilidade.',
    problem:
      'Manutenções superficiais sem testes de estresse de memória, saúde S.M.A.R.T. de armazenamento e aferição térmica resultam em retorno recorrente do equipamento com travamentos.',
    solution:
      'Aplicação de checklist técnico de 7 etapas cobrindo inspeção elétrica/física, leitura S.M.A.R.T. de discos, higienização interna com renovação térmica, instalação limpa de SO/drivers e validação pós-serviço.',
    features: [
      'Verificação completa de saúde de SSD/HDD, integridade de memória RAM e tensões',
      'Limpeza técnica de sistema de arrefecimento e controle de curva de temperatura',
      'Instalação padronizada de sistema operacional, drivers oficiais e softwares essenciais',
      'Laudo técnico de entrega detalhando procedimentos executados e recomendações',
    ],
    technologies: ['Windows', 'Linux', 'Redes TCP/IP', 'Backup e monitoramento'],
    visualTheme: 'hardware-diag',
    architectureSummary: 'Ciclo de manutenção orientado por métricas de temperatura, integridade de setores de disco e tempo de inicialização.',
    sourcePreviewSnippet: `# Checklist de Verificação Técnica de Estação
1. Inspeção S.M.A.R.T. (Reallocated Sectors / Wear Leveling) -> OK
2. Teste de estabilidade de memória RAM (0 erros reportados) -> OK
3. Higienização interna e substituição de composto térmico   -> OK
4. Instalação limpa do SO + Drivers de Chipset/Vídeo oficiais -> OK
5. Validação de conectividade Ethernet/Wi-Fi e periféricos    -> OK`,
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'srv-01',
    index: '01. Hardware & Sistema',
    title: 'Manutenção de Computadores',
    formServiceValue: 'Manutenção de Computadores',
    summary:
      'Cuidado técnico completo para desktops e notebooks, focado em restaurar a velocidade, a estabilidade térmica e a vida útil do equipamento.',
    deliverables: [
      'Diagnóstico de falhas',
      'Manutenção preventiva',
      'Manutenção corretiva',
      'Instalação de sistemas operacionais',
      'Instalação e configuração de programas',
      'Atualização de drivers',
      'Otimização de desempenho',
      'Verificação de hardware',
    ],
    evaluationNote: 'Escopo definido mediante diagnóstico físico e avaliação técnica do equipamento.',
    iconKey: 'cpu',
  },
  {
    id: 'srv-02',
    index: '02. Atendimento ao Usuário',
    title: 'Suporte Técnico',
    formServiceValue: 'Suporte Técnico',
    summary:
      'Atendimento ágil para solucionar erros operacionais no dia a dia, configurar periféricos e manter o ambiente de trabalho produtivo.',
    deliverables: [
      'Resolução de problemas de software',
      'Configuração de impressoras e periféricos',
      'Instalação de aplicativos',
      'Configuração de usuários e permissões',
      'Diagnóstico de problemas de conectividade',
      'Orientação técnica aos usuários',
    ],
    evaluationNote: 'Atendimento presencial ou remoto conforme a natureza da ocorrência técnica.',
    iconKey: 'headphones',
  },
  {
    id: 'srv-03',
    index: '03. Ambientes Corporativos',
    title: 'Implantação de Servidores',
    formServiceValue: 'Implantação de Servidores',
    summary:
      'Estruturação de servidores locais ou em nuvem para centralizar arquivos, organizar acessos e proteger os dados essenciais da operação.',
    deliverables: [
      'Planejamento de infraestrutura',
      'Instalação e configuração de sistemas operacionais para servidores',
      'Configuração de serviços de rede',
      'Compartilhamento de arquivos',
      'Controle de acesso',
      'Configuração de bancos de dados',
      'Rotinas de backup',
      'Documentação técnica',
    ],
    evaluationNote: 'Dimensionamento realizado após levantamento técnico de demanda e infraestrutura.',
    iconNote: '',
    iconKey: 'server',
  } as ServiceItem,
  {
    id: 'srv-04',
    index: '04. Conectividade & Topologia',
    title: 'Redes e Infraestrutura',
    formServiceValue: 'Redes e Infraestrutura',
    summary:
      'Organização lógica e física da rede local para garantir comunicação estável entre estações, servidores, impressoras e internet.',
    deliverables: [
      'Configuração de redes locais',
      'Organização de endereçamento IP',
      'Diagnóstico de conectividade',
      'Configuração de equipamentos de rede',
      'Compartilhamento de recursos',
      'Documentação da infraestrutura',
    ],
    evaluationNote: 'Projetos executados de acordo com a topologia e os equipamentos disponíveis no local.',
    iconKey: 'network',
  },
  {
    id: 'srv-05',
    index: '05. Engenharia de Software',
    title: 'Desenvolvimento de Sistemas',
    formServiceValue: 'Desenvolvimento de Sistemas',
    summary:
      'Criação de aplicações sob medida para informatizar controles internos, substituir planilhas complexas e integrar fluxos de trabalho.',
    deliverables: [
      'Sistemas web personalizados',
      'Aplicações administrativas',
      'Sistemas de controle e cadastro',
      'Painéis de indicadores',
      'APIs e integrações',
      'Automação de tarefas repetitivas',
    ],
    evaluationNote: 'Desenvolvimento planejado por etapas a partir do levantamento de requisitos.',
    iconKey: 'code',
  },
  {
    id: 'srv-06',
    index: '06. Dados & Scripts Python',
    title: 'Banco de Dados e Automação',
    formServiceValue: 'Banco de Dados e Automação',
    summary:
      'Estruturação de bases de dados relacionais e scripts em Python para acelerar consultas, cruzar informações e automatizar relatórios.',
    deliverables: [
      'Modelagem de dados',
      'Consultas SQL',
      'Desenvolvimento de scripts Python',
      'Integração de sistemas',
      'Geração automatizada de relatórios',
      'Organização e análise de dados',
    ],
    evaluationNote: 'Soluções desenhadas conforme a estrutura de dados e as regras de negócio existentes.',
    iconKey: 'database',
  },
];

export const INFRA_STAGES: InfraStage[] = [
  {
    step: 1,
    index: '01',
    title: 'Planejamento',
    subsystemLabel: 'Visão Geral da Arquitetura & Dimensionamento',
    description:
      'Mapeamento do número de usuários, volume de dados, requisitos de disponibilidade e definição da topologia física e lógica do ambiente de servidores.',
    technicalChecklist: [
      'Levantamento de cargas de trabalho (arquivos, banco de dados, aplicações)',
      'Dimensionamento de processamento, memória RAM e armazenamento útil',
      'Definição do plano de crescimento e organização do rack',
    ],
    cameraPos: [4.6, 2.8, 5.2],
    cameraTarget: [-0.2, 1.35, 0],
    highlightGroup: 'overview',
  },
  {
    step: 2,
    index: '02',
    title: 'Preparação do ambiente',
    subsystemLabel: 'Gabinete Estrutural, Energia & Climatização',
    description:
      'Organização física do rack, distribuição elétrica protegida por UPS (nobreak), fluxo de ventilação adequado e identificação física de barramentos.',
    technicalChecklist: [
      'Acomodação física do gabinete e organização de calhas de cabos',
      'Proteção elétrica na base com unidade UPS e estabilização de linha',
      'Verificação de circulação térmica e aterramento dos equipamentos',
    ],
    cameraPos: [3.6, 1.35, 4.4],
    cameraTarget: [0, 0.85, 0],
    highlightGroup: 'chassis',
  },
  {
    step: 3,
    index: '03',
    title: 'Instalação',
    subsystemLabel: 'Unidades de Processamento & Sistemas Operacionais',
    description:
      'Montagem dos servidores principais, configuração de arranjos de discos e instalação limpa do sistema operacional de servidor (Linux ou Windows Server).',
    technicalChecklist: [
      'Instalação física dos nós de processamento no rack principal',
      'Particionamento seguro de volumes do sistema e volumes de dados',
      'Hardening inicial do sistema operacional e pacotes essenciais',
    ],
    cameraPos: [3.2, 1.85, 4.1],
    cameraTarget: [0, 1.5, 0],
    highlightGroup: 'blades',
  },
  {
    step: 4,
    index: '04',
    title: 'Configuração de rede',
    subsystemLabel: 'Switch Core, Patch Panel & Endereçamento TCP/IP',
    description:
      'Interligação estruturada entre servidores, switch gerenciável e estações de trabalho, com endereçamento IP fixo, DNS local e rotas verificadas.',
    technicalChecklist: [
      'Organização de portas no Patch Panel e Switch Gigabit',
      'Reserva de IPs estáticos para servidores e serviços críticos',
      'Testes de latência, resolução de nomes e taxa de transferência na LAN',
    ],
    cameraPos: [3.3, 2.35, 4.2],
    cameraTarget: [-0.15, 1.85, 0],
    highlightGroup: 'network',
  },
  {
    step: 5,
    index: '05',
    title: 'Controle de acesso',
    subsystemLabel: 'Autenticação, Firewall & Permissões por Setor',
    description:
      'Implementação de regras de acesso baseadas no princípio do menor privilégio, separando diretórios e serviços conforme o perfil de cada usuário ou setor.',
    technicalChecklist: [
      'Criação de grupos departamentais e credenciais individuais',
      'Configuração de permissões de leitura/escrita em pastas compartilhadas',
      'Restrição de portas e serviços expostos na rede local',
    ],
    cameraPos: [-3.4, 2.15, 4.2],
    cameraTarget: [-0.1, 1.65, 0],
    highlightGroup: 'security',
  },
  {
    step: 6,
    index: '06',
    title: 'Backup',
    subsystemLabel: 'Storage de Contingência & Rotinas Automatizadas',
    description:
      'Configuração de unidades dedicadas de armazenamento e scripts automatizados de cópia periódica, garantindo recuperação rápida em caso de falha ou perda acidental.',
    technicalChecklist: [
      'Agendamento de cópias incrementais e completas fora do horário de pico',
      'Isolamento lógico do volume de backup contra alterações não autorizadas',
      'Simulação prática de restauração (teste de recuperação de arquivos)',
    ],
    cameraPos: [-3.1, 1.45, 4.2],
    cameraTarget: [0.1, 1.05, 0],
    highlightGroup: 'storage',
  },
  {
    step: 7,
    index: '07',
    title: 'Testes e documentação',
    subsystemLabel: 'Validação Operacional & Memorial Técnico',
    description:
      'Bateria final de testes de conectividade, validação de desempenho sob uso real e entrega de documentação organizada com mapa de rede e procedimentos.',
    technicalChecklist: [
      'Validação de acesso simultâneo pelas estações de trabalho',
      'Monitoramento de recursos (CPU, memória, disco e tráfego de rede)',
      'Entrega de documentação técnica clara para gestão futura do ambiente',
    ],
    cameraPos: [4.4, 2.5, 5.0],
    cameraTarget: [-0.2, 1.4, 0],
    highlightGroup: 'verification',
  },
];

export const SKILLS_DATA: SkillItem[] = [
  // DESENVOLVIMENTO
  {
    name: 'HTML',
    category: 'Desenvolvimento',
    level: 'Experiência',
    contextNote: 'Estruturação semântica, acessibilidade, SEO técnico e formulários.',
  },
  {
    name: 'CSS',
    category: 'Desenvolvimento',
    level: 'Experiência',
    contextNote: 'Layouts responsivos com Grid/Flexbox, animações aceleradas por hardware e design moderno.',
  },
  {
    name: 'JavaScript',
    category: 'Desenvolvimento',
    level: 'Experiência',
    contextNote: 'Manipulação de DOM, consumo assíncrono de APIs, validação e interatividade.',
  },
  {
    name: 'React',
    category: 'Desenvolvimento',
    level: 'Conhecimento prático',
    contextNote: 'Componentização modular, hooks, gerenciamento de estado e SPAs modernas.',
  },
  {
    name: 'Python',
    category: 'Desenvolvimento',
    level: 'Experiência',
    contextNote: 'Automação de processos, scripts de sistema, manipulação de arquivos, ETL e backend.',
  },
  {
    name: 'Flask',
    category: 'Desenvolvimento',
    level: 'Conhecimento prático',
    contextNote: 'Construção de aplicações web, sistemas internos e servidores de APIs.',
  },
  {
    name: 'APIs REST',
    category: 'Desenvolvimento',
    level: 'Conhecimento prático',
    contextNote: 'Modelagem de rotas HTTP, serialização JSON, integração entre sistemas e validação.',
  },

  // BANCO DE DADOS
  {
    name: 'SQL',
    category: 'Banco de Dados',
    level: 'Experiência',
    contextNote: 'Consultas relacionais, JOINs, agregações, views, filtros analíticos e manipulação DML/DDL.',
  },
  {
    name: 'PostgreSQL',
    category: 'Banco de Dados',
    level: 'Conhecimento prático',
    contextNote: 'Modelagem relacional robusta, integridade referencial e administração de esquemas.',
  },
  {
    name: 'MySQL',
    category: 'Banco de Dados',
    level: 'Conhecimento prático',
    contextNote: 'Configuração de bancos para sistemas web, consultas otimizadas e rotinas de dump/restore.',
  },
  {
    name: 'SQLite',
    category: 'Banco de Dados',
    level: 'Experiência',
    contextNote: 'Persistência leve embarcada para aplicações locais, ferramentas de automação e prototipação.',
  },

  // INFRAESTRUTURA
  {
    name: 'Windows',
    category: 'Infraestrutura',
    level: 'Experiência',
    contextNote: 'Instalação limpa, diagnóstico avançado, gerenciamento de serviços, usuários, rede e políticas.',
  },
  {
    name: 'Linux',
    category: 'Infraestrutura',
    level: 'Conhecimento prático',
    contextNote: 'Administração via terminal, permissões POSIX, serviços de rede, scripts bash e servidores.',
  },
  {
    name: 'Redes TCP/IP',
    category: 'Infraestrutura',
    level: 'Experiência',
    contextNote: 'Endereçamento IPv4, sub-redes, DHCP, DNS, cabeamento estruturado e diagnóstico de conectividade.',
  },
  {
    name: 'Servidores',
    category: 'Infraestrutura',
    level: 'Conhecimento prático',
    contextNote: 'Implantação de servidores locais, configuração de serviços, armazenamento e acesso controlado.',
  },
  {
    name: 'Compartilhamento de arquivos',
    category: 'Infraestrutura',
    level: 'Experiência',
    contextNote: 'Configuração de pastas em rede (SMB/CIFS), mapeamento de unidades e controle de permissões por grupo.',
  },
  {
    name: 'Backup e monitoramento',
    category: 'Infraestrutura',
    level: 'Conhecimento prático',
    contextNote: 'Rotinas preventivas de cópia de segurança, verificação de integridade e acompanhamento de saúde de discos.',
  },

  // FERRAMENTAS
  {
    name: 'Git',
    category: 'Ferramentas',
    level: 'Experiência',
    contextNote: 'Controle de versão distribuído, branches, histórico semântico e resolução de conflitos.',
  },
  {
    name: 'GitHub',
    category: 'Ferramentas',
    level: 'Experiência',
    contextNote: 'Hospedagem de repositórios, documentação técnica de código e organização de projetos.',
  },
  {
    name: 'Visual Studio Code',
    category: 'Ferramentas',
    level: 'Experiência',
    contextNote: 'Ambiente principal de desenvolvimento, depuração integrada, extensões de linting e terminal.',
  },
  {
    name: 'Docker',
    category: 'Ferramentas',
    level: 'Em aprendizado',
    contextNote: 'Padronização de ambientes de execução e empacotamento de aplicações e bancos de dados em containers.',
  },
  {
    name: 'Power BI',
    category: 'Ferramentas',
    level: 'Conhecimento prático',
    contextNote: 'Conexão a fontes SQL/planilhas, tratamento de dados e criação de painéis de indicadores.',
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    index: '01',
    title: 'Entendimento da necessidade',
    subtitle: 'Escuta ativa e alinhamento de objetivos',
    description:
      'Conversa inicial para compreender o problema técnico, a rotina de uso dos equipamentos ou processos que precisam ser informatizados ou corrigidos.',
    deliverable: 'Registro claro da demanda e dos objetivos esperados',
  },
  {
    index: '02',
    title: 'Diagnóstico e levantamento técnico',
    subtitle: 'Inspeção de hardware, rede ou requisitos de software',
    description:
      'Avaliação criteriosa do ambiente atual: testes de componentes físicos, verificação da topologia de rede ou mapeamento das regras de negócio e dados.',
    deliverable: 'Diagnóstico técnico detalhado do cenário encontrado',
  },
  {
    index: '03',
    title: 'Planejamento da solução',
    subtitle: 'Definição de arquitetura, etapas e recursos',
    description:
      'Elaboração da proposta técnica com o escopo de atuação, tecnologias ou peças necessárias, organização das etapas e alinhamento de prazos.',
    deliverable: 'Plano de execução estruturado e transparente',
  },
  {
    index: '04',
    title: 'Desenvolvimento ou execução',
    subtitle: 'Implementação prática com rigor técnico',
    description:
      'Codificação do sistema/automação, implantação do servidor, organização da infraestrutura de rede ou execução da manutenção preventiva/corretiva.',
    deliverable: 'Solução implementada segundo boas práticas de engenharia',
  },
  {
    index: '05',
    title: 'Testes e validação',
    subtitle: 'Verificação de estabilidade, segurança e desempenho',
    description:
      'Bateria de testes funcionais, aferição de temperaturas, testes de conectividade, validação de permissões de acesso e conferência junto ao solicitante.',
    deliverable: 'Ambiente ou sistema homologado e operando sem falhas',
  },
  {
    index: '06',
    title: 'Entrega e documentação',
    subtitle: 'Orientação técnica e registro das configurações',
    description:
      'Entrega formal da solução acompanhada de orientações de uso, organização de credenciais/mapeamentos e registro técnico do que foi realizado.',
    deliverable: 'Documentação técnica e entrega concluída',
  },
];
