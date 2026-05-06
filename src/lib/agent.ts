// src/lib/agent.ts

export interface AdImpression {
  campaignId: number;
  secret: string;
  timestamp: number;
}

const VAULT_KEY = "zk_agent_vault";

export function recordImpression(campaignId: number, secret: string) {
  if (typeof window === 'undefined') return;

  const existing = getImpressions();
  
  // Prevent duplicates
  if (!existing.find(i => i.campaignId === campaignId)) {
    existing.push({
      campaignId,
      secret,
      timestamp: Date.now()
    });
    localStorage.setItem(VAULT_KEY, JSON.stringify(existing));
    console.log(`Agent: Recorded impression for campaign ${campaignId}`);
  }
}

export function getImpressions(): AdImpression[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(VAULT_KEY);
  return data ? JSON.parse(data) : [];
}

export function hasSeenCampaign(campaignId: number): boolean {
  return getImpressions().some(i => i.campaignId === campaignId);
}

// In a real ZKP system, this function would take the secret, run a WASM circuit 
// locally, and return a cryptographic proof (bytes) that can be verified on-chain.
// For this MVP, we return the secret itself, which the smart contract will hash
// to verify it matches the campaign's secretHash.
export function generateProof(campaignId: number): string | null {
  const impression = getImpressions().find(i => i.campaignId === campaignId);
  if (impression) {
    return impression.secret;
  }
  return null;
}
