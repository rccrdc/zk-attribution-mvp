import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Zero-Knowledge Attribution MVP</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-12">
        A demonstration of privacy-preserving ad attribution using an AI Agent and Blockchain Smart Contracts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Link href="/publisher" className="group p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-lg transition-all text-left">
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-500">1. The Publisher &rarr;</h2>
          <p className="text-gray-500">Simulate reading a blog and viewing an ad. Your local Agent will cryptographically record the impression.</p>
        </Link>

        <Link href="/checkout" className="group p-8 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-green-500 hover:shadow-lg transition-all text-left">
          <h2 className="text-2xl font-semibold mb-2 group-hover:text-green-500">2. The Checkout &rarr;</h2>
          <p className="text-gray-500">Simulate buying the product. Your Agent will generate a proof to claim the discount directly from the Smart Contract.</p>
        </Link>
      </div>
    </div>
  );
}
