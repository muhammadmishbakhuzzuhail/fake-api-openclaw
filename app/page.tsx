import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-8 font-sans">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <header className="border-b border-neutral-800 pb-4">
          <h1 className="text-4xl font-bold tracking-tight text-emerald-400">FAKE API OPENCLAW</h1>
          <p className="text-neutral-400 mt-2">Mock Server for PPOB Transaction Testing & Validation</p>
        </header>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-neutral-100">Server Status: Online</h2>
          </div>
          
          <div className="space-y-4 text-sm text-neutral-300">
            <p>Aplikasi monitoring ini siap menerima panggilan / request dari <b>Bot Alvin (OpenClaw)</b>.</p>
            <div className="bg-neutral-950 p-4 rounded-lg font-mono text-xs border border-neutral-800 overflow-x-auto space-y-2">
              <div>
                <span className="text-blue-400">GET</span> {"/api/transactions?trx=<TRX_CODE>"}
                <p className="text-neutral-500 mt-1">↳ Simulasi cek kode transaksi (bisa digunakan untuk bot / merchant)</p>
              </div>
              <div className="pt-2">
                <span className="text-yellow-400">POST</span> {"/api/transactions"}
                <p className="text-neutral-500 mt-1">↳ Otorisasi Khusus: Memerlukan payload {"{ caller_role: 'PPOB_CORE' }"}</p>
              </div>
            </div>
            
            <p className="pt-4 text-neutral-500 text-xs text-center border-t border-neutral-800">
              Data transaksi yang disediakan bersifat dummy (mocked) untuk schema PPOB standar (Pulsa, PLN, E-Wallet).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
