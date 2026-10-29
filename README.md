# Portfólio Profissional — Desenvolvimento de Software & Infraestrutura de TI

Aplicação web interativa 3D desenvolvida em **React 19**, **TypeScript**, **Tailwind CSS**, **Three.js (WebGL)** e **Express**, pronta tanto para execução full-stack quanto para publicação estática no **GitHub Pages**.

## Arquitetura do Projeto

- `src/data/portfolioData.ts`: Estrutura centralizada de dados (perfil, destaques, projetos demonstrativos, catálogo de 6 serviços de TI, 7 etapas de infraestrutura 3D, matriz de competências e linha do tempo de 6 etapas).
- `src/utils/portfolioLogic.ts` & `src/utils/portfolioLogic.test.ts`: Lógica pura desacoplada (validação e sanitização de formulário, rate-limiting por IP, filtragem de projetos e competências, geração de links dinâmicos para WhatsApp e `mailto:`, além de cálculos espaciais de paralaxe/inclinação 3D) com testes unitários nativos (`node:test`).
- `src/utils/webglUtils.ts`: Utilitários Three.js com detecção automática de renderização via software (`isSoftwareGl`), iluminação PBR de estúdio (`RoomEnvironment` + `PMREMGenerator`), sincronização `afterDraw` e limpeza completa de memória WebGL.
- `src/components/HeroScene3D.tsx`: Composição 3D interativa no Hero (estação de trabalho ultrawide com código procedural, camadas flutuantes de interface, servidor modular e anel orbital de rede) com dock inferior retrátil.
- `src/components/Infrastructure3DSection.tsx`: Ambiente 3D imersivo de infraestrutura de servidores sincronizado com as 7 etapas de implantação (*Planejamento*, *Preparação*, *Instalação*, *Rede*, *Controle de Acesso*, *Backup*, *Testes e Documentação*).
- `server.ts`: Servidor full-stack Express + Vite com endpoint `POST /api/contact`, validação no servidor, proteção contra abuso (rate limit) e geração de protocolo de atendimento.
- `.github/workflows/deploy-pages.yml`: Workflow oficial do GitHub Actions para compilação estática e publicação automática no **GitHub Pages**.

## Publicação no GitHub Pages (Automática via GitHub Actions)

O projeto está pré-configurado para rodar diretamente no **GitHub Pages** em qualquer subcaminho (`https://seu-usuario.github.io/nome-do-repo/` ou domínio raiz):

1. ** Caminhos Relativos (`base: './'`)**: Configurado em `vite.config.ts` e `index.html` para que todos os scripts, estilos e ícones funcionem independentemente do nome do repositório.
2. **Arquivo `.nojekyll` e Fallback `404.html`**: Incluídos automaticamente no build para evitar que o processador Jekyll altere arquivos estáticos.
3. **Compatibilidade do Formulário de Contato em Hospedagem Estática**:
   - Quando executado com o servidor Node (`npm run dev` / `npm start`), o formulário registra os dados via `POST /api/contact`.
   - No **GitHub Pages** (hospedagem estática), o formulário valida e sanitiza todos os campos no navegador, gera o protocolo de referência e oferece botões diretos de 1 clique para conclusão imediata via **WhatsApp (com mensagem preenchida)** ou **E-mail (`mailto:` pré-formatado)** — além de suportar integração opcional com Formspree via variável `VITE_FORMSPREE_ENDPOINT`.

### Passo a Passo para Ativar no GitHub
1. Envie o repositório para o GitHub (pelo botão **GitHub** no topo do Google AI Studio ou via `git push -u origin main`).
2. No seu repositório no GitHub, acesse **Settings** > **Pages**.
3. Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy-pages.yml` será executado automaticamente a cada `push` na branch `main` (ou pode ser acionado manualmente na aba **Actions** > **Deploy to GitHub Pages** > **Run workflow**).

## Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute os testes unitários:
   ```bash
   npm test
   ```

3. Inicie o servidor de desenvolvimento (porta 3000):
   ```bash
   npm run dev
   ```

4. Para gerar o pacote estático (`dist/`) manualmente:
   ```bash
   npm run build
   ```
