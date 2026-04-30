import { useState, useRef, useCallback, useEffect } from "react";

const ALL_AGENTS = [
  { id: "estrategista", name: "Estrategista-Chefe", emoji: "♟️", color: "#1a1a2e", accent: "#e94560", role: "Positioning, vantagem competitiva, mercado",
    prompt: `Você é o ESTRATEGISTA-CHEFE em uma mesa redonda de consultores seniores.\nSeu papel: posicionamento, vantagem competitiva, movimentos de mercado, diferenciação, timing.\nPergunta-guia: "Isso nos diferencia ou nos comoditiza?"\nSeja direto, use frameworks estratégicos. Português brasileiro. Máximo 250 palavras. Denso e incisivo.` },
  { id: "cfo", name: "CFO Virtual", emoji: "📊", color: "#0f3460", accent: "#16c79a", role: "ROI, unit economics, viabilidade financeira",
    prompt: `Você é o CFO VIRTUAL em uma mesa redonda de consultores seniores.\nSeu papel: viabilidade financeira, investimento, margem, breakeven, ROI, payback, unit economics.\nPergunta-guia: "Quanto custa, quanto retorna, em quanto tempo?"\nUse números reais do mercado brasileiro (R$). Máximo 250 palavras.` },
  { id: "munger", name: "Charlie Munger", emoji: "🦉", color: "#1c1410", accent: "#d4a853", role: "Mental models, inversão, efeitos de 2ª ordem",
    prompt: `Você é CHARLIE MUNGER em uma mesa redonda de consultores seniores.\nUse seus princípios: INVERSÃO, MENTAL MODELS multidisciplinares, EFEITOS DE SEGUNDA ORDEM, CÍRCULO DE COMPETÊNCIA, INCENTIVOS, VIESES COGNITIVOS, MOATS.\nSeja sábio, provocador e brutalmente honesto. Use analogias. Português brasileiro. Máximo 280 palavras.` },
  { id: "kotler", name: "Philip Kotler", emoji: "📕", color: "#1a0f20", accent: "#e040fb", role: "Marketing estratégico, STP, posicionamento",
    prompt: `Você é PHILIP KOTLER em uma mesa redonda de consultores seniores.\nUse: STP, Marketing Mix (4Ps/7Ps), Marketing 5.0, Customer Journey, Brand Equity, Market Orientation, Marketing ROI.\nSeja acadêmico mas pragmático. Português brasileiro. Máximo 280 palavras.` },
  { id: "diabo", name: "Advogado do Diabo", emoji: "🔥", color: "#2d132c", accent: "#ee4540", role: "Destruir a ideia. Se sobrevive, é forte.",
    prompt: `Você é o ADVOGADO DO DIABO em uma mesa redonda de consultores seniores.\nSeu papel: DESTRUIR a ideia. Falhas fatais, riscos ocultos, motivos de fracasso.\nPergunta-guia: "Por que isso vai falhar?"\nSeja implacável. Cite cases reais. Português brasileiro. Máximo 250 palavras.` },
  { id: "vendas", name: "Head de Vendas", emoji: "🎯", color: "#1b1b2f", accent: "#f5a623", role: "Go-to-market, canais, proposta de valor",
    prompt: `Você é o HEAD DE VENDAS em uma mesa redonda de consultores seniores.\nSeu papel: go-to-market, canais, proposta de valor, pricing, persona.\nPergunta-guia: "O cliente entende em 10s? Compraria? Por quê?"\nPortuguês brasileiro. Máximo 250 palavras. Prático e orientado a conversão.` },
  { id: "creative", name: "Creative Director", emoji: "✦", color: "#1a1a2e", accent: "#c792ea", role: "Branding, narrativa, identidade, cultura",
    prompt: `Você é o CREATIVE DIRECTOR em uma mesa redonda de consultores seniores.\nSeu papel: branding, narrativa, identidade de marca, posicionamento cultural, storytelling.\nPergunta-guia: "Como isso vira uma marca que as pessoas desejam?"\nPortuguês brasileiro. Máximo 250 palavras.` },
  { id: "ops", name: "Ops & Supply Chain", emoji: "⚙️", color: "#0a1628", accent: "#4fc3f7", role: "Operação, fornecedores, logística, escala",
    prompt: `Você é o HEAD DE OPERAÇÕES E SUPPLY CHAIN em uma mesa redonda de consultores seniores.\nSeu papel: construir e escalar. Fornecedores, produção, logística, lead time, estoque, custos.\nPergunta-guia: "Isso é operacionalmente viável e escalável?"\nContexto brasileiro. Máximo 250 palavras.` },
  { id: "growth", name: "Growth Hacker", emoji: "🚀", color: "#1a0a2e", accent: "#ff6b6b", role: "Aquisição, CAC, LTV, growth loops",
    prompt: `Você é o GROWTH HACKER em uma mesa redonda de consultores seniores.\nSeu papel: crescer de 0→1.000→10.000 clientes. CAC, LTV, growth loops, performance, influencers, viral.\nPergunta-guia: "Qual a máquina de crescimento? CAC fecha com LTV?"\nBenchmarks reais. Português brasileiro. Máximo 250 palavras.` },
  { id: "consumer", name: "Consumer Psychologist", emoji: "🧠", color: "#162028", accent: "#ffb74d", role: "Comportamento, JTBD, motivação, desejo",
    prompt: `Você é o CONSUMER PSYCHOLOGIST em uma mesa redonda de consultores seniores.\nSeu papel: POR QUE alguém compraria. Motivações profundas, Jobs to Be Done, switching costs, drivers.\nPergunta-guia: "Qual o job real? O que faz trocar de marca?"\nPortuguês brasileiro. Máximo 250 palavras. Vá além do óbvio.` },
  { id: "legal", name: "Regulatório & Legal", emoji: "⚖️", color: "#1a1520", accent: "#90a4ae", role: "Tributário, trabalhista, importação, compliance",
    prompt: `Você é o ESPECIALISTA REGULATÓRIO E LEGAL em uma mesa redonda de consultores seniores.\nSeu papel: riscos legais, tributários, trabalhistas, regulatórios. Regime tributário, importação, marcas, LGPD.\nPergunta-guia: "O que pode te travar ou te matar legalmente?"\nContexto brasileiro. Máximo 250 palavras.` }
];

const ROUND_DEFS = [
  { id: "r1", number: 1, title: "ANÁLISE INDEPENDENTE + PESQUISA", subtitle: "Cada agente pesquisa dados reais e analisa", color: "#e94560",
    buildPrompt: (a, c) => ({ system: a.prompt + `\n\nIMPORTANTE: Você tem acesso a web search. USE-O para buscar dados reais, números, benchmarks, cases e informações atualizadas que fortaleçam sua análise. Não fique só na opinião — traga DADOS.`, user: `DESAFIO PARA ANÁLISE:\n${c}\n\nPesquise dados reais na web e dê sua análise completa com evidências.` }) },
  { id: "r2", number: 2, title: "DEBATE CRUZADO", subtitle: "Agentes desafiam uns aos outros", color: "#c792ea",
    buildPrompt: (a, c, prev, agents) => {
      const all = agents.map(x => `**${x.name}:** ${prev.r1?.[x.id]||"N/A"}`).join("\n\n---\n\n");
      return { system: `${a.prompt}\n\nRODADA 2 — DEBATE CRUZADO.\nConcorde ou discorde de colegas pelo nome. Ajuste sua posição. Adicione o que faltou. Máximo 200 palavras.`,
        user: `DESAFIO:\n${c}\n\nANÁLISES R1:\n${all}\n\nSua réplica:` };
    }},
  { id: "r3", number: 3, title: "PRÉ-MORTEM", subtitle: "Jan/2028. Fracassou. O que deu errado?", color: "#ee4540",
    buildPrompt: (a, c, prev, agents) => {
      const ctx = agents.map(x => `**${x.name}(R1):** ${prev.r1?.[x.id]||""}\n**${x.name}(R2):** ${prev.r2?.[x.id]||""}`).join("\n\n");
      return { system: `${a.prompt}\n\nRODADA 3 — PRÉ-MORTEM.\nÉ jan/2028. O projeto FRACASSOU.\n1. Causa principal\n2. Sinal ignorado\n3. Momento da decisão errada\nMáximo 150 palavras.`,
        user: `DESAFIO:\n${c}\n\nCONTEXTO:\n${ctx}\n\nSeu pré-mortem:` };
    }},
  { id: "r4", number: 4, title: "PLANO DE MITIGAÇÃO", subtitle: "Ação concreta para evitar o fracasso", color: "#16c79a",
    buildPrompt: (a, c, prev, agents) => {
      const pm = agents.map(x => `**${x.name}:** ${prev.r3?.[x.id]||""}`).join("\n\n");
      return { system: `${a.prompt}\n\nRODADA 4 — MITIGAÇÃO.\n1. AÇÃO CONCRETA #1\n2. INDICADOR de sucesso\n3. PRAZO\nMáximo 150 palavras.`,
        user: `DESAFIO:\n${c}\n\nPRÉ-MORTEMS:\n${pm}\n\nSua solução:` };
    }}
];

const MOD_PROMPT = `Você é o MODERADOR de uma mesa redonda de consultores de alto nível que debateram em 4 rodadas.
Sintetize TUDO em recomendação executiva.

## VEREDICTO
Frase direta: vale ou não, com condições.
## SCORE DE CONFIANÇA
De 1 a 10. Justifique em 1 frase.
## CONSENSOS
Pontos de convergência (cite agentes).
## DISSENSOS CRÍTICOS
Divergências reais — qual posição é mais forte.
## TOP 5 RISCOS
Ranking com probabilidade e impacto.
## INSIGHTS MUNGER & KOTLER
Pontos mais valiosos desses dois (se participaram).
## PLAYBOOK DE EXECUÇÃO
7-10 passos cronológicos com responsável e prazo.
## KILL CRITERIA
3 condições = abortar.
## CONDIÇÕES DE SUCESSO
O que precisa ser verdade.

Português brasileiro. Direto, estratégico, acionável. Máximo 700 palavras.`;

const PLAYBOOK_PROMPT = `Você é um CONSULTOR ESTRATÉGICO SÊNIOR. Um grupo de especialistas debateu um projeto em 4 rodadas.
Crie um PLAYBOOK DE EXECUÇÃO completo:

## 🎯 OBJETIVO DO PLAYBOOK
## 📋 PRÉ-REQUISITOS
## 🗓️ TIMELINE DE EXECUÇÃO
### FASE 1: VALIDAÇÃO (Semanas 1-4) — Ação, Responsável, Entregável, Investimento, Go/No-Go
### FASE 2: MVP (Semanas 5-12)
### FASE 3: TRAÇÃO (Meses 3-6)
### FASE 4: ESCALA (Meses 6-12)
## 📊 KPIs POR FASE
## 🚨 ALERTAS VERMELHOS
## 💰 ORÇAMENTO CONSOLIDADO
## 🧠 LIÇÕES DO DEBATE

Seja EXTREMAMENTE específico. Português brasileiro. Máximo 1500 palavras.`;

async function callClaude(apiKey, systemPrompt, userMessage, onStatus, maxTokens = 1200, attachments = [], useSearch = false) {
  const MAX = 5;
  const DELAYS = [0, 4000, 8000, 15000, 25000];
  const content = attachments.length > 0 ? [...attachments, { type: "text", text: userMessage }] : userMessage;
  for (let i = 0; i < MAX; i++) {
    try {
      if (i > 0) { if (onStatus) onStatus(`Tentativa ${i+1}/${MAX}...`); await new Promise(r => setTimeout(r, DELAYS[i])); }
      const body = { model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system: systemPrompt, messages: [{ role: "user", content }] };
      if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify(body)
      });
      if (res.status === 429 || res.status === 529) { if (i < MAX-1) continue; }
      if (!res.ok && i < MAX-1) continue;
      const data = await res.json();
      if (data.error && i < MAX-1) continue;
      const textParts = (data.content || []).filter(b => b.type === "text").map(b => b.text).filter(Boolean);
      if (textParts.length > 0) return textParts.join("\n\n");
      if (i < MAX-1) continue;
    } catch (e) { if (i === MAX-1) return "[Erro — 5 tentativas esgotadas]"; }
  }
  return "[Erro — 5 tentativas esgotadas]";
}

function generatePDF(challenge, roundData, synthesis, filesList, agents, urlsList) {
  const ts = new Date().toLocaleString("pt-BR");
  const rn = { r1: "RODADA 1 — ANÁLISE + PESQUISA", r2: "RODADA 2 — DEBATE CRUZADO", r3: "RODADA 3 — PRÉ-MORTEM", r4: "RODADA 4 — MITIGAÇÃO" };
  const fs = filesList?.length > 0 ? `<div class="fbox"><div class="lb">Arquivos</div><div class="fl">${filesList.map(f=>`<span class="ft">${f.name}</span>`).join("")}</div></div>` : "";
  const us = urlsList?.length > 0 ? `<div class="fbox"><div class="lb">URLs</div><div class="fl">${urlsList.map(u=>`<span class="ft">🔗 ${u.url}</span>`).join("")}</div></div>` : "";
  let body = "";
  for (const round of ROUND_DEFS) {
    body += `<div class="rh" style="background:${round.color}22;border-left:4px solid ${round.color};color:${round.color};">${rn[round.id]}</div>`;
    for (const a of agents) { const t = roundData[round.id]?.[a.id]; if (!t) continue; body += `<div class="ab"><div class="an" style="color:${a.accent};">${a.emoji} ${a.name}</div><div class="at">${t.replace(/\n/g,"<br>")}</div></div>`; }
  }
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mesa Redonda</title><style>@page{margin:1.5cm;size:A4}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#1a1a2e;line-height:1.6;padding:40px;max-width:900px;margin:0 auto}.hd{text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:3px solid #e94560}.hd h1{font-size:28px;color:#e94560}.hd .s{color:#666;font-size:13px}.cb{background:#f8f8fc;border:1px solid #e0e0e8;border-radius:10px;padding:20px;margin-bottom:24px}.cb .lb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:600;margin-bottom:6px}.cb .tx{font-size:16px;font-weight:600}.fbox{background:#f0f4f8;border:1px solid #d0d8e0;border-radius:10px;padding:16px;margin-bottom:24px}.fbox .lb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#999;font-weight:600;margin-bottom:8px}.fl{display:flex;flex-wrap:wrap;gap:6px}.ft{background:#fff;border:1px solid #ddd;border-radius:6px;padding:4px 10px;font-size:12px;color:#555}.rh{padding:10px 16px;border-radius:8px;font-size:12px;font-weight:700;letter-spacing:2px;margin:28px 0 14px}.ab{background:#fafafe;border:1px solid #eee;border-radius:8px;padding:16px;margin-bottom:10px;page-break-inside:avoid}.an{font-weight:700;font-size:14px;margin-bottom:6px}.at{font-size:13px;color:#333;white-space:pre-wrap}.sy{background:linear-gradient(135deg,#f8f4ff,#fff5f5);border:2px solid #c792ea;border-radius:12px;padding:24px;margin-top:32px;page-break-before:always}.sy h2{font-size:16px;margin-bottom:12px}.sy .ct{font-size:13.5px;color:#222;white-space:pre-wrap;line-height:1.8}.fo{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #eee;color:#999;font-size:11px}</style></head><body><div class="hd"><h1>Mesa Redonda</h1><div class="s">${agents.length} Agentes · 4 Rodadas · ${ts}</div></div><div class="cb"><div class="lb">Desafio</div><div class="tx">${challenge}</div></div>${fs}${us}${body}<div class="sy"><h2>⚖️ SÍNTESE EXECUTIVA</h2><div class="ct">${synthesis.replace(/\n/g,"<br>")}</div></div><div class="fo">Mesa Redonda · ${ts}</div></body></html>`;
  const blob = new Blob([html], { type: "text/html" }); const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank"); if (win) win.onload = () => setTimeout(() => win.print(), 500);
  else { const a = document.createElement("a"); a.href = url; a.download = `mesa-redonda-${Date.now()}.html`; a.click(); }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// === COMPONENTS ===
function AgentToggle({ agent, selected, onToggle, disabled }) {
  return (<button onClick={() => onToggle(agent.id)} disabled={disabled} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: selected ? `${agent.accent}18` : "rgba(255,255,255,0.02)", border: `1px solid ${selected ? agent.accent+"55" : "rgba(255,255,255,0.06)"}`, color: selected ? "#fff" : "rgba(255,255,255,0.3)", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: disabled ? 0.5 : 1, width: "100%", textAlign: "left" }}>
    <span style={{ fontSize: 16 }}>{agent.emoji}</span>
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{agent.name}</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.role}</div></div>
    <div style={{ width: 16, height: 16, borderRadius: 4, background: selected ? agent.accent : "transparent", border: `2px solid ${selected ? agent.accent : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{selected ? "✓" : ""}</div>
  </button>);
}

function AgentCard({ agent, analysis, isLoading, roundNum, retryStatus }) {
  return (<div style={{ background: agent.color, borderRadius: 12, padding: "18px 20px", borderLeft: `4px solid ${agent.accent}`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -20, right: -10, fontSize: 70, opacity: 0.05 }}>{agent.emoji}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 20 }}>{agent.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{agent.name}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{agent.role}</div></div>
      <span style={{ fontSize: 9, color: agent.accent, background: `${agent.accent}22`, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>R{roundNum}</span>
    </div>
    {isLoading ? (<div style={{ color: retryStatus ? "#ee4540" : "rgba(255,255,255,0.4)", fontSize: 13, padding: "10px 0" }}><span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>{retryStatus ? `⚠ ${retryStatus}` : roundNum===1?"🔍 Pesquisando e analisando...":roundNum===3?"Simulando fracasso...":roundNum===4?"Projetando solução...":roundNum===2?"Debatendo...":"Analisando..."}</span></div>)
    : analysis ? (<div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", marginTop: 6 }}>{analysis}</div>) : null}
  </div>);
}

function ProgressBar({ phase }) {
  return (<div style={{ display: "flex", gap: 4, padding: "14px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
    {ROUND_DEFS.map((r, i) => { const pi = ROUND_DEFS.findIndex(x => x.id === phase); const done = pi > i || phase === "synthesis" || phase === "done"; const active = phase === r.id;
      return (<div key={r.id} style={{ flex: 1 }}><div style={{ height: 3, borderRadius: 2, background: done ? r.color : active ? `${r.color}88` : "rgba(255,255,255,0.08)", transition: "all 0.5s" }} /><div style={{ fontSize: 9, marginTop: 4, textAlign: "center", color: done||active ? r.color : "rgba(255,255,255,0.2)", fontWeight: active ? 700 : 500 }}>R{r.number}</div></div>);
    })}
    <div style={{ flex: 1 }}><div style={{ height: 3, borderRadius: 2, background: phase==="done"?"#fff":phase==="synthesis"?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.08)" }} /><div style={{ fontSize: 9, marginTop: 4, textAlign: "center", color: phase==="synthesis"||phase==="done"?"#fff":"rgba(255,255,255,0.2)" }}>FIM</div></div>
  </div>);
}

// === MAIN APP ===
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("mr_apikey") || "");
  const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem("mr_apikey"));
  const [challenge, setChallenge] = useState("");
  const [selectedAgents, setSelectedAgents] = useState(new Set(ALL_AGENTS.map(a => a.id)));
  const [phase, setPhase] = useState("idle");
  const [roundData, setRoundData] = useState({});
  const [synthesis, setSynthesis] = useState("");
  const [loadingAgents, setLoadingAgents] = useState(new Set());
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);
  const [stats, setStats] = useState({ calls: 0, elapsed: 0 });
  const [files, setFiles] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlFetching, setUrlFetching] = useState(false);
  const [followTarget, setFollowTarget] = useState(null);
  const [followQ, setFollowQ] = useState("");
  const [followHistory, setFollowHistory] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [library, setLibrary] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [playbook, setPlaybook] = useState("");
  const [playbookLoading, setPlaybookLoading] = useState(false);

  const bottomRef = useRef(null);
  const followRef = useRef(null);
  const startTimeRef = useRef(null);
  const fileInputRef = useRef(null);

  const scroll = useCallback(() => { setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80); }, []);
  const scrollFollow = useCallback(() => { setTimeout(() => followRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80); }, []);
  const agents = ALL_AGENTS.filter(a => selectedAgents.has(a.id));

  // Library via localStorage
  useEffect(() => { loadLibrary(); }, []);
  const loadLibrary = () => {
    try { const raw = localStorage.getItem("mr_library"); setLibrary(raw ? JSON.parse(raw) : []); } catch { setLibrary([]); }
  };
  const saveToLibrary = () => {
    const debate = { id: Date.now(), ts: Date.now(), challenge, agentIds: [...selectedAgents], roundData, synthesis, playbook, stats, fileNames: files.map(f=>f.name), urls: urls.map(u=>({url:u.url,status:u.status})) };
    const updated = [debate, ...library].slice(0, 50);
    localStorage.setItem("mr_library", JSON.stringify(updated));
    setLibrary(updated);
    return true;
  };
  const deleteFromLibrary = (id) => { const updated = library.filter(d=>d.id!==id); localStorage.setItem("mr_library", JSON.stringify(updated)); setLibrary(updated); };
  const loadDebate = (d) => { setChallenge(d.challenge); setRoundData(d.roundData); setSynthesis(d.synthesis); setPlaybook(d.playbook||""); setStats(d.stats||{calls:0,elapsed:0}); setSelectedAgents(new Set(d.agentIds)); setPhase("done"); setShowLibrary(false); setFollowHistory([]); setFollowTarget(null); };
  const toggleAgent = (id) => { setSelectedAgents(prev => { const n = new Set(prev); if (n.has(id)) { if (n.size > 2) n.delete(id); } else n.add(id); return n; }); };

  // Files
  const handleFileUpload = async (e) => {
    const processed = [];
    for (const file of Array.from(e.target.files)) {
      const ext = file.name.split(".").pop().toLowerCase();
      const isImg = ["png","jpg","jpeg","gif","webp"].includes(ext); const isPDF = ext==="pdf";
      if (isImg||isPDF) { const b64 = await new Promise(r => { const rd = new FileReader(); rd.onload = () => r(rd.result.split(",")[1]); rd.readAsDataURL(file); }); processed.push({ name: file.name, type: isPDF?"document":"image", mediaType: isPDF?"application/pdf":`image/${ext==="jpg"?"jpeg":ext}`, data: b64, size: file.size }); }
      else if (file.size < 500000) { const txt = await new Promise(r => { const rd = new FileReader(); rd.onload = () => r(rd.result); rd.readAsText(file); }); processed.push({ name: file.name, type: "text", text: txt, size: file.size }); }
    }
    setFiles(prev => [...prev, ...processed]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const buildAttachments = () => files.map(f => { if (f.type==="document") return { type:"document", source:{type:"base64",media_type:f.mediaType,data:f.data} }; if (f.type==="image") return { type:"image", source:{type:"base64",media_type:f.mediaType,data:f.data} }; return { type:"text", text:`[ARQUIVO: ${f.name}]\n${f.text}` }; });

  // URLs
  const addUrl = async () => {
    let raw = urlInput.trim(); if (!raw) return; if (!raw.startsWith("http")) raw = "https://"+raw;
    try { new URL(raw); } catch { return; }
    setUrlInput(""); setUrlFetching(true);
    let content = "", status = "pending";
    try {
      const res = await fetch(raw, { signal: AbortSignal.timeout(10000) });
      if (res.ok) { const text = await res.text(); const doc = new DOMParser().parseFromString(text, "text/html"); doc.querySelectorAll("script,style,nav,footer,header,aside,iframe,noscript").forEach(el=>el.remove()); const cleaned = (doc.body?.innerText||"").replace(/\s+/g," ").trim(); content = cleaned.slice(0,15000); status = content.length>100?"fetched":"partial"; } else status = "error";
    } catch { status = "error"; }
    setUrls(prev => [...prev, { url: raw, content, status }]); setUrlFetching(false);
  };
  const buildUrlContext = () => { if (!urls.length) return ""; return "\n\n--- URLS ---\n\n"+urls.map((u,i) => u.status==="fetched"&&u.content ? `[URL ${i+1}: ${u.url}]\n${u.content}\n` : `[URL ${i+1}: ${u.url}]\n(Não extraído. Analise pelo domínio.)\n`).join("\n---\n\n"); };

  // Follow-up
  const sendFollowUp = async () => {
    if (!followQ.trim()||!followTarget||followLoading) return;
    const agent = ALL_AGENTS.find(a=>a.id===followTarget); if (!agent) return;
    const q = followQ; setFollowQ(""); setFollowHistory(prev=>[...prev,{role:"user",agent:followTarget,text:q}]); setFollowLoading(true); scrollFollow();
    const ctx = ROUND_DEFS.map(r=>`[R${r.number}] ${roundData[r.id]?.[agent.id]||"N/A"}`).join("\n\n");
    const result = await callClaude(apiKey, `${agent.prompt}\n\nVocê participou de mesa redonda sobre: "${challenge}".\nSuas análises:\n${ctx}\n\nSíntese:\n${synthesis}\n\nResponda como ${agent.name}. Máximo 300 palavras. Português brasileiro.`, q, null, 1500);
    setFollowHistory(prev=>[...prev,{role:"agent",agent:followTarget,text:result}]); setFollowLoading(false); scrollFollow();
  };

  // Playbook
  const generatePlaybook = async () => {
    if (playbookLoading||!synthesis) return; setPlaybookLoading(true); scroll();
    const fd = ROUND_DEFS.map(r=>`=== R${r.number}: ${r.title} ===\n\n`+agents.map(a=>`**${a.name}:** ${roundData[r.id]?.[a.id]||"N/A"}`).join("\n\n---\n\n")).join("\n\n\n");
    const result = await callClaude(apiKey, PLAYBOOK_PROMPT, `DESAFIO:\n${challenge}\n\nDEBATE:\n${fd}\n\nSÍNTESE:\n${synthesis}\n\nGere o playbook.`, null, 4096);
    setPlaybook(result); setPlaybookLoading(false); scroll();
  };
  const exportPlaybookPDF = () => {
    const ts = new Date().toLocaleString("pt-BR");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Playbook</title><style>@page{margin:1.5cm}*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;color:#1a1a2e;line-height:1.7;padding:40px;max-width:900px;margin:0 auto}.hd{text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:3px solid #16c79a}.hd h1{font-size:26px;color:#16c79a}.pb{font-size:14px;white-space:pre-wrap;line-height:1.8}</style></head><body><div class="hd"><h1>📋 Playbook de Execução</h1><div style="color:#666;font-size:13px">${ts}</div></div><div style="background:#f8f8fc;border-radius:10px;padding:20px;margin-bottom:24px"><div style="font-size:16px;font-weight:600">${challenge}</div></div><div class="pb">${playbook.replace(/\n/g,"<br>")}</div></body></html>`;
    const blob = new Blob([html],{type:"text/html"}); const url = URL.createObjectURL(blob); const win = window.open(url,"_blank"); if(win) win.onload=()=>setTimeout(()=>win.print(),500);
  };

  // Run debate
  const runDebate = async () => {
    if (!challenge.trim()||agents.length<2) return;
    setRoundData({}); setSynthesis(""); setStats({calls:0,elapsed:0}); setFollowHistory([]); setFollowTarget(null); setPlaybook("");
    startTimeRef.current = Date.now(); let totalCalls = 0; const allRD = {};
    for (const round of ROUND_DEFS) {
      setPhase(round.id); allRD[round.id] = {};
      for (const agent of agents) {
        const lk = `${agent.id}_${round.id}`; setLoadingAgents(prev=>new Set([...prev,lk])); scroll();
        const { system, user } = round.buildPrompt(agent, challenge, allRD, agents);
        const isR1 = round.id==="r1"; const atts = isR1 ? buildAttachments() : [];
        let um = user;
        if (isR1) { if (files.length>0) um+=`\n\n[${files.length} ARQUIVO(S): ${files.map(f=>f.name).join(", ")}]`; if (urls.length>0) um+=buildUrlContext(); }
        const result = await callClaude(apiKey, system, um, s => { setRoundData(prev=>({...prev,[`${round.id}_status`]:{...(prev[`${round.id}_status`]||{}), [agent.id]:s}})); }, isR1?2000:1200, atts, isR1);
        totalCalls++; allRD[round.id][agent.id] = result;
        setRoundData(prev=>({...prev,[round.id]:{...(prev[round.id]||{}), [agent.id]:result}}));
        setStats({calls:totalCalls, elapsed:Math.round((Date.now()-startTimeRef.current)/1000)});
        setLoadingAgents(prev=>{const n=new Set(prev);n.delete(lk);return n;}); scroll();
        await new Promise(r=>setTimeout(r, isR1?2000:1500));
      }
    }
    setPhase("synthesis"); setLoadingSynthesis(true); scroll();
    const fd = ROUND_DEFS.map(r=>`=== R${r.number}: ${r.title} ===\n\n`+agents.map(a=>`**${a.name}:** ${allRD[r.id]?.[a.id]||"N/A"}`).join("\n\n---\n\n")).join("\n\n\n");
    const synth = await callClaude(apiKey, MOD_PROMPT, `DESAFIO:\n${challenge}\n\nDEBATE (4 RODADAS, ${agents.length} AGENTES):\n${fd}\n\nSíntese final.`, null, 4000);
    totalCalls++; setSynthesis(synth); setLoadingSynthesis(false);
    setStats({calls:totalCalls, elapsed:Math.round((Date.now()-startTimeRef.current)/1000)});
    setPhase("done"); scroll();
  };

  const isRunning = phase!=="idle" && phase!=="done";
  const totalExpected = agents.length * ROUND_DEFS.length + 1;

  // === API KEY SCREEN ===
  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#050510", color: "#fff", fontFamily: "'Söhne','Helvetica Neue',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 440, width: "100%", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8, fontWeight: 600 }}>SISTEMA DE DELIBERAÇÃO</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, background: "linear-gradient(135deg,#e94560,#c792ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mesa Redonda</h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 8 }}>11 agentes · web search · 4 rodadas · playbook</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24 }}>
            <label style={{ fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.4)", fontWeight: 600, display: "block", marginBottom: 8 }}>ANTHROPIC API KEY</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && apiKey.startsWith("sk-")) { localStorage.setItem("mr_apikey", apiKey); setAuthenticated(true); }}}
              placeholder="sk-ant-..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", padding: "14px 16px", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
            <button onClick={() => { if (apiKey.startsWith("sk-")) { localStorage.setItem("mr_apikey", apiKey); setAuthenticated(true); }}}
              disabled={!apiKey.startsWith("sk-")}
              style={{ marginTop: 12, width: "100%", padding: "14px 0", background: apiKey.startsWith("sk-") ? "linear-gradient(135deg,#e94560,#c792ea)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: apiKey.startsWith("sk-") ? "pointer" : "not-allowed", letterSpacing: 1, opacity: apiKey.startsWith("sk-") ? 1 : 0.4 }}>
              ENTRAR
            </button>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
              Sua key fica salva localmente no navegador. Nunca é enviada a terceiros — vai direto pra API da Anthropic.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === LIBRARY VIEW ===
  if (showLibrary) {
    return (
      <div style={{ minHeight: "100vh", background: "#050510", color: "#fff", fontFamily: "'Söhne','Helvetica Neue',sans-serif" }}>
        <div style={{ padding: "32px 20px 20px", maxWidth: 720, margin: "0 auto" }}>
          <button onClick={() => setShowLibrary(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Voltar</button>
          <h2 style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#e94560,#c792ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Biblioteca de Debates</h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4, marginBottom: 20 }}>{library.length} debate(s)</p>
          {library.length===0 && <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, textAlign: "center", padding: 40 }}>Nenhum debate salvo.</div>}
          {library.map(d => (<div key={d.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{d.challenge}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>{new Date(d.ts).toLocaleString("pt-BR")} · {d.agentIds?.length} agentes{d.urls?.length>0&&` · ${d.urls.length} URL(s)`}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => loadDebate(d)} style={{ flex: 1, padding: "8px 0", background: "rgba(233,69,96,0.15)", border: "1px solid rgba(233,69,96,0.3)", borderRadius: 8, color: "#e94560", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Abrir</button>
              <button onClick={() => deleteFromLibrary(d.id)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer" }}>Excluir</button>
            </div>
          </div>))}
        </div>
      </div>
    );
  }

  // === MAIN VIEW ===
  return (
    <div style={{ minHeight: "100vh", background: "#050510", color: "#fff", fontFamily: "'Söhne','Helvetica Neue',sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}textarea:focus,input:focus{outline:none;border-color:#e94560 !important}`}</style>

      <div style={{ padding: "28px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6, fontWeight: 600 }}>SISTEMA DE DELIBERAÇÃO v5</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(135deg,#e94560,#c792ea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mesa Redonda</h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>{agents.length} agentes · web search · 4 rodadas · playbook</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <button onClick={() => setShowLibrary(true)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: 11, padding: "6px 16px", cursor: "pointer" }}>📚 Biblioteca ({library.length})</button>
          <button onClick={() => { localStorage.removeItem("mr_apikey"); setAuthenticated(false); setApiKey(""); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.3)", fontSize: 11, padding: "6px 12px", cursor: "pointer" }}>Sair</button>
        </div>
      </div>

      {phase!=="idle" && <ProgressBar phase={phase} />}
      {stats.calls>0 && <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "8px 20px", fontSize: 11, color: "rgba(255,255,255,0.25)" }}><span>{stats.calls}/{totalExpected}</span><span>{stats.elapsed}s</span></div>}

      <div style={{ padding: "12px 20px", maxWidth: 720, margin: "0 auto" }}>
        <label style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 600, display: "block", marginBottom: 6 }}>DESAFIO PARA A MESA</label>
        <textarea value={challenge} onChange={e=>setChallenge(e.target.value)} disabled={isRunning} rows={3} placeholder="Descreva o projeto, decisão ou ideia que quer avaliar..."
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", padding: "12px 14px", fontSize: 14, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />

        {/* Files */}
        <div style={{ marginTop: 8 }}>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.csv,.md,.json" onChange={handleFileUpload} disabled={isRunning} style={{ display: "none" }} />
          <button onClick={() => fileInputRef.current?.click()} disabled={isRunning} style={{ width: "100%", padding: "9px 0", background: "transparent", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.35)", fontSize: 11, cursor: isRunning?"not-allowed":"pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><span style={{ fontSize: 14 }}>+</span> Anexar arquivos</button>
          {files.length>0 && <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>{files.map((f,i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" }}><span style={{ fontSize: 12 }}>{f.type==="document"?"📄":f.type==="image"?"🖼️":"📝"}</span><div style={{ flex: 1, fontSize: 11, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>{!isRunning&&<button onClick={()=>setFiles(prev=>prev.filter((_,j)=>j!==i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>}</div>))}</div>}
        </div>

        {/* URLs */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUrl()} placeholder="Colar URL para análise..." disabled={isRunning||urlFetching}
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", padding: "9px 12px", fontSize: 11, fontFamily: "inherit" }} />
            <button onClick={addUrl} disabled={isRunning||urlFetching||!urlInput.trim()} style={{ padding: "9px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: 11, cursor: isRunning?"not-allowed":"pointer", whiteSpace: "nowrap" }}>{urlFetching?"...":"🔗 Adicionar"}</button>
          </div>
          {urls.length>0 && <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>{urls.map((u,i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 10px", border: "1px solid rgba(255,255,255,0.06)" }}><span style={{ fontSize: 12 }}>🔗</span><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.url}</div><div style={{ fontSize: 9, color: u.status==="fetched"?"#16c79a":"#ee4540" }}>{u.status==="fetched"?"✓ Extraído":"⚠ Agentes analisarão pelo domínio"}</div></div>{!isRunning&&<button onClick={()=>setUrls(prev=>prev.filter((_,j)=>j!==i))} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>}</div>))}</div>}
        </div>

        {/* Agent Panel */}
        <button onClick={()=>setShowPanel(!showPanel)} disabled={isRunning} style={{ marginTop: 8, width: "100%", padding: "8px 0", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: isRunning?"not-allowed":"pointer" }}>⚙ {showPanel?"Fechar":"Selecionar"} agentes ({selectedAgents.size}/{ALL_AGENTS.length})</button>
        {showPanel && (<div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, animation: "slideIn 0.3s ease" }}>
          {ALL_AGENTS.map(a => <AgentToggle key={a.id} agent={a} selected={selectedAgents.has(a.id)} onToggle={toggleAgent} disabled={isRunning} />)}
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 6 }}>
            <button onClick={()=>setSelectedAgents(new Set(ALL_AGENTS.map(a=>a.id)))} style={{ flex: 1, padding: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer" }}>Todos</button>
            <button onClick={()=>setSelectedAgents(new Set(["estrategista","diabo","munger"]))} style={{ flex: 1, padding: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(255,255,255,0.4)", fontSize: 10, cursor: "pointer" }}>Mesa Rápida (3)</button>
          </div>
        </div>)}

        <button onClick={runDebate} disabled={isRunning||agents.length<2||!challenge.trim()} style={{ marginTop: 10, width: "100%", padding: "13px 0", background: isRunning?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#e94560,#c792ea)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: isRunning?"not-allowed":"pointer", letterSpacing: 1, textTransform: "uppercase", opacity: isRunning?0.5:1, transition: "all 0.2s" }}>{isRunning?"DEBATE EM ANDAMENTO...":"INICIAR DEBATE"}</button>
      </div>

      {/* Rounds */}
      <div style={{ padding: "0 20px 40px", maxWidth: 720, margin: "0 auto" }}>
        {ROUND_DEFS.map(round => {
          const data = roundData[round.id]||{}; const has = Object.keys(data).length>0||agents.some(a=>loadingAgents.has(`${a.id}_${round.id}`));
          if (!has) return null;
          return (<div key={round.id} style={{ marginTop: 24, animation: "slideIn 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${round.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: round.color }}>{round.number}</div>
              <div><div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: round.color, fontWeight: 700 }}>{round.title}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{round.subtitle}</div></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{agents.map(agent => { const lk=`${agent.id}_${round.id}`; if(!data[agent.id]&&!loadingAgents.has(lk)) return null; const st=roundData[`${round.id}_status`]||{}; return (<div key={lk} style={{ animation: "slideIn 0.3s ease" }}><AgentCard agent={agent} analysis={data[agent.id]} isLoading={loadingAgents.has(lk)} roundNum={round.number} retryStatus={st[agent.id]} /></div>); })}</div>
          </div>);
        })}

        {/* Synthesis */}
        {(synthesis||loadingSynthesis) && (<div style={{ marginTop: 28, animation: "slideIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>⚖</div><div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#fff", fontWeight: 700 }}>SÍNTESE EXECUTIVA</div></div>
          <div style={{ background: "linear-gradient(135deg,#0a0a1a,#1a0a2e)", borderRadius: 14, padding: 24, border: "1px solid rgba(233,69,96,0.2)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#e94560,#c792ea,#d4a853,#16c79a,#4fc3f7)" }} />
            {loadingSynthesis ? <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}><span style={{ animation: "pulse 1.5s infinite", display: "inline-block" }}>Consolidando debate...</span></div>
            : <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{synthesis}</div>}
          </div>
        </div>)}

        {/* Follow-up */}
        {phase==="done" && (<div style={{ marginTop: 28, animation: "slideIn 0.4s ease" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 10 }}>FOLLOW-UP</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{agents.map(a => (<button key={a.id} onClick={()=>{setFollowTarget(a.id);setFollowHistory([]);}} style={{ padding: "6px 12px", borderRadius: 20, background: followTarget===a.id?`${a.accent}22`:"rgba(255,255,255,0.03)", border: `1px solid ${followTarget===a.id?a.accent+"66":"rgba(255,255,255,0.08)"}`, color: followTarget===a.id?a.accent:"rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer", fontWeight: followTarget===a.id?700:400 }}>{a.emoji} {a.name}</button>))}</div>
          {followTarget && (<div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
            {followHistory.map((msg,i) => { const ag=ALL_AGENTS.find(a=>a.id===msg.agent); return (<div key={i} style={{ marginBottom: 12, animation: "slideIn 0.3s ease" }}>{msg.role==="user" ? (<div style={{ background: "rgba(233,69,96,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.8)", borderLeft: "3px solid #e94560" }}><div style={{ fontSize: 10, color: "#e94560", fontWeight: 600, marginBottom: 4 }}>VOCÊ</div>{msg.text}</div>) : (<div style={{ background: ag?.color||"#1a1a2e", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", borderLeft: `3px solid ${ag?.accent}`, lineHeight: 1.7, whiteSpace: "pre-wrap" }}><div style={{ fontSize: 10, color: ag?.accent, fontWeight: 600, marginBottom: 4 }}>{ag?.emoji} {ag?.name}</div>{msg.text}</div>)}</div>); })}
            {followLoading && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, padding: 10 }}><span style={{ animation: "pulse 1.5s infinite", display: "inline-block" }}>Pensando...</span></div>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input value={followQ} onChange={e=>setFollowQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendFollowUp()} placeholder={`Pergunte ao ${ALL_AGENTS.find(a=>a.id===followTarget)?.name}...`} disabled={followLoading} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", padding: "10px 12px", fontSize: 13, fontFamily: "inherit" }} />
              <button onClick={sendFollowUp} disabled={followLoading||!followQ.trim()} style={{ padding: "10px 16px", background: followLoading?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#e94560,#c792ea)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: followLoading?"not-allowed":"pointer" }}>→</button>
            </div>
            <div ref={followRef} />
          </div>)}
        </div>)}

        {/* Playbook */}
        {phase==="done"&&!playbook&&!playbookLoading && (<div style={{ marginTop: 28 }}><button onClick={generatePlaybook} style={{ width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#d4a853,#f5a623)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><span style={{ fontSize: 18 }}>📋</span> GERAR PLAYBOOK DE EXECUÇÃO</button><div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>Plano de ação detalhado com fases, KPIs e orçamento</div></div>)}
        {playbookLoading && (<div style={{ marginTop: 28 }}><div style={{ background: "linear-gradient(135deg,#1c1410,#1a1a2e)", borderRadius: 14, padding: 24, border: "1px solid rgba(212,168,83,0.3)", position: "relative" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#d4a853,#f5a623,#ffb74d)" }} /><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}><span style={{ animation: "pulse 1.5s infinite", display: "inline-block" }}>Gerando playbook...</span></div></div></div>)}
        {playbook && (<div style={{ marginTop: 28, animation: "slideIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#d4a853", fontWeight: 700 }}>📋 PLAYBOOK DE EXECUÇÃO</div></div>
          <div style={{ background: "linear-gradient(135deg,#1c1410,#1a1a2e)", borderRadius: 14, padding: 24, border: "1px solid rgba(212,168,83,0.2)", position: "relative" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#d4a853,#f5a623,#ffb74d)" }} /><div style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{playbook}</div></div>
          <button onClick={exportPlaybookPDF} style={{ marginTop: 10, width: "100%", padding: "12px 0", background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.25)", borderRadius: 10, color: "#d4a853", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📄 EXPORTAR PLAYBOOK PDF</button>
        </div>)}

        {/* Bottom */}
        {phase==="done" && (<div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={()=>{saveToLibrary();alert("Salvo!");}} style={{ flex: 1, padding: "13px 0", background: "linear-gradient(135deg,#16c79a,#4fc3f7)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>💾 SALVAR</button>
            <button onClick={()=>generatePDF(challenge,roundData,synthesis,files,agents,urls)} style={{ flex: 1, padding: "13px 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📄 PDF DEBATE</button>
          </div>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 10 }}>{stats.elapsed}s · {stats.calls} chamadas · {agents.length} agentes</div>
        </div>)}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
