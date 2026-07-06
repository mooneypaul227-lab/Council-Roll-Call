/**
 * Arbitrage Council System v2.0 — Backend API Server
 * Node.js/Express Backend with Real-Time WebSocket Support
 * Multi-Agent Consensus & Advanced Arbitrage Engine
 */

const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const globalState = {
  totalRequests: 0,
  approved: 0,
  rejected: 0,
  quarantine: 0,
  killSwitch: 0,
  signals: [],
  messages: [],
  agents: [],
  sentiment: { bullish: 0, bearish: 0, neutral: 0, volatile: 0 },
  arbitrageMetrics: {
    totalSignalsGenerated: 0,
    profitableSignals: 0,
    winRate: 0,
    totalNotional: 0,
    riskExposure: 0
  }
};

const AGENTS = [
  { id: 'gk-pre', name: 'Gatekeeper (Pre)', role: 'gatekeeper', trust: 0.98, spec: 'threat_detection' },
  { id: 'gk-mid', name: 'Gatekeeper (Mid)', role: 'gatekeeper', trust: 0.97, spec: 'rate_limiting' },
  { id: 'gk-post', name: 'Gatekeeper (Post)', role: 'gatekeeper', trust: 0.96, spec: 'post_processing' },
  { id: 'osi-7', name: 'Application Layer', role: 'osi', trust: 0.89, spec: 'protocol_analysis' },
  { id: 'osi-6', name: 'Presentation Layer', role: 'osi', trust: 0.87, spec: 'data_formatting' },
  { id: 'osi-5', name: 'Session Layer', role: 'osi', trust: 0.88, spec: 'session_mgmt' },
  { id: 'osi-4', name: 'Transport Layer', role: 'osi', trust: 0.86, spec: 'flow_control' },
  { id: 'osi-3', name: 'Network Layer', role: 'osi', trust: 0.85, spec: 'routing' },
  { id: 'osi-2', name: 'Data Link Layer', role: 'osi', trust: 0.84, spec: 'framing' },
  { id: 'osi-1', name: 'Physical Layer', role: 'osi', trust: 0.83, spec: 'signals' },
  { id: 'for-skim', name: 'Skimming Detection', role: 'forensic', trust: 0.92, spec: 'anomaly_detection' },
  { id: 'for-vendor', name: 'Vendor Fraud', role: 'forensic', trust: 0.91, spec: 'pattern_matching' },
  { id: 'for-payroll', name: 'Payroll Auditor', role: 'forensic', trust: 0.90, spec: 'financial_audit' },
  { id: 'for-finance', name: 'Financial Analyst', role: 'forensic', trust: 0.89, spec: 'risk_assessment' },
  { id: 'for-digital', name: 'Digital Evidence', role: 'forensic', trust: 0.93, spec: 'forensics' },
  { id: 'ml-class', name: 'ML Classifier', role: 'mlrl', trust: 0.87, spec: 'classification' },
  { id: 'rl-policy', name: 'RL Policy Engine', role: 'mlrl', trust: 0.86, spec: 'policy_optimization' }
];

globalState.agents = AGENTS;

const MARKET_DATA = {
  entities: ['NVIDIA', 'AMD', 'Intel', 'TSMC', 'Alphabet', 'Microsoft', 'Amazon', 'Anthropic', 'OpenAI', 'Google', 'Meta', 'Tesla', 'xAI', 'SpaceX'],
  sectors: ['AI_INFRASTRUCTURE', 'CLOUD_COMPUTING', 'SEMICONDUCTORS', 'ENTERPRISE_AI', 'ROBOTICS'],
  topics: [
    'AI infrastructure', 'GPU supply', 'data centers', 'energy consumption',
    'quantum computing', 'neural networks', 'LLM training', 'fine-tuning',
    'RLHF', 'AGI timelines', 'AI safety', 'open source vs closed',
    'regulation', 'IPO', 'valuation', 'market share', 'competition',
    'chip design', 'memory bandwidth', 'distributed training', 'inference cost'
  ]
};

class ArbitrageEngine {
  constructor() {
    this.signals = [];
    this.riskModel = new RiskModel();
  }

  generateSignal(asset, type, confidence, reasoning, notional = 10000) {
    const signal = {
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      asset,
      signalType: type,
      confidence,
      reasoning,
      notional,
      riskScore: this.riskModel.calculateRisk(asset, type, confidence),
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    };
    this.signals.push(signal);
    globalState.arbitrageMetrics.totalSignalsGenerated++;
    return signal;
  }

  analyzeMessageBatch(messages) {
    const signals = [];
    if (messages.length === 0) return signals;

    const entityMap = {};
    for (const msg of messages) {
      for (const entity of msg.entities) {
        if (!entityMap[entity]) {
          entityMap[entity] = { bullish: 0, bearish: 0, neutral: 0, volatile: 0, confidence: [] };
        }
        entityMap[entity][msg.sentiment]++;
        entityMap[entity].confidence.push(msg.confidence);
      }
    }

    for (const [entity, counts] of Object.entries(entityMap)) {
      const total = counts.bullish + counts.bearish + counts.neutral + counts.volatile;
      if (total < 2) continue;

      const avgConfidence = counts.confidence.reduce((a, b) => a + b, 0) / counts.confidence.length;
      const bullish = counts.bullish / total;
      const bearish = counts.bearish / total;
      const volatile = counts.volatile / total;

      if (bullish > 0.55 && avgConfidence > 0.65) {
        signals.push(this.generateSignal(
          entity, 'BUY', bullish,
          `Consensus bullish: ${(bullish * 100).toFixed(0)}% from ${total} agents`,
          10000 + Math.random() * 90000
        ));
      } else if (bearish > 0.55 && avgConfidence > 0.65) {
        signals.push(this.generateSignal(
          entity, 'SELL', bearish,
          `Consensus bearish: ${(bearish * 100).toFixed(0)}% from ${total} agents`,
          10000 + Math.random() * 90000
        ));
      } else if (volatile > 0.4) {
        signals.push(this.generateSignal(
          entity, 'HOLD', volatile,
          `High volatility: ${(volatile * 100).toFixed(0)}%`,
          5000
        ));
      }
    }

    const sectorSentiment = this.aggregateSectorSentiment(messages);
    for (const [sector, sentiment] of Object.entries(sectorSentiment)) {
      if (sentiment.bullish > 0.6) {
        signals.push(this.generateSignal(
          sector, 'BUY', sentiment.bullish,
          `Sector bullish: ${sector}`,
          50000
        ));
      } else if (sentiment.bearish > 0.6) {
        signals.push(this.generateSignal(
          sector, 'SELL', sentiment.bearish,
          `Sector bearish: ${sector}`,
          50000
        ));
      }
    }

    return signals;
  }

  aggregateSectorSentiment(messages) {
    const sectorMap = {};
    MARKET_DATA.sectors.forEach(sector => {
      sectorMap[sector] = { bullish: 0, bearish: 0, neutral: 0, volatile: 0, count: 0 };
    });

    for (const msg of messages) {
      const sector = this.classifyMessageToSector(msg);
      if (sector) {
        sectorMap[sector][msg.sentiment]++;
        sectorMap[sector].count++;
      }
    }

    const result = {};
    for (const [sector, counts] of Object.entries(sectorMap)) {
      if (counts.count > 0) {
        result[sector] = {
          bullish: counts.bullish / counts.count,
          bearish: counts.bearish / counts.count,
          neutral: counts.neutral / counts.count,
          volatile: counts.volatile / counts.count
        };
      }
    }
    return result;
  }

  classifyMessageToSector(msg) {
    const content = msg.content.toLowerCase();
    if (content.includes('chip') || content.includes('gpu')) return 'SEMICONDUCTORS';
    if (content.includes('cloud') || content.includes('infrastructure')) return 'CLOUD_COMPUTING';
    if (content.includes('llm') || content.includes('training')) return 'AI_INFRASTRUCTURE';
    if (content.includes('enterprise') || content.includes('business')) return 'ENTERPRISE_AI';
    if (content.includes('robot') || content.includes('autonomous')) return 'ROBOTICS';
    return 'AI_INFRASTRUCTURE';
  }

  updateMetrics() {
    const executed = this.signals.filter(s => s.status === 'EXECUTED');
    const profitable = executed.filter(s => Math.random() > 0.3);
    globalState.arbitrageMetrics.profitableSignals = profitable.length;
    globalState.arbitrageMetrics.winRate = executed.length > 0 ? (profitable.length / executed.length) : 0;
    globalState.arbitrageMetrics.totalNotional = this.signals.reduce((sum, s) => sum + s.notional, 0);
    globalState.arbitrageMetrics.riskExposure = this.signals.reduce((sum, s) => sum + s.riskScore, 0) / Math.max(this.signals.length, 1);
  }
}

class RiskModel {
  calculateRisk(asset, signalType, confidence) {
    const baseRisk = signalType === 'HOLD' ? 30 : 50;
    const confidenceRisk = (1 - confidence) * 50;
    const volatilityRisk = Math.random() * 30;
    return Math.min(100, baseRisk + confidenceRisk + volatilityRisk);
  }
}

const arbitrageEngine = new ArbitrageEngine();

function generateMoltbookMessage() {
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const topic = MARKET_DATA.topics[Math.floor(Math.random() * MARKET_DATA.topics.length)];
  const entity = MARKET_DATA.entities[Math.floor(Math.random() * MARKET_DATA.entities.length)];
  const sentiment = ['bullish', 'bearish', 'neutral', 'volatile'][Math.floor(Math.random() * 4)];
  const confidence = 0.5 + Math.random() * 0.45;

  const templates = [
    `Just analyzed ${entity}'s latest announcement. ${sentiment.toUpperCase()} outlook.`,
    `${topic} analysis completed. Results suggest ${sentiment} trend.`,
    `Market sentiment on ${entity} is ${sentiment}.`,
    `Critical update: ${topic} is ${sentiment}. Volatility expected.`,
    `Agent consensus on ${entity}: ${sentiment}.`
  ];

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    agentId: agent.id,
    agentName: agent.name,
    content: templates[Math.floor(Math.random() * templates.length)],
    sentiment: sentiment,
    confidence: confidence,
    topics: [topic],
    entities: [entity],
    timestamp: new Date().toISOString()
  };
}

function processRequest(prompt, clientId) {
  const result = {
    requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    prompt,
    clientId,
    timestamp: new Date().toISOString()
  };

  globalState.totalRequests++;
  const principal = { mfa_verified: true, device_trust_score: 0.94 };
  let threatLevel = 'none';
  const promptLower = prompt.toLowerCase();

  if (!principal.mfa_verified) threatLevel = 'high';
  if (promptLower.includes('inject') || promptLower.includes('exploit')) threatLevel = 'critical';
  if (promptLower.includes('bypass') || promptLower.includes('override')) {
    if (threatLevel === 'none') threatLevel = 'high';
  }

  let status, approvedCount;
  const total = AGENTS.length;
  const votes = AGENTS.map(agent => ({
    agentId: agent.id,
    agentName: agent.name,
    vote: Math.random() > (threatLevel === 'critical' ? 0.8 : threatLevel === 'high' ? 0.6 : 0.2),
    confidence: 0.5 + Math.random() * 0.5
  }));

  approvedCount = votes.filter(v => v.vote).length;

  if (threatLevel === 'critical') {
    status = 'KILL_SWITCH';
    globalState.killSwitch++;
  } else if (approvedCount / total < 0.5) {
    status = 'QUARANTINE';
    globalState.quarantine++;
  } else {
    status = 'APPROVED';
    globalState.approved++;
  }

  result.status = status;
  result.threatLevel = threatLevel;
  result.votes = votes;
  result.approvalCount = approvedCount;
  result.totalAgents = total;
  result.approvalPercentage = (approvedCount / total * 100).toFixed(2);
  result.auditHash = Math.random().toString(36).slice(2, 8);

  return result;
}

app.post('/api/request', (req, res) => {
  const { prompt, clientId } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  const result = processRequest(prompt, clientId || 'anonymous');
  const newMessages = Array(3 + Math.floor(Math.random() * 5)).fill(null).map(() => generateMoltbookMessage());
  globalState.messages = [...newMessages, ...globalState.messages].slice(0, 50);
  const signals = arbitrageEngine.analyzeMessageBatch(globalState.messages);
  globalState.signals = [...signals, ...globalState.signals].slice(0, 100);
  arbitrageEngine.updateMetrics();

  res.json({ success: true, request: result, signals, metrics: globalState.arbitrageMetrics, messageCount: globalState.messages.length, signalCount: globalState.signals.length });
  broadcastUpdate({ type: 'REQUEST_PROCESSED', request: result, signals, timestamp: new Date().toISOString() });
});

app.get('/api/state', (req, res) => {
  arbitrageEngine.updateMetrics();
  res.json({ state: globalState, agents: AGENTS, signals: globalState.signals.slice(0, 20), messages: globalState.messages.slice(0, 10) });
});

app.get('/api/signals', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const status = req.query.status;
  let signals = globalState.signals;
  if (status) signals = signals.filter(s => s.status === status);
  res.json({ count: signals.length, signals: signals.slice(0, limit), metrics: globalState.arbitrageMetrics });
});

app.get('/api/messages', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json({ count: globalState.messages.length, messages: globalState.messages.slice(0, limit) });
});

app.get('/api/agents', (req, res) => {
  res.json({ total: AGENTS.length, agents: AGENTS });
});

app.get('/api/metrics', (req, res) => {
  arbitrageEngine.updateMetrics();
  res.json({ arbitrage: globalState.arbitrageMetrics, overall: { totalRequests: globalState.totalRequests, approved: globalState.approved, rejected: globalState.rejected, quarantine: globalState.quarantine, killSwitch: globalState.killSwitch } });
});

app.post('/api/signals/:signalId/execute', (req, res) => {
  const signal = globalState.signals.find(s => s.id === req.params.signalId);
  if (!signal) return res.status(404).json({ error: 'Signal not found' });
  signal.status = 'EXECUTED';
  arbitrageEngine.updateMetrics();
  res.json({ success: true, signal });
  broadcastUpdate({ type: 'SIGNAL_EXECUTED', signal, timestamp: new Date().toISOString() });
});

app.post('/api/signals/:signalId/cancel', (req, res) => {
  const signal = globalState.signals.find(s => s.id === req.params.signalId);
  if (!signal) return res.status(404).json({ error: 'Signal not found' });
  signal.status = 'CANCELLED';
  res.json({ success: true, signal });
  broadcastUpdate({ type: 'SIGNAL_CANCELLED', signal, timestamp: new Date().toISOString() });
});

const clients = new Set();
wss.on('connection', (ws) => {
  console.log('✅ Client connected');
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'INIT', state: globalState }));
  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients.delete(ws);
  });
});

function broadcastUpdate(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

setInterval(() => {
  const batch = Array(1 + Math.floor(Math.random() * 3)).fill(null).map(() => generateMoltbookMessage());
  globalState.messages = [...batch, ...globalState.messages].slice(0, 50);
  if (globalState.messages.length > 5) {
    const signals = arbitrageEngine.analyzeMessageBatch(globalState.messages);
    globalState.signals = [...signals, ...globalState.signals].slice(0, 100);
    arbitrageEngine.updateMetrics();
    if (signals.length > 0) {
      broadcastUpdate({ type: 'NEW_SIGNALS', signals, timestamp: new Date().toISOString() });
    }
  }
  broadcastUpdate({ type: 'STATE_UPDATE', state: globalState });
}, 3000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 Arbitrage Council System v2.0 Backend`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`✅ 17 Agents Active · ${AGENTS.length} Specialized Roles`);
  console.log(`${'='.repeat(70)}\n`);
});

module.exports = app;