import React, { useState } from 'react';
import { PerformanceStats } from '../types/treasury';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Calendar,
  Percent
} from 'lucide-react';

interface PerformanceAnalyticsProps {
  stats: PerformanceStats;
  currentVaultApy: number;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ stats, currentVaultApy }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'sofr' | 'agg' | 'tbills'>('sofr');
  const [hoveredMonth, setHoveredMonth] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const benchmarks = {
    sofr: { name: 'SOFR Benchmark Rate', apy: 4.85, alpha: currentVaultApy - 4.85 },
    agg: { name: 'Bloomberg US Aggregate Bond Index', apy: 4.40, alpha: currentVaultApy - 4.40 },
    tbills: { name: 'US 3-Month Treasury Constant Maturity', apy: 5.02, alpha: currentVaultApy - 5.02 },
  };

  const activeBenchmark = benchmarks[selectedBenchmark];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>RISK-ADJUSTED PERFORMANCE</span>
            <span className="text-slate-600">/</span>
            <span>SHARPE & SORTINO ALPHA ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Institutional Treasury Performance Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Empirical risk-adjusted metrics, benchmark alpha attribution, and historical monthly return distributions.
          </p>
        </div>

        {/* Benchmark Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setSelectedBenchmark('sofr')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedBenchmark === 'sofr'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs SOFR (4.85%)
          </button>
          <button
            onClick={() => setSelectedBenchmark('agg')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedBenchmark === 'agg'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs US Agg (4.40%)
          </button>
          <button
            onClick={() => setSelectedBenchmark('tbills')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectedBenchmark === 'tbills'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs 3M T-Bills (5.02%)
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Annualized Net Yield</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            {currentVaultApy.toFixed(2)}% APY
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono mt-2 block">
            +{(activeBenchmark.alpha * 100).toFixed(0)} bps vs {activeBenchmark.name.split(' ')[0]}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Sharpe Ratio (Rf = 4.85%)</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {stats.sharpeRatio.toFixed(2)}
          </div>
          <span className="text-[11px] text-cyan-400 font-mono mt-2 block">
            Sortino Ratio: {stats.sortinoRatio.toFixed(2)} (Downside Risk)
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Max Inception Drawdown</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight tabular-nums">
            {stats.maxDrawdownPct.toFixed(2)}%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Calmar Ratio: {stats.calmarRatio.toFixed(1)}x
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Cumulative Total Return</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight tabular-nums">
            +{stats.cumulativeReturnPct.toFixed(2)}%
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            Win Rate: {stats.winRatePct}% positive yield days
          </span>
        </div>
      </div>

      {/* Yield Decomposition Waterfall */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Yield Source Decomposition & Alpha Attribution</h2>
        <p className="text-xs text-slate-400">
          How NUVA Treasury generates {currentVaultApy.toFixed(2)}% net APY compared to the risk-free rate
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">1. Base Macro Benchmark</span>
              <span className="text-white font-bold">4.85%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '86%' }} />
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Derived from high-grade 0-3M US Treasury Bills held at BNY Mellon digital custody.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">2. Institutional Credit Spread</span>
              <span className="text-cyan-400 font-bold">+0.59%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '10%' }} />
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Premium captured from Tier-1 corporate commercial paper & verified trade receivables.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">3. Monad Micro-Rebalance Alpha</span>
              <span className="text-emerald-400 font-bold">+0.18%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '4%' }} />
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Frictionless hourly compounding and target drift elimination enabled by Monad's $0.0004 gas fee.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Alpha Attribution & Yield Curve Chart with Hover Tooltips */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-0.5">
              <span>ALPHA SPREAD CURVE</span>
              <span className="text-slate-600">/</span>
              <span>VAULT VS SOFR BENCHMARK</span>
            </div>
            <h2 className="text-base font-bold text-white">Monthly Compounding Return & Excess Alpha Curve</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>SOFR Benchmark (4.85% APY)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>NUVA Vault Net Return</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Net Alpha Attribution</span>
            </div>
          </div>
        </div>

        {/* Visual Chart with Interactive Floating Tooltip */}
        <div 
          className="relative rounded-xl border border-slate-800/80 bg-[#080C16] p-4 pt-6 select-none"
          onMouseLeave={() => setHoveredMonth(null)}
        >
          {/* Tooltip Float Box */}
          {hoveredMonth && (
            <div 
              className="absolute z-30 pointer-events-none rounded-lg border border-cyan-500/50 bg-[#0C1424] p-3 shadow-2xl text-[11px] font-mono w-64 backdrop-blur-md transition-all duration-75"
              style={{
                left: `${Math.min(Math.max(tooltipPos.x - 128, 10), 500)}px`,
                top: `${Math.max(tooltipPos.y - 145, 10)}px`,
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-white font-sans text-xs">{hoveredMonth.month} {hoveredMonth.year}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Attested
                </span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vault Net Return:</span>
                  <span className="text-emerald-400 font-bold">+{hoveredMonth.vaultReturnPct.toFixed(2)}% ({((hoveredMonth.vaultReturnPct) * 12).toFixed(2)}% Ann.)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SOFR Baseline:</span>
                  <span className="text-slate-300">+{hoveredMonth.benchmarkSofrPct.toFixed(2)}% ({((hoveredMonth.benchmarkSofrPct) * 12).toFixed(2)}% Ann.)</span>
                </div>
                <div className="flex justify-between text-cyan-300 border-t border-slate-800/60 pt-1 font-bold">
                  <span>Net Alpha Generated:</span>
                  <span>+{hoveredMonth.alphaBps} bps</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Keeper Execution:</span>
                  <span className="text-emerald-400">Monad Native (~400ms)</span>
                </div>
              </div>
            </div>
          )}

          {/* Dual Bar + Pillar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-1">
            {stats.monthlyReturns.map((m) => {
              const maxReturn = 0.60; // scale up to 0.60%
              const vaultHeightPct = Math.min(100, Math.max(15, (m.vaultReturnPct / maxReturn) * 100));
              const sofrHeightPct = Math.min(100, Math.max(15, (m.benchmarkSofrPct / maxReturn) * 100));
              const isHovered = hoveredMonth?.month === m.month;

              return (
                <div
                  key={m.month}
                  onMouseEnter={(e) => {
                    setHoveredMonth(m);
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
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  {/* Subtle hover column highlight */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-t border-x border-cyan-500/30" />
                  )}

                  {/* Dual Bar Cluster */}
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* SOFR benchmark bar */}
                    <div
                      className={`w-1/2 rounded-t transition-all duration-150 ${
                        isHovered ? 'bg-blue-400' : 'bg-slate-700'
                      }`}
                      style={{ height: `${sofrHeightPct}%` }}
                    />
                    {/* Vault return bar */}
                    <div
                      className={`w-1/2 rounded-t transition-all duration-150 ${
                        isHovered 
                          ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-md shadow-emerald-500/30' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ height: `${vaultHeightPct}%` }}
                    />
                  </div>

                  {/* Net Alpha Callout Badge on Hover */}
                  <div className="text-[10px] font-mono text-cyan-400 font-bold mt-1 text-center">
                    +{m.alphaBps}b
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Month Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 px-2">
            {stats.monthlyReturns.map((m) => (
              <span key={m.month} className="text-center">{m.month.substring(0, 3)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Monthly Returns Matrix */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">2026 Monthly Performance Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Net monthly compounding return compared against SOFR baseline
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">10 Consecutive Positive Months</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-right">Vault Net Return</th>
                <th className="py-2.5 px-3 text-right">Benchmark (SOFR)</th>
                <th className="py-2.5 px-3 text-right">Net Alpha</th>
                <th className="py-2.5 px-3 text-right">Annualized Cadence</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stats.monthlyReturns.map((m) => (
                <tr key={`${m.month}-${m.year}`} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-sans text-white font-medium">
                    {m.month} {m.year}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                    +{m.vaultReturnPct.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    +{m.benchmarkSofrPct.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 font-semibold tabular-nums">
                    +{m.alphaBps} bps
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    {(m.vaultReturnPct * 12).toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Attested
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
