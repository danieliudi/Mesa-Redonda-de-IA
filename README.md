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

1. **Análise Independente + Web Search** — Cada agente pesquisa dados reais e analisa pela sua lente
2. **Debate Cruzado** — Agentes desafiam uns aos outros por nome
3. **Pré-Mortem** — "É 2028. O projeto fracassou. O que deu errado?"
4. **Plano de Mitigação** — Ação concreta para evitar cada fracasso identificado

### Síntese Executiva

O Moderador consolida tudo em: Veredicto, Score de Confiança, Consensos, Dissensos, Top 5 Riscos, Insights Munger & Kotler, Playbook de Execução, Kill Criteria e Condições de Sucesso.

## Features

- **Web Search na R1** — Agentes pesquisam dados reais (market size, benchmarks, custos)
- **Painel de Agentes** — Toggle on/off para montar a mesa sob medida
- **Anexo de Arquivos** — Upload de PDF, imagens e texto como contexto
- **Análise de URLs** — Cola URLs para os agentes analisarem
- **Follow-up Direcionado** — Chat pós-debate com agente específico
- **Playbook de Execução** — Gera plano detalhado com fases, KPIs e orçamento
- **Biblioteca de Debates** — Salva e revisita debates anteriores
- **Export PDF** — Debate completo e playbook exportáveis

## Stack

- React (artifact Claude.ai)
- Claude API (Sonnet 4)
- Web Search Tool API
- Persistent Storage API

## Como Usar

### No Claude.ai (mais simples)
1. Abra o arquivo `mesa-redonda.jsx` como artifact no Claude.ai
2. O sistema usa a API do Claude automaticamente
3. Clique em "Iniciar Debate"

### Como Web App (requer backend)
Para deploy externo, é necessário um backend proxy que segure a API key:
- Vercel Serverless Functions
- Cloudflare Workers
- Node.js + Express

## Configuração

O sistema usa `claude-sonnet-4-20250514` por padrão. Ajustes disponíveis:
- `max_tokens`: 1200 (agentes) / 2000 (R1 com search) / 4000 (síntese e playbook)
- Retry: 5 tentativas com backoff exponencial (0s, 4s, 8s, 15s, 25s)
- Delay entre agentes: 2s (R1) / 1.5s (R2-R4)

## Custo Estimado por Debate

~45 chamadas ao Sonnet 4 com web search ≈ $0.50–1.50 USD por debate completo (11 agentes, 4 rodadas + síntese + playbook).

## Licença

MIT

---

Criado por [Daniel Yano](https://github.com/danieliudi)
