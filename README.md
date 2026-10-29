# Portfólio Profissional — Desenvolvimento de Software & Infraestrutura de TI

Aplicação web interativa 3D desenvolvida em **React 19**, **TypeScript**, **Tailwind CSS**, **Three.js (WebGL)** e **Express** para apresentação de projetos, serviços técnicos, arquitetura de servidores em 3D e captação de demandas de engenharia de software e TI.

## Arquitetura do Projeto

- `src/data/portfolioData.ts`: Estrutura centralizada de dados (perfil, destaques, projetos demonstrativos, catálogo de 6 serviços de TI, 7 etapas de infraestrutura 3D, matriz de competências e linha do tempo de 6 etapas).
- `src/utils/portfolioLogic.ts` & `src/utils/portfolioLogic.test.ts`: Lógica pura desacoplada (validação e sanitização de formulário, rate-limiting por IP, filtragem de projetos e competências, geração de link dinâmico para WhatsApp e cálculos espaciais de paralaxe/inclinação 3D) com testes unitários nativos (`node:test`).
- `src/utils/webglUtils.ts`: Utilitários Three.js com detecção automática de renderização via software (`isSoftwareGl`), iluminação PBR de estúdio (`RoomEnvironment` + `PMREMGenerator`), sincronização `afterDraw` e limpeza completa de memória WebGL.
- `src/components/HeroScene3D.tsx`: Composição 3D interativa no Hero (estação de trabalho ultrawide com código procedural, camadas flutuantes de interface, servidor modular e anel orbital de rede) com dock inferior retrátil.
- `src/components/Infrastructure3DSection.tsx`: Ambiente 3D imersivo de infraestrutura de servidores sincronizado com as 7 etapas de implantação (Planejamento, Preparação, Instalação, Rede, Controle de Acesso, Backup, Testes e Documentação).
- `server.ts`: Servidor full-stack Express + Vite com endpoint real `POST /api/contact`, validação no servidor, proteção contra abuso (rate limit) e geração de protocolo de atendimento.

## Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente opcionais (baseadas em `.env.example`):
   - `VITE_CONTACT_EMAIL`: E-mail profissional de atendimento.
   - `VITE_WHATSAPP_NUMBER`: Número com DDI+DDD (ex.: `5511999999999`) para abertura direta de conversa no WhatsApp.
   - `VITE_GITHUB_URL`: URL do perfil GitHub.

3. Execute os testes unitários:
   ```bash
   npm test
   ```

4. Inicie o servidor de desenvolvimento (porta 3000):
   ```bash
   npm run dev
   ```

5. Para gerar a versão de produção:
   ```bash
   npm run build
   npm start
   ```
