# ARBITRAGE COUNCIL SYSTEM v2.0
## COMPLETE USER MANUAL & INSTRUCTION GUIDE

**Version**: 2.0  
**Last Updated**: 2026-07-06  
**Status**: Production Ready

---

## TABLE OF CONTENTS

1. [Quick Start Guide](#quick-start-guide)
2. [Installation Instructions](#installation-instructions)
3. [System Architecture](#system-architecture)
4. [User Interface Guide](#user-interface-guide)
5. [API Reference](#api-reference)
6. [Configuration Guide](#configuration-guide)
7. [Troubleshooting](#troubleshooting)
8. [Support & Resources](#support--resources)

---

## QUICK START GUIDE

### For Beginners (5 Minutes)

#### Step 1: Install Node.js
Download from https://nodejs.org (v14 or higher)

#### Step 2: Clone Repository
```bash
git clone https://github.com/mooneypaul227-lab/Council-Roll-Call.git
cd Council-Roll-Call
```

#### Step 3: Install Dependencies
```bash
npm install
```

#### Step 4: Start Server
```bash
npm start
```

#### Step 5: Open Browser
Navigate to: **http://localhost:3000**

**You're Live!** 🎉

---

## INSTALLATION INSTRUCTIONS

### System Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows, macOS, Linux |
| **Node.js** | v14.0 or higher |
| **RAM** | 2GB minimum (4GB recommended) |
| **Disk** | 500MB free space |
| **Internet** | Required for real-time updates |

### Detailed Installation

#### macOS / Linux
```bash
# 1. Clone repository
git clone https://github.com/mooneypaul227-lab/Council-Roll-Call.git
cd Council-Roll-Call

# 2. Check Node version
node --version  # Should be v14+

# 3. Install dependencies
npm install

# 4. Start server
npm start

# 5. Verify (should see):
# ✅ Arbitrage Council System v2.0 Backend
# 📡 Server running on http://localhost:3000
```

#### Windows (PowerShell)
```powershell
# 1. Clone repository
git clone https://github.com/mooneypaul227-lab/Council-Roll-Call.git
cd Council-Roll-Call

# 2. Install dependencies
npm install

# 3. Start server
npm start
```

#### Docker (Optional)
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t acs-v2 .
docker run -p 3000:3000 acs-v2
```

---

## SYSTEM ARCHITECTURE

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│              Frontend (Browser)                          │
│  ├─ HTML5/CSS3 UI                                       │
│  ├─ WebSocket Client                                    │
│  └─ REST API Client                                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │ HTTP/WebSocket          │
        ▼                         ▼
┌─────────────────┐      ┌──────────────────┐
│  REST API       │      │  WebSocket       │
│  (8 Endpoints)  │      │  Server          │
└────────┬────────┘      └─────────┬────────┘
         │                         │
         └────────────┬────────────┘
                      │
        ┌─────────────▼────────────┐
        │    Express.js Server     │
        ├─ Request Handler         │
        ├─ State Management        │
        └─ Route Dispatcher        │
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌──────────────────┐      ┌────────────────────┐
│ Arbitrage Engine │      │  Council Voting    │
├─ Signal Gen      │      ├─ 17 Agents        │
├─ Risk Model      │      ├─ Consensus Vote   │
└─ Analysis        │      └─ Threat Assessment│
        │                           │
        │        ┌──────────────────┘
        └────────┤
                 ▼
        ┌─────────────────────┐
        │  Global State       │
        ├─ Signals (100)      │
        ├─ Messages (50)      │
        ├─ Metrics           │
        └─ Agent Status      │
```

### Data Flow

```
Market Data
    ↓
Message Generator (1–3 per 3 sec)
    ↓
Entity Aggregation (Sentiment analysis)
    ↓
Consensus Thresholds (BUY/SELL/HOLD)
    ↓
Risk Scoring (0–100)
    ↓
Signal Emission
    ↓
WebSocket Broadcast (<100ms)
    ↓
Frontend Update
    ↓
User Action (Execute/Cancel)
    ↓
API Call → Signal Status Update
```

---

## USER INTERFACE GUIDE

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ Arbitrage Council v2.0  [🤖 17 Agents] [📊 Live] [● ACTIVE]│
├─────────────────────────────────────────────────────────────┤
│ │ Requests: 0  │ Signals: 0  │ Notional: $0M │ Win: 0% │ etc. │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐    ┌──────────────────────────┐│
│  │ 📝 Console Input         │    │ 📊 Output Console        ││
│  │                          │    │                          ││
│  │ [Textarea]               │    │ > System initialized     ││
│  │ Analyze semiconductor... │    │ > WebSocket connected    ││
│  │                          │    │ > Ready for analysis     ││
│  │ [Process] [Refresh]      │    │                          ││
│  │ [Clear]                  │    │                          ││
│  └──────────────────────────┘    └──────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ 📈 Active Signals                                             │
│ [All] [Buy] [Sell] [Executed]                                │
│ • BUY  NVIDIA (85%)     $50K    Risk: 42/100  [Execute]     │
│ • SELL OpenAI (72%)     $30K    Risk: 55/100  [Cancel]      │
│ • HOLD TSMC (68%)       $20K    Risk: 38/100                │
├─────────────────────────────────────────────────────────────┤
│ 📊 Arbitrage Metrics                                         │
│ │ Total: 0 │ Profitable: 0 │ Win Rate: 0% │ Notional: $0M │ │
├─────────────────────────────────────────────────────────────┤
│ 🤖 Agent Council                                             │
│ │ Gatekeeper (Pre) 98% │ OSI-7 89% │ Forensic 92% │ ML 87% │ │
└─────────────────────────────────────────────────────────────┘
```

### Main Sections

#### 1. **Header**
- System status (LIVE indicator)
- Agent count (17 total)
- Connection status
- Quick metrics

#### 2. **Stats Grid**
- Total Requests
- Active Signals
- Total Notional
- Win Rate
- Approved Requests
- Agent Count

#### 3. **Console Input**
```
Textarea Input:
- Enter analysis prompt
- Example: "Analyze AI chip market"

Buttons:
🚀 Process   → Submit analysis
🔄 Refresh   → Reload all data
📊 Export    → Download metrics
🗑️ Clear     → Clear console log
```

#### 4. **Output Console**
- Real-time logs
- Color-coded messages:
  - 🟢 Green: Success
  - 🔴 Red: Error
  - 🟡 Amber: Warning
  - 🔵 Blue: Info
  - ⚫ Gray: Muted

#### 5. **Active Signals Tab**
Tabs: All | Buy | Sell | Executed

Per signal shows:
- Signal type (BUY/SELL/HOLD)
- Asset name
- Confidence percentage
- Notional value
- Risk score
- Action buttons (Execute/Cancel)

#### 6. **Metrics Dashboard**
- Total Signals Generated
- Profitable Signals
- Win Rate (%)
- Total Notional ($)
- Portfolio Risk (0–100)
- Active Positions (count)

#### 7. **Agent Council**
Display of all 17 agents:
- Name
- Role (Gatekeeper/OSI/Forensic/ML)
- Trust score (%)

---

## API REFERENCE

### Authentication
Currently: No authentication (local deployment)  
Production: Add JWT tokens

### Endpoints

#### 1. Process Market Analysis
```
POST /api/request
Content-Type: application/json

Request Body:
{
  "prompt": "Analyze GPU market sentiment",
  "clientId": "trader-001"  // Optional
}

Response (200):
{
  "success": true,
  "request": {
    "requestId": "req_1234567890",
    "status": "APPROVED",  // APPROVED | QUARANTINE | KILL_SWITCH
    "threatLevel": "none",  // none | medium | high | critical
    "approvalCount": 12,
    "totalAgents": 17,
    "approvalPercentage": "70.59",
    "auditHash": "abc123"
  },
  "signals": [
    {
      "id": "sig_1234567890",
      "asset": "NVIDIA",
      "signalType": "BUY",
      "confidence": 0.85,
      "notional": 50000,
      "riskScore": 42,
      "status": "PENDING"
    }
  ],
  "metrics": {
    "totalSignalsGenerated": 145,
    "profitableSignals": 102,
    "winRate": 0.70,
    "totalNotional": 2450000,
    "riskExposure": 45.2
  }
}
```

#### 2. Get Global State
```
GET /api/state

Response (200):
{
  "state": {
    "totalRequests": 42,
    "approved": 35,
    "signals": [/* ... */],
    "messages": [/* ... */],
    "arbitrageMetrics": {/* ... */}
  },
  "agents": [
    {
      "id": "gk-pre",
      "name": "Gatekeeper (Pre)",
      "role": "gatekeeper",
      "trust": 0.98
    },
    // ... 16 more agents
  ]
}
```

#### 3. Fetch Signals
```
GET /api/signals?limit=20&status=PENDING

Query Parameters:
- limit: Number of signals (default: 20, max: 100)
- status: Filter by status (PENDING | EXECUTED | CANCELLED)

Response (200):
{
  "count": 5,
  "signals": [/* signal objects */],
  "metrics": {/* arbitrage metrics */}
}
```

#### 4. Execute Signal
```
POST /api/signals/{signalId}/execute

Request: Empty body

Response (200):
{
  "success": true,
  "signal": {
    "id": "sig_123",
    "status": "EXECUTED",
    "timestamp": "2026-07-06T10:30:00Z"
  }
}

Error Responses:
404: Signal not found
```

#### 5. Cancel Signal
```
POST /api/signals/{signalId}/cancel

Response (200):
{
  "success": true,
  "signal": {
    "id": "sig_123",
    "status": "CANCELLED"
  }
}
```

#### 6. Get Messages
```
GET /api/messages?limit=50

Response (200):
{
  "count": 50,
  "messages": [
    {
      "id": "msg_123",
      "agentId": "gk-pre",
      "content": "Market sentiment is bullish",
      "sentiment": "bullish",
      "confidence": 0.82,
      "entities": ["NVIDIA", "TSMC"],
      "timestamp": "2026-07-06T10:30:00Z"
    }
  ]
}
```

#### 7. Get Agents
```
GET /api/agents

Response (200):
{
  "total": 17,
  "agents": [
    {
      "id": "gk-pre",
      "name": "Gatekeeper (Pre)",
      "role": "gatekeeper",
      "trust": 0.98,
      "spec": "threat_detection"
    },
    // ... 16 more
  ]
}
```

#### 8. Get Metrics
```
GET /api/metrics

Response (200):
{
  "arbitrage": {
    "totalSignalsGenerated": 145,
    "profitableSignals": 102,
    "winRate": 0.70,
    "totalNotional": 2450000,
    "riskExposure": 45.2
  },
  "overall": {
    "totalRequests": 42,
    "approved": 35,
    "rejected": 2,
    "quarantine": 5,
    "killSwitch": 0
  }
}
```

---

## CONFIGURATION GUIDE

### Environment Variables

Create `.env` file:
```bash
# Server
PORT=3000
NODE_ENV=production

# API
API_RATE_LIMIT=1000         # Requests per minute
API_TIMEOUT=30000           # Milliseconds

# WebSocket
WS_PING_INTERVAL=30000      # Milliseconds
WS_MAX_CLIENTS=10000        # Max concurrent connections

# Arbitrage
SIGNAL_EXPIRE_TIME=3600000  # 1 hour
SIGNAL_MAX_CACHED=100
MESSAGE_MAX_CACHED=50

# Security
MFA_REQUIRED=false          # Multi-factor auth
AUDIT_LOGGING=true          # Log all actions
ENCRYPTION_LEVEL=high       # none | medium | high
```

### startup.json (Optional)
```json
{
  "port": 3000,
  "environment": "production",
  "logging": {
    "level": "info",
    "format": "json",
    "output": "console"
  },
  "performance": {
    "maxConnections": 10000,
    "messageQueueSize": 1000,
    "signalBufferSize": 100
  },
  "arbitrage": {
    "signalExpiry": 3600000,
    "riskMax": 100,
    "confidenceMin": 0.65,
    "bullishThreshold": 0.55
  }
}
```

---

## TROUBLESHOOTING

### Common Issues

#### Issue: Port 3000 Already in Use
```bash
# Solution 1: Use different port
PORT=3001 npm start

# Solution 2: Kill existing process
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: WebSocket Connection Failed
```
Error: "WebSocket connection refused"

Solution:
1. Check server is running: http://localhost:3000
2. Check firewall allows port 3000
3. Verify WS_URL in browser console
4. Check browser console for errors (F12)
```

#### Issue: High Memory Usage
```
> 500MB memory consumption

Solution:
1. Reduce cached signals: SIGNAL_MAX_CACHED=50
2. Reduce cached messages: MESSAGE_MAX_CACHED=25
3. Clear old signals (implement cleanup job)
4. Monitor with: process.memoryUsage()
```

#### Issue: Slow Signal Generation
```
Signal latency > 100ms

Solution:
1. Check CPU usage (top/Task Manager)
2. Reduce message batch size
3. Optimize risk calculation
4. Add database indexing (future versions)
```

#### Issue: API Returns 404
```
Error: Signal not found

Solution:
1. Verify signal ID format: sig_XXXXXXX
2. Check signal hasn't expired (1 hour lifespan)
3. Confirm signal status is PENDING (not executed/cancelled)
4. Use /api/signals to list active signals
```

---

## SUPPORT & RESOURCES

### Getting Help

#### Documentation
- **README.md**: Quick start & features
- **VALUATION_REPORT.md**: Competitive analysis
- **USER_MANUAL.md**: This document
- **SETUP_SHEET.md**: Setup instructions

#### GitHub Resources
```
Repository: mooneypaul227-lab/Council-Roll-Call
Issues: https://github.com/mooneypaul227-lab/Council-Roll-Call/issues
Discussions: https://github.com/mooneypaul227-lab/Council-Roll-Call/discussions
```

### FAQ

**Q: Can I modify the 17 agents?**  
A: Yes, edit `AGENTS` array in backend/server.js

**Q: How do I add custom signals?**  
A: Extend `analyzeMessageBatch()` in ArbitrageEngine class

**Q: Can I connect real market data?**  
A: Yes, replace mock `generateMoltbookMessage()` with API calls to:
- Alpha Vantage
- IEX Cloud
- Polygon.io
- FinnHub

**Q: How do I scale to production?**  
A: Follow deployment options in VALUATION_REPORT.md

**Q: What's the minimum hardware needed?**  
A: 2GB RAM, 1 vCPU, 500MB disk (AWS t3.micro)

**Q: Can I use this commercially?**  
A: Check LICENSE.md in repository (currently open-source)

---

## SUPPORT SHEET

### Contact Information
```
GitHub Issues: Submit via repo
Email: mooneypaul227@gmail.com
Documentation: See docs/ folder
Community: GitHub Discussions
```

### Response Times
- Critical Issues: 4 hours
- Bug Reports: 24 hours
- Feature Requests: 1 week
- Documentation: As available

### Escalation Path
1. GitHub Issues (Public)
2. GitHub Discussions (Community)
3. Direct Email (Private)
4. Video Support (Enterprise customers)

---

**Version**: 2.0.0  
**Status**: Production Ready  
**Last Updated**: 2026-07-06

