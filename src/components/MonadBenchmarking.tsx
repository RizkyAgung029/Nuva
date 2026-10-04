import React, { useState } from 'react';
import { MonadNetworkStats } from '../types/treasury';
import { 
  Zap, 
  Activity, 
  Gauge, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface MonadBenchmarkingProps {
  stats: MonadNetworkStats;
}

export const MonadBenchmarking: React.FC<MonadBenchmarkingProps> = ({ stats }) => {
  const [rebalancesPerDay, setRebalancesPerDay] = useState<number>(24); // Hourly rebalancing
  const [hoveredNetwork, setHoveredNetwork] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Annual calculation
  const monadCostPerYear = rebalancesPerDay * 365 * stats.avgGasFeeUsd;
  const ethCostPerYear = rebalancesPerDay * 365 * 18.50; // ~$18.50 avg complex swap on L1
  const arbCostPerYear = rebalancesPerDay * 365 * 0.45; // ~$0.45 on typical L2 rollup

  const annualSavingsUsd = ethCostPerYear - monadCostPerYear;

  const comparisonData = [
    {
      network: 'Monad (L1)',
      tps: '10,000',
      blockTime: '0.4s (400ms)',
      finality: '800ms (Single-slot)',
      rebalanceCost: `$${stats.avgGasFeeUsd.toFixed(5)}`,
      annualCost: `$${monadCostPerYear.toFixed(2)}`,
      status: 'Target Deployment',
      isMonad: true,
    },
    {
      network: 'Ethereum Mainnet (L1)',
      tps: '15 - 20',
      blockTime: '12.0s',
      finality: '15 mins (2 epochs)',
      rebalanceCost: '$18.50',
      annualCost: `$${ethCostPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      status: 'Cost Prohibitive',
      isMonad: false,
    },
    {
      network: 'Arbitrum One (L2)',
      tps: '65 - 80',
      blockTime: '0.25s',
      finality: '7 days (Challenge)',
      rebalanceCost: '$0.45',
      annualCost: `$${arbCostPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      status: 'Moderate Friction',
      isMonad: false,
    },
    {
      network: 'Solana (L1)',
      tps: '2,500',
      blockTime: '0.4s',
      finality: '12.8s',
      rebalanceCost: '$0.0025',
      annualCost: `$${(rebalancesPerDay * 365 * 0.0025).toFixed(2)}`,
      status: 'Non-EVM Complexity',
      isMonad: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>MONAD ECOSYSTEM OPTIMIZATION</span>
            <span className="text-slate-600">/</span>
            <span>HIGH-THROUGHPUT GLOBAL SCALABILITY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Monad L1 Performance & Gas Feasibility Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Empirical benchmark illustrating why continuous institutional micro-rebalancing is only economically viable on Monad.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 text-xs font-mono text-purple-300">
          <Zap className="h-3.5 w-3.5 text-purple-400" />
          <span>Chain ID: {stats.chainId} · 10k TPS Engine</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Pipelined Throughput</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {stats.tps.toLocaleString()} TPS
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            Superscalar EVM Engine
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Block Time Cadence</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {stats.blockTimeMs} ms
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-2 block">
            Sub-second reactive blocks
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Single-Slot Finality</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {stats.finalityMs} ms
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            Instant on-chain settlement
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Average Micro-Rebalance Fee</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            ${stats.avgGasFeeUsd.toFixed(5)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Negligible operational friction
          </span>
        </div>
      </div>

      {/* Interactive Gas Economics Calculator */}
      <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-[#0C1220] to-[#0A101D] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              The Micro-Rebalancing Feasibility Frontier
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Annual Gas Cost Calculator
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono block">Estimated Annual Savings on Monad:</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              +${annualSavingsUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </span>
          </div>
        </div>

        {/* Frequency Slider */}
        <div className="space-y-3 bg-[#090D16] border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Rebalancing Frequency per Day:</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {rebalancesPerDay} times / day ({rebalancesPerDay === 24 ? 'Hourly' : rebalancesPerDay === 1 ? 'Daily' : `${(24 / rebalancesPerDay).toFixed(1)} hrs`})
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="48"
            step="1"
            value={rebalancesPerDay}
            onChange={(e) => setRebalancesPerDay(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1x / day (Traditional DeFi)</span>
            <span>24x / day (Hourly Harvest)</span>
            <span>48x / day (Sub-Hourly Ultra-Precision)</span>
          </div>
        </div>

        {/* Interactive TPS Throughput & Finality Visualizer with Hover Tooltips */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Comparative Throughput Capacity (TPS) & Finality</span>
            <span className="text-slate-400 font-mono text-[11px]">Hover any column for architectural latency breakdown</span>
          </div>

          <div 
            className="relative rounded-xl border border-slate-800 bg-[#080C16] p-4 pt-6 select-none"
            onMouseLeave={() => setHoveredNetwork(null)}
          >
            {/* Tooltip Float Box */}
            {hoveredNetwork && (
              <div 
                className="absolute z-30 pointer-events-none rounded-lg border border-purple-500/50 bg-[#0C1424] p-3 shadow-2xl text-[11px] font-mono w-64 backdrop-blur-md transition-all duration-75"
                style={{
                  left: `${Math.min(Math.max(tooltipPos.x - 120, 10), 380)}px`,
                  top: `${Math.max(tooltipPos.y - 130, 10)}px`,
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="font-bold text-white font-sans text-xs">{hoveredNetwork.network}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    hoveredNetwork.isMonad ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {hoveredNetwork.status}
                  </span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peak TPS:</span>
                    <span className="text-purple-300 font-bold">{hoveredNetwork.tps} TPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Block Time:</span>
                    <span className="text-slate-200">{hoveredNetwork.blockTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Single-Slot Finality:</span>
                    <span className="text-cyan-300">{hoveredNetwork.finality}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                    <span>Rebalance Gas Cost:</span>
                    <span className={hoveredNetwork.isMonad ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                      {hoveredNetwork.rebalanceCost}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Comparative Pillars */}
            <div className="h-32 w-full flex items-end justify-around gap-4 px-4 pb-1">
              {comparisonData.map((net) => {
                const maxTps = 10000;
                const rawTps = net.isMonad ? 10000 : net.network.includes('Solana') ? 2500 : net.network.includes('Arbitrum') ? 80 : 20;
                const heightPct = Math.min(100, Math.max(8, (rawTps / maxTps) * 100));
                const isHovered = hoveredNetwork?.network === net.network;

                return (
                  <div
                    key={net.network}
                    onMouseEnter={(e) => {
                      setHoveredNetwork(net);
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        });
                      }
                    }}
                    className="flex-1 max-w-28 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  >
                    {isHovered && (
                      <div className="absolute inset-0 bg-purple-500/10 rounded-t border-x border-purple-500/30" />
                    )}

                    <div
                      className={`w-full rounded-t transition-all duration-200 ${
                        net.isMonad
                          ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-purple-400 shadow-lg shadow-purple-500/20'
                          : isHovered
                          ? 'bg-slate-600'
                          : 'bg-slate-700'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />

                    <span className={`text-[11px] font-mono mt-2 font-bold ${
                      net.isMonad ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {net.tps}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-around text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 px-2">
              {comparisonData.map((net) => (
                <span key={net.network} className="text-center truncate max-w-24">{net.network.split(' ')[0]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Network Architecture</th>
                <th className="py-2.5 px-3">TPS</th>
                <th className="py-2.5 px-3">Block Cadence</th>
                <th className="py-2.5 px-3">Finality</th>
                <th className="py-2.5 px-3 text-right">Per Rebalance</th>
                <th className="py-2.5 px-3 text-right">Annual Gas Overhead</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {comparisonData.map((row) => (
                <tr 
                  key={row.network}
                  className={`transition-colors ${
                    row.isMonad 
                      ? 'bg-emerald-950/20 text-white font-semibold' 
                      : 'hover:bg-slate-800/20 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-3 font-sans flex items-center gap-2">
                    {row.isMonad && <Zap className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                    <span>{row.network}</span>
                  </td>
                  <td className="py-3 px-3">{row.tps}</td>
                  <td className="py-3 px-3">{row.blockTime}</td>
                  <td className="py-3 px-3">{row.finality}</td>
                  <td className="py-3 px-3 text-right tabular-nums">{row.rebalanceCost}</td>
                  <td className={`py-3 px-3 text-right tabular-nums ${row.isMonad ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    {row.annualCost}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      row.isMonad 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monad Technical Advantages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase font-semibold">
            <Cpu className="h-4 w-4" />
            <span>Asynchronous Execution</span>
          </div>
          <h3 className="font-bold text-white text-base">Decoupled Consensus & Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consensus and state execution are pipelined independently. 
            Smart contract operations don't bottleneck block propagation, unlocking 10,000 TPS.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-semibold">
            <Layers className="h-4 w-4" />
            <span>MonadDb State Access</span>
          </div>
          <h3 className="font-bold text-white text-base">Custom Async Storage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates the disk I/O bottleneck inherent to conventional Ethereum clients by reading 
            and writing state in parallel with zero lock contention.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>100% EVM Equivalence</span>
          </div>
          <h3 className="font-bold text-white text-base">Zero-Friction Tooling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All OpenZeppelin standards, Foundry scripts, MetaMask, and Chainlink oracle libraries 
            run directly without code modification.
          </p>
        </div>
      </div>
    </div>
  );
};
