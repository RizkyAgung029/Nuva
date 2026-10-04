import React, { useState } from 'react';
import { BridgeLane, BridgeTransaction } from '../types/treasury';
import { 
  Globe2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Activity, 
  ExternalLink,
  Lock,
  Radio,
  Sliders,
  AlertTriangle
} from 'lucide-react';

interface CrossChainBridgeStatsProps {
  lanes: BridgeLane[];
  transactions: BridgeTransaction[];
  onInitiateBridgeTransfer?: (tx: BridgeTransaction) => void;
}

export const CrossChainBridgeStats: React.FC<CrossChainBridgeStatsProps> = ({
  lanes,
  transactions,
  onInitiateBridgeTransfer,
}) => {
  const [selectedSourceChain, setSelectedSourceChain] = useState<string>('Ethereum Mainnet (L1)');
  const [transferAmountUsd, setTransferAmountUsd] = useState<number>(500000);
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'nvUSD'>('USDC');
  const [isRoutingSimulated, setIsRoutingSimulated] = useState<boolean>(false);
  const [simulationSuccessMessage, setSimulationSuccessMessage] = useState<string | null>(null);

  const totalVolume = lanes.reduce((acc, l) => acc + l.settled24hVolumeUsd, 0);
  const totalTxs = lanes.reduce((acc, l) => acc + l.totalTransactions24h, 0);

  const activeLane = lanes.find((l) => l.sourceChain === selectedSourceChain) || lanes[0];

  const handleSimulateTransfer = () => {
    setIsRoutingSimulated(true);
    setSimulationSuccessMessage(null);

    setTimeout(() => {
      setIsRoutingSimulated(false);
      const newTx: BridgeTransaction = {
        id: `btx-${Math.floor(200 + Math.random() * 800)}`,
        messageId: `0x${Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: 'Just now',
        sourceChain: selectedSourceChain,
        destChain: 'Monad (L1)',
        token: selectedToken,
        amount: transferAmountUsd,
        sender: '0x3344...bb71 (Institutional Treasury Client)',
        receiver: '0x40cc...719a (RWAVault.sol)',
        status: 'settled',
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        ccipExplorerUrl: 'https://ccip.chain.link',
      };

      if (onInitiateBridgeTransfer) {
        onInitiateBridgeTransfer(newTx);
      }

      setSimulationSuccessMessage(
        `Successfully routed $${(transferAmountUsd / 1e6).toFixed(2)}M ${selectedToken} from ${selectedSourceChain} to Monad via CCIP v1.6. Verified by Risk Management Network (RMN).`
      );
      setTimeout(() => setSimulationSuccessMessage(null), 6000);
    }, 1400);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>CHAINLINK CCIP v1.6</span>
            <span className="text-slate-600">/</span>
            <span>CROSS-CHAIN INSTITUTIONAL LIQUIDITY ROUTER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Cross-Chain Liquidity Bridge & Lane Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time monitoring of programmable token transfers, lane rate limits, and Risk Management Network (RMN) consensus.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-xs font-mono text-cyan-300">
          <Globe2 className="h-3.5 w-3.5" />
          <span>4 Active CCIP Lanes · Defense-in-Depth RMN</span>
        </div>
      </div>

      {/* High-Level Bridge KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">24h Settled Cross-Chain Volume</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            ${(totalVolume / 1e6).toFixed(2)}M USD
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            Across 4 validated lanes
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">24h CCIP Inbound Transfers</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight tabular-nums">
            {totalTxs} Transactions
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            100% verified settlement rate
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Average Settlement Latency</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            ~42s
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            L2 & SVM sub-minute finality
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Risk Management Network</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight">
            ARM Consensus
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            Secondary anomaly gating active
          </span>
        </div>
      </div>

      {/* Active CCIP Lanes Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Active Chainlink CCIP Lanes to Monad</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Programmable token transfers with rate limiting and origin proof of reserve gating
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            CCIP Router Standard: v1.6.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
          {lanes.map((lane) => {
            const usedPct = ((lane.rateLimitCapacityUsd - lane.rateLimitRemainingUsd) / lane.rateLimitCapacityUsd) * 100;
            return (
              <div 
                key={lane.id} 
                className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-sans font-bold text-white text-sm">
                      {lane.sourceChain} &rarr; Monad
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase">
                    {lane.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">24h Volume:</span>
                    <span className="text-white font-bold">${(lane.settled24hVolumeUsd / 1e6).toFixed(2)}M</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Avg Finality:</span>
                    <span className="text-slate-200">{lane.avgFinalitySeconds}s (~{(lane.avgFinalitySeconds / 60).toFixed(1)}m)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Messages (24h):</span>
                    <span className="text-slate-200">{lane.totalTransactions24h} txs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Execution Fee:</span>
                    <span className="text-cyan-300 font-semibold">${lane.linkFeeUsd.toFixed(2)} LINK</span>
                  </div>
                </div>

                {/* Rate Limit Meter */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Lane Rate Limit Capacity:</span>
                    <span>${(lane.rateLimitRemainingUsd / 1e6).toFixed(2)}M / ${(lane.rateLimitCapacityUsd / 1e6).toFixed(1)}M remaining</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        usedPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${usedPct}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 truncate pt-1">
                  Router: <span className="text-slate-400">{lane.ccipRouter}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Cross-Chain Liquidity Routing Simulator */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#0E1526] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-cyan-400" />
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Programmable Token Transfers
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Cross-Chain Inflow & Settlement Simulator
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Chainlink CCIP SDK v1.6 Target: RWAVault.sol
          </span>
        </div>

        {simulationSuccessMessage && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{simulationSuccessMessage}</span>
            </div>
            <button onClick={() => setSimulationSuccessMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Controls Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-slate-300 font-sans font-medium block mb-1.5">Origin Network</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {lanes.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedSourceChain(l.sourceChain)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                      selectedSourceChain === l.sourceChain
                        ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block truncate">{l.sourceChain.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-500">{l.avgFinalitySeconds}s finality</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-sans font-medium block mb-1.5">Asset to Bridge</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedToken('USDC')}
                    className={`flex-1 p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                      selectedToken === 'USDC'
                        ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400'
                    }`}
                  >
                    USDC (Fiat Reserve)
                  </button>
                  <button
                    onClick={() => setSelectedToken('nvUSD')}
                    className={`flex-1 p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                      selectedToken === 'nvUSD'
                        ? 'border-cyan-500 bg-cyan-950/30 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400'
                    }`}
                  >
                    nvUSD (Vault Share)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-sans font-medium block mb-1.5">Transfer Amount (USD)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={transferAmountUsd}
                    onChange={(e) => setTransferAmountUsd(Math.max(1000, parseInt(e.target.value) || 0))}
                    className="flex-1 bg-[#090D16] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-slate-400 text-xs">USD</span>
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="text-slate-500">Quick amounts:</span>
              <button onClick={() => setTransferAmountUsd(100000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$100k</button>
              <button onClick={() => setTransferAmountUsd(500000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$500k</button>
              <button onClick={() => setTransferAmountUsd(1500000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$1.5M</button>
            </div>
          </div>

          {/* Settlement Preview Summary Card */}
          <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-sans font-semibold text-slate-200 block mb-2">
                Routing Summary & Safety Bounds
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Target Inflow:</span>
                  <span className="text-emerald-400 font-bold">Monad L1 (RWAVault)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Est. Finality:</span>
                  <span className="text-white">{activeLane.avgFinalitySeconds} seconds</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Lane Remaining:</span>
                  <span className="text-slate-200">${(activeLane.rateLimitRemainingUsd / 1e6).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Est. CCIP Fee:</span>
                  <span className="text-cyan-300 font-semibold">${activeLane.linkFeeUsd.toFixed(2)} LINK</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">RMN Anomaly Gate:</span>
                  <span className="text-emerald-400 font-bold">Passed (Nominal)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateTransfer}
              disabled={isRoutingSimulated}
              className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isRoutingSimulated
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRoutingSimulated ? 'animate-spin' : ''}`} />
              <span>{isRoutingSimulated ? 'Simulating CCIP Transfer...' : 'Execute Programmable Bridge Inflow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Bridge Transactions Ledger */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Live CCIP Bridge Transaction Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified programmable token transfers into the Monad RWA Vault
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Real-time On-Chain Telemetry</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">CCIP Message ID</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Asset & Amount</th>
                <th className="py-2.5 px-3">Sender & Receiver</th>
                <th className="py-2.5 px-3 text-right">Age</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 text-slate-300 flex items-center gap-1.5">
                    <span>{tx.messageId}</span>
                    <a 
                      href={tx.ccipExplorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:text-cyan-300"
                      title="View on Chainlink CCIP Explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300">{tx.sourceChain.split(' ')[0]}</span>
                    <span className="text-slate-600 mx-1">&rarr;</span>
                    <span className="text-emerald-400 font-bold">{tx.destChain.split(' ')[0]}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white tabular-nums">
                    ${(tx.amount / 1e6).toFixed(2)}M <span className="text-slate-400 font-normal">{tx.token}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-xs">
                    {tx.sender}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 tabular-nums">
                    {tx.timestamp}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${
                      tx.status === 'settled'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse'
                    }`}>
                      {tx.status === 'settled' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span className="capitalize">{tx.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
