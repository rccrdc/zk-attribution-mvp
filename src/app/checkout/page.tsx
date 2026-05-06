"use client";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { hasSeenCampaign, generateProof } from '@/lib/agent';
import DiscountVaultArtifact from '@/artifacts/contracts/DiscountVault.sol/DiscountVault.json';

// In a real app, you'd get this from the deployment output or environment variables
const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Deployed local hardhat address
const CAMPAIGN_ID = 1;
const ORIGINAL_PRICE = ethers.parseEther("100"); // 100 mock USD/ETH

export default function CheckoutPage() {
  const [hasAgentProof, setHasAgentProof] = useState(false);
  const [status, setStatus] = useState<string>("Ready to checkout");
  const [finalPrice, setFinalPrice] = useState<string>("100.00");
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    // Agent checks if it has a proof for this campaign
    if (hasSeenCampaign(CAMPAIGN_ID)) {
      setHasAgentProof(true);
      // We don't apply the discount yet, the smart contract does it!
      // But we could show an indicator to the user.
    }
  }, []);

  const handleCheckout = async () => {
    try {
      setStatus("Connecting to Agent Wallet...");
      
      // Connect to local Hardhat node
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      // Simulate the user's wallet using Hardhat Account #1
      const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
      
      const vault = new ethers.Contract(CONTRACT_ADDRESS, DiscountVaultArtifact.abi, signer);

      let tx;
      if (hasAgentProof) {
        setStatus("Generating ZK Proof locally...");
        const proof = generateProof(CAMPAIGN_ID);
        
        setStatus("Submitting proof and payment to smart contract...");
        // Pay the full price conceptually, but let the contract do the math 
        // (for MVP we just pass the price and the contract calculates discount)
        tx = await vault.checkoutWithAttribution(CAMPAIGN_ID, proof, ORIGINAL_PRICE);
      } else {
        // Normal checkout without attribution
        setStatus("No attribution proof found. Processing standard payment...");
        // For MVP, we just simulate standard payment since our contract requires a proof for checkoutWithAttribution
        throw new Error("Standard checkout not implemented in MVP contract. Please visit /publisher first!");
      }

      setStatus("Waiting for blockchain confirmation...");
      const receipt = await tx.wait();
      
      // Look for AttributionLogged event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = vault.interface.parseLog(log);
          return parsed?.name === 'AttributionLogged';
        } catch { return false; }
      });

      if (event) {
        const parsedEvent = vault.interface.parseLog(event);
        const finalPricePaid = ethers.formatEther(parsedEvent?.args[3]);
        setFinalPrice(finalPricePaid);
        setStatus(`Success! Smart contract verified the proof and applied discount.`);
      } else {
        setStatus("Transaction successful.");
      }
      
      setTxHash(tx.hash);

    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold">Nike Air Zoom</h2>
              <p className="text-gray-500 mt-1">Men's Running Shoes</p>
            </div>
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl">
              👟
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-lg">
              <span className="text-gray-500">Original Price</span>
              <span className="font-medium">${ethers.formatEther(ORIGINAL_PRICE)}</span>
            </div>
            
            {hasAgentProof && (
              <div className="flex justify-between text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/50">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                  Agent Proof Ready
                </span>
                <span>Discount will apply</span>
              </div>
            )}

            <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-200 dark:border-gray-800">
              <span>Total</span>
              <span>${finalPrice}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform active:scale-95"
          >
            Pay Now
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">{status}</p>
            {txHash && (
              <p className="text-xs text-blue-500 mt-2 break-all font-mono">
                Tx: {txHash}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
