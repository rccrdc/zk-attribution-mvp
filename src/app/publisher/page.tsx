"use client";

import { useEffect, useState } from 'react';
import { recordImpression } from '@/lib/agent';

export default function PublisherPage() {
  const [adLoaded, setAdLoaded] = useState(false);

  // The mock campaign ID is 1, and the secret is "nike_summer_sale_2026"
  // This matches what we deploy in our Hardhat script.
  const CAMPAIGN_ID = 1;
  const CAMPAIGN_SECRET = "nike_summer_sale_2026";

  useEffect(() => {
    // Simulate an ad loading after 1 second
    const timer = setTimeout(() => {
      setAdLoaded(true);
      // The "Publisher SDK" silently drops the token to the Agent
      recordImpression(CAMPAIGN_ID, CAMPAIGN_SECRET);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-sm p-6">
        <h1 className="text-3xl font-bold max-w-4xl mx-auto">TechBlog Daily</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 mt-8 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <article className="prose dark:prose-invert lg:prose-xl">
            <h2>The Future of AI Agents in Web3</h2>
            <p>
              In the near future, AI agents will be making payments and buying stuff on behalf of users. 
              This will lead to the adoption of blockchain infrastructure to handle the size and volume of transactions.
            </p>
            <p>
              Huge amounts of money are spent daily on ads as a way to push and promote products.
              With the death of third-party cookies, attribution is becoming a massive problem...
            </p>
          </article>
        </div>

        <aside className="col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm text-gray-500 uppercase font-semibold mb-4">Advertisement</h3>
            
            {adLoaded ? (
              <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105">
                <h4 className="font-bold text-2xl mb-2">Nike Summer Drop</h4>
                <p className="text-sm mb-4">Exclusive running shoes for the new season. Get yours before they sell out.</p>
                <div className="bg-white/20 rounded px-3 py-1 inline-block text-xs font-mono">
                  Agent: Impression Logged ✓
                </div>
              </div>
            ) : (
              <div className="bg-gray-200 dark:bg-gray-800 rounded-xl h-64 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading ad...</span>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
