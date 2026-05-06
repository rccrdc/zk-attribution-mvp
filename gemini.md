# Zero-Knowledge Attribution MVP - Project Guide

This file acts as the primary knowledge base and reference guide for the **ZK Attribution MVP** project.

## Project Overview
This project is a functional MVP demonstrating how AI Agents and Smart Contracts can facilitate deterministic, privacy-preserving ad attribution without third-party cookies. The flow consists of:
1. **The Publisher:** A mock site that serves an ad and silently passes a cryptographic token to the user's local Agent.
2. **The Agent:** A simulated local runtime (using browser `localStorage`) that securely logs the ad impression without revealing the user's identity.
3. **The Storefront:** An e-commerce checkout page that retrieves the token from the Agent, generates a proof, and submits it to a smart contract.
4. **The Smart Contract:** A Hardhat-based Solidity contract (`DiscountVault.sol`) that verifies the proof, dynamically prices the item with a discount, and logs an on-chain conversion event.

## Architecture & Stack
- **Frontend / Client App:** Next.js 16 (App Router), React, TailwindCSS, ethers.js v6
- **Smart Contracts:** Solidity (0.8.24), Hardhat
- **Agent Simulation:** Pure TypeScript utility (`src/lib/agent.ts`) that manages `localStorage` as a secure vault.
- **Proof Mechanism:** For this MVP, instead of a heavy zk-SNARK circuit, we use a simple SHA-256 hash preimage reveal to simulate the verification of a Zero-Knowledge Proof.

## Running the Development Environment

You need three terminal windows to run the full stack:

**1. Start the Local Blockchain Node**
```bash
npx hardhat node
```
*This starts a local Ethereum network at `http://localhost:8545` and gives you 20 funded test accounts.*

**2. Deploy the Smart Contract & Create Campaign**
```bash
node scripts/deploy.js
```
*This deploys the `DiscountVault` to the local network, creates "Campaign 1", and registers the secret hash. Note the deployed contract address in the output.*

> **IMPORTANT:** If you restart the hardhat node, you MUST update `CONTRACT_ADDRESS` in `src/app/checkout/page.tsx` with the new address printed by the deployment script.

**3. Start the Next.js Web Application**
```bash
npm run dev
```
*The web app will run on `http://localhost:3000` (or `3001` if port 3000 is taken).*

## Testing the Flow
1. Visit `http://localhost:3000/publisher` to trigger the ad impression. Your local Agent will log this.
2. Visit `http://localhost:3000/checkout`. The Agent will detect the campaign and prepare the proof.
3. Click "Pay Now". This uses ethers.js (simulating the user's wallet via Hardhat Account #1) to submit the proof to the smart contract, applying the discount.

## Future Upgrades
If building towards production, these are the immediate next steps:
- **Real ZKPs:** Replace the hash preimage check with a real `Groth16` verifier (via Circom) or a zkVM verifier (via SP1/RISC Zero).
- **Sybil Resistance:** Integrate WorldID to ensure the agent is acting on behalf of a unique human.
- **Wallet Injection:** Replace the hardcoded `JsonRpcProvider` in the checkout page with standard `window.ethereum` (MetaMask / Coinbase Smart Wallet).
