# 🤖 AI Vending Machine Oracle

**Pay with USDC. Get AI Insights. Earn Rewards.**

A blockchain-powered AI platform where users pay with USDC stablecoin to get instant insights from Google's Gemini AI models. Built for the Agentic Commerce Hackathon 2026.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://ai-vending-machine-app.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

---

## 🎯 The Problem

Current AI platforms use subscription models that:
- Lock users into monthly fees regardless of usage
- Don't reward loyal customers
- Lack transparency in pricing
- Require traditional payment methods

## 💡 Our Solution

AI Vending Machine Oracle introduces a **pay-per-query** model powered by blockchain:
- ✅ Pay only for what you use (no subscriptions)
- ✅ Transparent, on-chain payments with USDC
- ✅ Earn loyalty points and cashback rewards
- ✅ Viral referral system (10% cashback for referrers, 5% discount for new users)
- ✅ Three AI model tiers to match your needs and budget

---

## ✨ Key Features

### 💳 Real Blockchain Payments
- **USDC payments** on Arc Network testnet
- Real cryptocurrency transactions via MetaMask
- On-chain verification and transparency
- Instant payment confirmation

### 🤖 Google Gemini AI Integration
Three AI model tiers with different pricing:
- **Flash Lite** ($0.03/query) - Fast, efficient responses
- **Flash 2.5** ($0.05/query) - Balanced performance
- **Flash 3.0** ($0.08/query) - Most capable model

### 🎁 Rewards & Gamification
- **Loyalty Points**: Earn 1 point per $0.01 spent
- **Tier System**: Bronze → Silver → Gold → Platinum
- **Tier Benefits**: Up to 2x points multiplier at Platinum
- **Referral Rewards**: 10% cashback for referrers, 5% discount for new users
- **Transaction History**: Track all your queries and rewards

### 🎨 Beautiful User Experience
- Modern gradient UI with smooth animations
- Fully responsive (mobile, tablet, desktop)
- Real-time balance updates
- Interactive category selection
- Toast notifications for all actions

---

## 🏗️ Architecture

### Current Production Implementation (v1.0)
Our hackathon submission delivers a **fully functional** user experience:

**Payment Layer:**
- Direct USDC transfers via MetaMask
- Transaction verification on Arc Network blockchain
- Real-time balance checking
- Secure wallet integration with Wagmi + Viem

**AI Processing:**
- Google Gemini API integration
- Three model tiers (Flash Lite, Flash 2.5, Flash 3.0)
- Streaming responses for better UX
- Category-based query optimization

**Rewards System:**
- Client-side tracking with localStorage
- Instant points calculation
- Tier progression logic
- Referral code generation (UUID-based)

### Smart Contract Layer (Developed, Production-Ready)

We've written and tested a **RewardsDistributor** smart contract for automated reward distribution:

**Contract Features:**
```solidity
// contracts/RewardsDistributor.sol
- Automated cashback distribution (10% to referrers)
- On-chain referral code registration
- Tier-based reward multipliers
- USDC claim functionality
- Complete event logging for transparency
- Secure admin controls
```

**Files Included:**
- `contracts/RewardsDistributor.sol` - Main Solidity contract
- `contracts/interfaces/IERC20.sol` - USDC interface
- `scripts/deploy-rewards.js` - Deployment automation
- `hardhat.config.js` - Network configuration

**Deployment Status:** ✅ Code complete and tested. Deployment to Arc Network mainnet planned post-hackathon once public RPC endpoints are stable.

**Why Client-Side for Hackathon?**

We made a strategic architectural decision to prioritize **user experience** over automation:
- ✅ Flawless demo with real blockchain + real AI
- ✅ Zero dependency on external RPC availability
- ✅ Faster iteration during 48-hour hackathon
- ✅ Focus on core value proposition

The smart contract automation **enhances** the rewards system but doesn't block core functionality. This decision allowed us to ship a production-ready demo within the hackathon timeline.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Blockchain
- **Arc Network** - Layer 2 blockchain (testnet)
- **Circle USDC** - Stablecoin payments
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI

### AI
- **Google Gemini API** - AI models
  - gemini-2.0-flash-lite
  - gemini-2.0-flash-exp
  - gemini-exp-1206

### Smart Contracts
- **Solidity 0.8.20** - Contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Secure contract libraries

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MetaMask wallet extension
- Arc Network testnet configured in MetaMask
- USDC testnet tokens

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Artkill24/ai-vending-machine-app.git
cd ai-vending-machine-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: If deploying smart contracts
PRIVATE_KEY=your_wallet_private_key
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3000
```

### Configure MetaMask

Add Arc Network Testnet:
```
Network Name: Arc Testnet
RPC URL: https://rpc.testnet.arc.network
Chain ID: 5042002
Currency Symbol: USDC
Block Explorer: https://testnet.arcscan.app/
```

Get testnet tokens:
- **USDC testnet**: Use Circle's faucet at https://faucet.circle.com
- Note: Arc Testnet uses USDC as the native currency for gas fees


### 1. Connect Wallet
Click "Connect Wallet" and select MetaMask. Switch to Arc Testnet if prompted.

### 2. Get Test USDC
Ensure you have USDC testnet tokens for payments and ARC tokens for gas fees.

### 3. Choose AI Model
Select from three tiers based on your needs:
- **Flash Lite** - Quick queries ($0.03)
- **Flash 2.5** - Standard queries ($0.05)  
- **Flash 3.0** - Complex queries ($0.08)

### 4. Ask a Question
Type your question, select a category, and click "Get AI Insight".

### 5. Confirm Payment
Approve the USDC transaction in MetaMask.

### 6. Get Instant Response
Receive your AI-generated insight in real-time.

### 7. Earn Rewards
Track your points, tier progress, and transaction history in the dashboard.

### 8. Share Referral Code
Share your unique referral code to earn 10% cashback on referred users' spending.

---

## 📊 Smart Contract Details

### RewardsDistributor.sol

**Main Functions:**
```solidity
function addReward(address user, uint256 usdcAmount, string memory referralCode)
function claimReward()
function registerReferralCode(string memory code)
function getTierInfo(address user) returns (Tier, uint256)
```

**Events:**
```solidity
event RewardAdded(address indexed user, uint256 points, uint256 usdcReward)
event RewardClaimed(address indexed user, uint256 usdcAmount)
event ReferralUsed(address indexed referrer, address indexed referee, uint256 reward)
event TierUpgraded(address indexed user, Tier newTier)
```

### Deployment (when ready)
```bash
# Compile contracts
npx hardhat compile

# Deploy to Arc testnet
npx hardhat run scripts/deploy-rewards.js --network arcTestnet

# Verify contract (optional)
npx hardhat verify --network arcTestnet DEPLOYED_CONTRACT_ADDRESS
```

### Deployed Contract (Arc Testnet)

**RewardsDistributor**: `0x84154dB9c74a227007bcCF01904f06b50ED5c069`

View on explorer: [ArcScan](https://testnet.arcscan.app/address/0x84154dB9c74a227007bcCF01904f06b50ED5c069)
---

## 🔮 Roadmap

### Phase 1: Hackathon Demo ✅ (Current - January 2026)
- [x] Real USDC payments on blockchain
- [x] Google Gemini AI integration (3 models)
- [x] Referral & loyalty system
- [x] Transaction history tracking
- [x] Beautiful responsive UI
- [x] Smart contract code (production-ready)

### Phase 2: Smart Contract Integration (Q1 2026)
- [ ] Deploy RewardsDistributor to Arc mainnet
- [ ] Automated on-chain cashback distribution
- [ ] On-chain achievement NFTs
- [ ] Tier upgrade push notifications
- [ ] Referral leaderboard

### Phase 3: Platform Expansion (Q2 2026)
- [ ] Supabase database for persistent storage
- [ ] Advanced analytics dashboard
- [ ] Public API for third-party developers
- [ ] Multi-chain support (Ethereum, Polygon, Base)
- [ ] Mobile app (React Native)
- [ ] Enterprise tier with custom models

### Phase 4: Ecosystem Growth (Q3 2026)
- [ ] DAO governance for platform decisions
- [ ] Staking rewards for token holders
- [ ] AI model marketplace
- [ ] Developer grants program

---

## 🎥 Demo Video

[Watch the Demo](https://loom.com/share/your-video-id)

See the full platform in action:
- Wallet connection
- USDC payment flow
- AI query processing
- Rewards earning
- Referral system

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### AI Query Interface
![Query Interface](screenshots/query.png)

### Rewards Dashboard
![Rewards Dashboard](screenshots/rewards.png)

### Transaction History
![Transaction History](screenshots/history.png)

---

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Smart contract tests
npx hardhat test

# Coverage report
npx hardhat coverage
```

### Manual Testing Checklist
- [ ] Connect wallet (MetaMask)
- [ ] Check USDC balance
- [ ] Select AI model
- [ ] Submit query with payment
- [ ] Verify transaction on blockchain
- [ ] Check AI response
- [ ] Verify points earned
- [ ] Test referral code generation
- [ ] Check transaction history
- [ ] Test tier progression

---

## 🤝 Contributing

This project was built for the Agentic Commerce Hackathon 2026. While it's currently a competition entry, we welcome feedback and suggestions!

**Future contributions after the hackathon:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Circle** - For USDC infrastructure
- **Arc Network** - For the blockchain testnet
- **Google** - For Gemini AI API
- **Anthropic** - For development assistance
- **Agentic Commerce Hackathon** - For the opportunity

---

## 👨‍💻 Author

**Saad** (Artkill24)
- GitHub: [@Artkill24](https://github.com/Artkill24)
- Location: Milan, Italy
- Passion: Blockchain, AI, and building the future of Web3

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Artkill24/ai-vending-machine-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Artkill24/ai-vending-machine-app/discussions)
- **Hackathon**: Agentic Commerce Hackathon 2026

---

## 💎 Why This Project Matters

Traditional AI platforms create barriers:
- **High costs** through mandatory subscriptions
- **Vendor lock-in** with no portability
- **Opacity** in pricing and usage

AI Vending Machine Oracle brings:
- **Democratization** - Pay only for what you use
- **Transparency** - All transactions on-chain
- **Rewards** - Loyalty program for users
- **Accessibility** - Crypto-native payments

**We're building the future of AI access - one query at a time.** 🚀

---

<div align="center">

**Built with ❤️ in 48 hours for Agentic Commerce Hackathon 2026**

[Live Demo](https://ai-vending-machine-app.vercel.app/) • [Video]() • [GitHub](https://github.com/Artkill24/ai-vending-machine-app)

</div>
