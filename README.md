# Mesa Redonda de IA 🎯

Sistema de deliberação multi-agente que simula uma mesa redonda de consultores especializados para avaliar projetos, decisões e ideias de negócio.

## Como Funciona

Você submete um desafio. **11 agentes com perfis distintos** debatem em **4 rodadas estruturadas**, trazendo dados reais via web search, e convergem para recomendações acionáveis.

### Os Agentes

| Agente | Papel |
|--------|-------|
| ♟️ Estrategista-Chefe | Positioning, vantagem competitiva, mercado |
| 📊 CFO Virtual | ROI, unit economics, viabilidade financeira |
| 🦉 Charlie Munger | Mental models, inversão, efeitos de 2ª ordem |
| 📕 Philip Kotler | Marketing estratégico, STP, posicionamento |
| 🔥 Advogado do Diabo | Destruir a ideia — se sobrevive, é forte |
| 🎯 Head de Vendas | Go-to-market, canais, proposta de valor |
| ✦ Creative Director | Branding, narrativa, identidade, cultura |
| ⚙️ Ops & Supply Chain | Operação, fornecedores, logística, escala |
| 🚀 Growth Hacker | Aquisição, CAC, LTV, growth loops |
| 🧠 Consumer Psychologist | Comportamento, JTBD, motivação |
| ⚖️ Regulatório & Legal | Tributário, trabalhista, compliance |

### As 4 Rodadas

1. **Análise Independente + Web Search** — Cada agente pesquisa dados reais e analisa
2. **Debate Cruzado** — Agentes desafiam uns aos outros por nome
3. **Pré-Mortem** — "É 2028. O projeto fracassou. O que deu errado?"
4. **Plano de Mitigação** — Ação concreta para evitar cada fracasso

## Features

- **Web Search** — Agentes pesquisam dados reais na R1
- **Painel de Agentes** — Toggle on/off, preset Mesa Rápida (3 agentes)
- **Anexo de Arquivos** — PDF, imagens e texto como contexto
- **Análise de URLs** — Cola URLs para análise
- **Follow-up Direcionado** — Chat pós-debate com agente específico
- **Playbook de Execução** — 4 fases, KPIs, orçamento
- **Biblioteca de Debates** — Salva e revisita debates
- **Export PDF** — Debate e playbook exportáveis

## Estrutura

```
├── mesa-redonda.jsx      # Versão artifact (Claude.ai)
├── src/
│   ├── App.jsx           # Versão web app (deploy)
│   └── main.jsx          # Entry point React
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

## Deploy no Netlify

1. Conecte este repo ao Netlify
2. Build command: `npm run build` | Publish: `dist`
3. Acesse a URL, insira sua API key da Anthropic
4. Comece a debater

## Uso no Claude.ai

O arquivo `mesa-redonda.jsx` funciona como artifact no Claude.ai sem API key.

## Custo

~45 chamadas ao Claude Sonnet ≈ $0.50–1.50 por debate completo.

---

Criado por [Daniel Yano](https://github.com/danieliudi)
