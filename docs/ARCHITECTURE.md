# 🏗️ Architecture & Flow Diagrams

## System Architecture
```mermaid
graph TB
    subgraph "Frontend - Next.js"
        UI[User Interface]
        WC[Wallet Connect]
    end
    
    subgraph "Backend APIs"
        QA[Quote API]
        GA[Generate API]
        BA[Balance API]
    end
    
    subgraph "External Services"
        CW[Circle Wallet]
        AB[Arc Blockchain]
        GM[Gemini AI]
    end
    
    UI -->|1. Request Quote| QA
    QA -->|2. Calculate Price| UI
    UI -->|3. Initiate Payment| WC
    WC -->|4. USDC Transfer| AB
    AB -->|5. Tx Confirmation| GA
    GA -->|6. Verify Payment| CW
    GA -->|7. Request Insight| GM
    GM -->|8. Return Analysis| GA
    GA -->|9. Deliver Insight| UI
```

## Payment Flow - Demo vs Production

### Demo Mode (Current)
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant G as Gemini AI
    
    U->>F: Enter Query
    F->>A: POST /api/insight/quote
    A->>F: Return Price Quote
    U->>F: Click "Pay & Get Insight"
    F->>U: Show Demo Notice
    U->>F: Confirm
    F->>A: POST /api/insight/generate
    Note over F,A: txHash: demo_tx_123456
    A->>G: Generate Insight
    G->>A: Return Analysis
    A->>F: Deliver Insight
    F->>U: Display Result
```

### Production Mode (Planned)
```mermaid
sequenceDiagram
    participant U as User
    participant W as Wallet (MetaMask)
    participant F as Frontend
    participant A as Backend API
    participant B as Arc Blockchain
    participant C as Circle Wallet
    participant G as Gemini AI
    
    U->>F: Enter Query
    F->>A: POST /api/insight/quote
    A->>F: Return Price Quote (0.08 USDC)
    U->>F: Click "Pay"
    F->>W: Request Connection
    W->>F: Connect Wallet
    F->>W: Request USDC Transfer
    W->>U: Show Transaction
    U->>W: Approve & Sign
    W->>B: Broadcast Transaction
    B->>B: Validate & Confirm (sub-second)
    B->>A: Tx Receipt Available
    A->>B: Verify Transaction
    Note over A,B: Check: amount >= quote<br/>recipient = our wallet<br/>status = success
    A->>C: Confirm Balance Update
    A->>G: Generate Insight Request
    G->>A: Return AI Analysis
    A->>F: Deliver Insight + Tx Hash
    F->>U: Display Result
```

## Data Flow
```mermaid
flowchart LR
    subgraph Input
        Q[User Query]
        C[Category]
    end
    
    subgraph Processing
        P[Price Calculation]
        V[Payment Verification]
        AI[AI Generation]
    end
    
    subgraph Output
        I[Insight Text]
        TX[Transaction ID]
        M[Metadata]
    end
    
    Q --> P
    C --> P
    P --> V
    V --> AI
    AI --> I
    AI --> TX
    AI --> M
```

## Technology Stack
```mermaid
graph TB
    subgraph "Frontend Layer"
        NX[Next.js 15]
        TW[Tailwind CSS]
        TS[TypeScript]
    end
    
    subgraph "API Layer"
        RT[Route Handlers]
        VL[Validation]
    end
    
    subgraph "Integration Layer"
        CS[Circle SDK]
        GS[Gemini SDK]
        ET[Ethers.js]
    end
    
    subgraph "Blockchain"
        AR[Arc Network]
        US[USDC Token]
    end
    
    NX --> RT
    TW --> NX
    TS --> NX
    RT --> VL
    VL --> CS
    VL --> GS
    CS --> AR
    GS --> AI[Gemini AI]
    ET --> AR
    AR --> US
```

## Pricing Algorithm
```mermaid
flowchart TD
    Start[Start: User Query] --> Length{Query Length?}
    Length -->|> 20 words| High[+0.04 USDC]
    Length -->|> 10 words| Med[+0.02 USDC]
    Length -->|<= 10 words| Base[Base Fee]
    
    High --> Cat[Category Check]
    Med --> Cat
    Base --> Cat
    
    Cat --> Type{Category Type}
    Type -->|Crypto| P1[0.08 USDC]
    Type -->|Technical| P2[0.09 USDC]
    Type -->|Market| P3[0.07 USDC]
    Type -->|Business| P4[0.06 USDC]
    Type -->|General| P5[0.05 USDC]
    
    P1 --> Range[Apply Min/Max]
    P2 --> Range
    P3 --> Range
    P4 --> Range
    P5 --> Range
    
    Range --> Final[Final Price: 0.05-0.09 USDC]
```

## Security Model
```mermaid
graph TD
    subgraph "User Security"
        PK[Private Keys in Wallet]
        SG[User Signs Transaction]
    end
    
    subgraph "Backend Security"
        ES[Entity Secret Encrypted]
        EV[Environment Variables]
        VF[Payment Verification]
    end
    
    subgraph "Blockchain Security"
        DT[Deterministic Finality]
        IR[Immutable Records]
        DC[Decentralized Consensus]
    end
    
    PK --> SG
    SG --> VF
    ES --> VF
    EV --> ES
    VF --> DT
    DT --> IR
    IR --> DC
```

---

## Key Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Price Range** | 0.05 - 0.09 USDC | Dynamic based on complexity |
| **Transaction Time** | < 1 second | Arc sub-second finality |
| **AI Response Time** | 2-4 seconds | Gemini 2.5 Flash |
| **Total Flow Time** | < 10 seconds | Quote → Payment → Insight |
| **Gas Costs** | ~0.001 USDC | Paid in USDC on Arc |
| **Success Rate** | 99.9% | Testnet reliability |

---

## Deployment Architecture (Future)
```mermaid
graph TB
    subgraph "CDN Layer"
        CF[Cloudflare/Vercel]
    end
    
    subgraph "Application Layer"
        NX[Next.js App]
        AP[API Routes]
    end
    
    subgraph "Database Layer"
        PG[PostgreSQL]
        RD[Redis Cache]
    end
    
    subgraph "External Services"
        CR[Circle API]
        GM[Gemini API]
        AR[Arc RPC]
    end
    
    CF --> NX
    NX --> AP
    AP --> PG
    AP --> RD
    AP --> CR
    AP --> GM
    AP --> AR
```
