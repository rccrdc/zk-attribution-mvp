# 🛡️ Zero-Knowledge Ad Attribution Network

A functional Web3 MVP demonstrating how AI Agents, Cryptography, and Smart Contracts can solve the digital advertising attribution crisis in a post-cookie world.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-Local_Network-yellow?style=flat)

---

## 🛑 The Problem
With the deprecation of third-party cookies and rising privacy regulations (ATT), advertisers are losing the ability to track ad impressions deterministically. Billions of dollars are wasted because brands cannot prove that an ad impression actually led to a purchase.

## 💡 The Solution
In the near future, **AI Agents** will execute purchases on behalf of users. Since agents operate locally on the user's device, they have perfect visibility into what ads the user has seen. 

This protocol flips the model: instead of probabilistically tracking users across the web, **brands offer a financial incentive (a discount) in exchange for cryptographic proof of attribution**.

1. The Publisher serves an ad and gives the User's Agent an encrypted "Ad Token".
2. The Agent stores this securely in a local vault.
3. When checking out, the Agent generates a Zero-Knowledge Proof (simulated via hashing in this MVP).
4. A Smart Contract verifies the proof instantly, applies a discount to the purchase, and logs a perfect, deterministic attribution event for the brand.

---

## 🏗️ Architecture

- **The Smart Contract (`DiscountVault.sol`)**: Deployed via Hardhat. Manages campaigns, verifies proofs, applies discounts, and settles the transaction.
- **The Agent Vault (`src/lib/agent.ts`)**: A localized utility that simulates an AI Agent storing impression data securely in `localStorage`.
- **The Web Application**: A Next.js 16 frontend that simulates both the Publisher (serving the ad) and the Storefront (checking out).

---

## 🚀 Getting Started

To run the full end-to-end simulation, you need to run three separate processes in your terminal.

### 1. Start the Local Blockchain
Start a local Hardhat node to simulate the Ethereum network:
```bash
npx hardhat node
```
*(Leave this running in the background)*

### 2. Deploy the Smart Contract
In a new terminal window, compile and deploy the smart contract to your local node:
```bash
node scripts/deploy.js
```
*Make a note of the deployed `DiscountVault` address. You may need to update `CONTRACT_ADDRESS` in `src/app/checkout/page.tsx` if you restart the node.*

### 3. Run the Web Application
Start the Next.js frontend:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the Flow

1. **Get the Impression:** Click on the **Publisher** link. Wait for the ad to load. Your local Agent will automatically intercept the campaign token and save it.
2. **Claim the Discount:** Go to the **Checkout** page. The UI will indicate that your Agent has found a valid proof.
3. **Verify On-Chain:** Click **Pay Now**. The Next.js app will connect to the Hardhat node, submit the proof to the Smart Contract, and you will see the final price drop as the transaction is verified on-chain.

---

## 🔮 Future Roadmap

To scale this MVP into a production-ready protocol:
- **True ZK Verification:** Replace the SHA-256 hash preimage simulation with a real zk-SNARK circuit (using Circom) or a zkVM (like SP1/RISC Zero).
- **Proof of Humanity:** Integrate **WorldID** to ensure malicious actors cannot spin up bot farms to drain discount vaults.
- **L2 Deployment:** Deploy the vault smart contracts to a fast, low-fee rollup like **Base** or **Arbitrum**.
