# 🎥 Video Demo Script - AI Vending Machine 2.0

**Duration:** 2-3 minutes  
**Target:** Hackathon judges  
**Goal:** Show innovation, technical depth, and real-world value

---

## 📋 Pre-Recording Checklist

- [ ] Clean browser (no tabs/bookmarks visible)
- [ ] Full screen Next.js app ready at localhost:3000
- [ ] Terminal ready with logs visible
- [ ] Circle Console open in another tab
- [ ] Arc Explorer ready
- [ ] Test run completed successfully
- [ ] Audio/mic tested
- [ ] Screen recording software ready (OBS/Loom)

---

## 🎬 SECTION 1: Hook & Problem (0:00 - 0:20)

### Visual
- Show traditional consulting screenshot (expensive, $500/hour)
- Show long waiting times, gatekept access

### Script
> "Getting professional insights today is broken. You either pay hundreds per hour for consultants, or you get generic free content. What if you could pay just 8 cents for instant, AI-powered expert analysis?"

**[Transition to demo]**

---

## 🎬 SECTION 2: Product Demo (0:20 - 1:30)

### Visual: Start Recording
- Open browser at `localhost:3000`
- Show beautiful UI with purple gradient

### Script
> "Meet AI Vending Machine - pay-per-insight micropayments on Circle's Arc blockchain."

**Step 1: Show Interface**
- Pan down slowly showing:
  - Arc Testnet badge with 20 USDC
  - Query input field
  - Category selector
  - Price quote button

### Script
> "Let's analyze Supra token trends. I'll select Crypto Analysis category..."

**Step 2: Get Quote**
- Type: "Analyze Supra token market trends and price predictions for 2026"
- Select: "Crypto Analysis"
- Click: "Get Price Quote"
- **[Wait for API call - show terminal logs briefly]**

### Script
> "Dynamic pricing calculates 8 cents USDC based on complexity and category..."

**Step 3: Payment Flow**
- Show quote card with:
  - Amount: 0.08 USDC
  - Recipient wallet
  - Expiration time
- Click: "Pay 0.08 USDC & Get Insight"

### Script
> "Now here's where it gets interesting. In demo mode, we simulate the payment, but let me explain the production flow..."

**Step 4: Demo Notice**
- **[Popup appears]**
- Read through the steps quickly:

### Script
> "In production:
> 1. MetaMask opens automatically
> 2. You sign a USDC transaction on Arc - sub-second finality
> 3. Backend verifies on-chain
> 4. Only then, Gemini AI generates your insight
> 
> Let's proceed with the demo..."

**Step 5: Show Insight**
- **[Click OK on popup]**
- **[Show loading state - 2-4 seconds]**
- **[Insight appears with animation]**

### Script
> "And there it is! Professional crypto analysis powered by Google's Gemini AI. Transaction ID recorded. All for 8 cents."

**Step 6: Show Details**
- Scroll through insight text
- Point to:
  - "Paid: 0.08 USDC" badge
  - Category tag
  - Transaction ID

---

## 🎬 SECTION 3: Technical Deep Dive (1:30 - 2:10)

### Visual: Split Screen
- Left: App running
- Right: Circle Console / Terminal

### Script
> "Let's talk about what makes this special..."

**Show Circle Console**
- Navigate to wallet
- Show balance: 20 USDC
- Show wallet address

### Script
> "Circle's Developer-Controlled Wallets with Entity Secret encryption provide enterprise security. Our wallet holds 20 USDC testnet ready for transactions."

**Show Terminal Logs**
- Point to successful API calls:
  - `POST /api/insight/quote 200`
  - `Generating insight for payment...`
  - `POST /api/insight/generate 200`

### Script
> "Arc blockchain provides sub-second finality - perfect for micropayments. USDC as native gas means no ETH needed. Just pure USDC transactions."

**Show Code (Brief)**
- Quick peek at `page.tsx` showing production comments:
```typescript
// === FLOW REALE IN PRODUZIONE ===
// 1. const signer = await connectWallet()
// 2. const tx = await usdcContract.transfer(...)
// 3. Backend verifica on-chain
// 4. Solo se valido → genera insight
```

### Script
> "Production-ready architecture documented. Real wallet integration is straightforward - we just need to swap demo mode with actual ethers.js calls."

---

## 🎬 SECTION 4: Business Vision (2:10 - 2:40)

### Visual: Return to App
- Click "Ask Another Question"
- Show clean interface again

### Script
> "The vision? Democratize professional insights. 8 cents instead of $800. Instant instead of hours. Global instead of gatekept."

**Use Cases Overlay** (simple text animation):
- "🔹 Crypto traders getting market analysis"
- "🔹 Small businesses needing consulting"
- "🔹 Students researching topics"
- "🔹 Developers building with AI APIs"
- "🔹 Autonomous AI agents as customers"

### Script
> "And here's the killer feature: autonomous AI agents can be customers. Imagine an AI trading bot that pays 8 cents for real-time analysis before making decisions. That's agentic commerce."

---

## 🎬 SECTION 5: Technical Stack & Circle Integration (2:40 - 2:55)

### Visual: Quick Montage
- Show code structure in VSCode
- Show README documentation
- Show Circle SDK integration

### Script
> "Built with Next.js 15, Circle's Developer Wallets SDK, and Gemini AI. Arc's EVM compatibility made integration seamless. USDC stablecoin ensures predictable pricing globally."

**Highlight Circle Products**:
- "✓ Arc Blockchain - sub-second finality"
- "✓ Developer-Controlled Wallets - secure & programmable"  
- "✓ USDC - stable, compliant, global"

---

## 🎬 SECTION 6: Call to Action & Close (2:55 - 3:00)

### Visual: Final UI Shot
- Beautiful interface with gradient
- Footer visible

### Script
> "AI Vending Machine 2.0. Micropayments meet AI. Built for Agentic Commerce Hackathon 2026. Code on GitHub. Let's make expert insights accessible to everyone."

**End Screen:**
- Project Name
- Your Name/GitHub
- "Built with Circle Arc • Gemini AI • USDC"
- Hackathon logo

---

## 🎯 Post-Production Checklist

- [ ] Add title card at start (0:00-0:03)
- [ ] Add subtle background music (low volume)
- [ ] Add text overlays for key points
- [ ] Add Circle/Gemini logos where appropriate
- [ ] Color correct (ensure purple/cyan pops)
- [ ] Add call-to-action end screen
- [ ] Export at 1080p 60fps
- [ ] Check audio levels
- [ ] Test on mobile/desktop

---

## 💡 Pro Tips for Recording

1. **Practice 3x before final recording**
2. **Speak clearly and confidently**
3. **Pause between sections** (easier editing)
4. **Show, don't just tell** (visual demos > talking)
5. **Keep energy high** (judges watch 100s of videos)
6. **Don't apologize** (no "this is just a demo")
7. **Smile when you speak** (audio sounds better!)
8. **Re-record sections if needed** (perfection not required)

---

## 🎨 Visual Effects to Add

- **0:20**: Fade in with logo
- **0:30**: Zoom on UI elements
- **1:00**: Circle loading animation
- **1:30**: Split-screen effect
- **2:10**: Text overlay animations
- **2:50**: Quick cuts for energy
- **3:00**: Fade out with music

---

## 📊 What Judges Look For

✅ **Innovation**: Micropayments + AI + Blockchain  
✅ **Technical Execution**: Clean code, working demo  
✅ **Circle Integration**: Clear use of Arc, Wallets, USDC  
✅ **Business Viability**: Real problem, real solution  
✅ **Presentation Quality**: Professional, clear, engaging  
✅ **Future Vision**: Agentic commerce potential

---

## 🚀 Bonus Points

- Show actual transaction on Arc Explorer (if time permits)
- Demonstrate different categories/pricing
- Show responsive design (mobile view)
- Mention security features
- Reference Circle documentation

---

**Good luck! You've got this! 🎉**
