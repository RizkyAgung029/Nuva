import React, { useState } from 'react';
import { GasCategoryBreakdown, MonadNetworkStats } from '../types/treasury';
import { 
  Zap, 
  DollarSign, 
  TrendingDown, 
  Layers, 
  ArrowDownRight, 
  CheckCircle2, 
  Cpu, 
  Sliders,
  HelpCircle,
  Bell,
  AlertTriangle,
  Flame,
  Check,
  Lightbulb,
  Compass,
  TrendingUp,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface GasSavingsViewProps {
  stats: MonadNetworkStats;
  breakdown: GasCategoryBreakdown[];
  onTriggerGasAlert?: (title: string, desc: string) => void;
}

interface HourlyGasPoint {
  hour: string;
  monadCostUsd: number;
  ethCostUsd: number;
  savingsUsd: number;
  monadGwei: number;
  ethGwei: number;
  txs: number;
}

const HOURLY_GAS_DATA: HourlyGasPoint[] = [
  { hour: '00:00', monadCostUsd: 0.00041, ethCostUsd: 18.20, savingsUsd: 18.19959, monadGwei: 48, ethGwei: 18, txs: 42 },
  { hour: '01:00', monadCostUsd: 0.00039, ethCostUsd: 17.50, savingsUsd: 17.49961, monadGwei: 47, ethGwei: 17, txs: 38 },
  { hour: '02:00', monadCostUsd: 0.00040, ethCostUsd: 16.90, savingsUsd: 16.89960, monadGwei: 49, ethGwei: 16, txs: 39 },
  { hour: '03:00', monadCostUsd: 0.00038, ethCostUsd: 16.50, savingsUsd: 16.49962, monadGwei: 46, ethGwei: 15, txs: 35 },
  { hour: '04:00', monadCostUsd: 0.00042, ethCostUsd: 17.10, savingsUsd: 17.09958, monadGwei: 50, ethGwei: 17, txs: 41 },
  { hour: '05:00', monadCostUsd: 0.00041, ethCostUsd: 18.00, savingsUsd: 17.99959, monadGwei: 51, ethGwei: 18, txs: 44 },
  { hour: '06:00', monadCostUsd: 0.00043, ethCostUsd: 19.40, savingsUsd: 19.39957, monadGwei: 52, ethGwei: 21, txs: 48 },
  { hour: '07:00', monadCostUsd: 0.00045, ethCostUsd: 21.00, savingsUsd: 20.99955, monadGwei: 54, ethGwei: 24, txs: 56 },
  { hour: '08:00', monadCostUsd: 0.00047, ethCostUsd: 22.80, savingsUsd: 22.79953, monadGwei: 55, ethGwei: 28, txs: 62 },
  { hour: '09:00', monadCostUsd: 0.00048, ethCostUsd: 24.50, savingsUsd: 24.49952, monadGwei: 56, ethGwei: 32, txs: 68 },
  { hour: '10:00', monadCostUsd: 0.00046, ethCostUsd: 23.20, savingsUsd: 23.19954, monadGwei: 53, ethGwei: 29, txs: 64 },
  { hour: '11:00', monadCostUsd: 0.00045, ethCostUsd: 22.10, savingsUsd: 22.09955, monadGwei: 51, ethGwei: 27, txs: 60 },
  { hour: '12:00', monadCostUsd: 0.00046, ethCostUsd: 23.40, savingsUsd: 23.39954, monadGwei: 52, ethGwei: 30, txs: 65 },
  { hour: '13:00', monadCostUsd: 0.00049, ethCostUsd: 25.80, savingsUsd: 25.79951, monadGwei: 57, ethGwei: 34, txs: 72 },
  { hour: '14:00', monadCostUsd: 0.00051, ethCostUsd: 27.20, savingsUsd: 27.19949, monadGwei: 59, ethGwei: 38, txs: 78 },
  { hour: '15:00', monadCostUsd: 0.00048, ethCostUsd: 26.00, savingsUsd: 25.99952, monadGwei: 55, ethGwei: 35, txs: 74 },
  { hour: '16:00', monadCostUsd: 0.00046, ethCostUsd: 24.10, savingsUsd: 24.09954, monadGwei: 53, ethGwei: 31, txs: 66 },
  { hour: '17:00', monadCostUsd: 0.00044, ethCostUsd: 22.30, savingsUsd: 22.29956, monadGwei: 50, ethGwei: 26, txs: 58 },
  { hour: '18:00', monadCostUsd: 0.00043, ethCostUsd: 20.80, savingsUsd: 20.79957, monadGwei: 49, ethGwei: 23, txs: 52 },
  { hour: '19:00', monadCostUsd: 0.00042, ethCostUsd: 19.90, savingsUsd: 19.89958, monadGwei: 48, ethGwei: 21, txs: 49 },
  { hour: '20:00', monadCostUsd: 0.00041, ethCostUsd: 19.10, savingsUsd: 19.09959, monadGwei: 47, ethGwei: 20, txs: 46 },
  { hour: '21:00', monadCostUsd: 0.00040, ethCostUsd: 18.60, savingsUsd: 18.59960, monadGwei: 46, ethGwei: 19, txs: 43 },
  { hour: '22:00', monadCostUsd: 0.00041, ethCostUsd: 18.30, savingsUsd: 18.29959, monadGwei: 48, ethGwei: 18, txs: 41 },
  { hour: '23:00', monadCostUsd: 0.00042, ethCostUsd: 18.50, savingsUsd: 18.49958, monadGwei: 50, ethGwei: 18, txs: 45 },
];

export const GasSavingsView: React.FC<GasSavingsViewProps> = ({ stats, breakdown, onTriggerGasAlert }) => {
  const [simulatedMonthlyTxs, setSimulatedMonthlyTxs] = useState<number>(10000);
  const [monadGasThreshold, setMonadGasThreshold] = useState<number>(75); // gwei
  const [ethGasThreshold, setEthGasThreshold] = useState<number>(35); // gwei
  const [gasAlertSaved, setGasAlertSaved] = useState<boolean>(false);
  const [simulatedSpikeActive, setSimulatedSpikeActive] = useState<boolean>(false);
  const [runwayBudgetUsd, setRunwayBudgetUsd] = useState<number>(1000);
  const [hoveredPoint, setHoveredPoint] = useState<HourlyGasPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [alertChannels, setAlertChannels] = useState<{ slack: boolean; discord: boolean; pagerduty: boolean; circuitBreaker: boolean }>({
    slack: true,
    discord: false,
    pagerduty: true,
    circuitBreaker: true,
  });

  const total24hMonadCost = breakdown.reduce((acc, b) => acc + b.monadCostUsd, 0);
  const total24hEthCost = breakdown.reduce((acc, b) => acc + b.ethEquivalentUsd, 0);
  const total24hSavings = total24hEthCost - total24hMonadCost;

  const total30dSavings = total24hSavings * 30;
  const totalAnnualSavings = total24hSavings * 365;

  // Simulation calculations
  const simMonadCost = simulatedMonthlyTxs * stats.avgGasFeeUsd;
  const simEthCost = simulatedMonthlyTxs * 18.50;
  const simArbCost = simulatedMonthlyTxs * 0.45;
  const simSavings = simEthCost - simMonadCost;

  const handleSaveGasRules = () => {
    setGasAlertSaved(true);
    setTimeout(() => setGasAlertSaved(false), 3000);
  };

  const handleSimulateGasSpike = () => {
    setSimulatedSpikeActive(true);
    if (onTriggerGasAlert) {
      onTriggerGasAlert(
        'Ethereum L1 Gas Spike Detected (48.2 gwei)',
        'Cross-chain CCIP liquidity settlement paused due to high L1 base fees. Monad native micro-rebalances continuing at $0.00045/tx.'
      );
    }
    setTimeout(() => setSimulatedSpikeActive(false), 6000);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>OPERATIONAL EXPENDITURE EFFICIENCY</span>
            <span className="text-slate-600">/</span>
            <span>CAPITAL RETENTION ANALYTICS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Monad Gas Savings & Execution Economics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Detailed auditing of execution fees across ERC-4626 operations, Chainlink Keepers, Functions, and CCIP.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Aggregate Capital Efficiency: 99.98% Savings</span>
        </div>
      </div>

      {/* High-Level Cumulative Savings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Rolling 24h Gas Overhead</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            ${total24hMonadCost.toFixed(4)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            vs ${total24hEthCost.toFixed(2)} on Ethereum L1
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Rolling 24h Capital Retained</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            +${total24hSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono mt-2 block">
            Directly saved from treasury yield
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Projected 30-Day Gas Savings</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            +${total30dSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Retained across all keepup cycles
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Projected Annual Savings</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight tabular-nums">
            +${totalAnnualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            Enables high-frequency micro-compounding
          </span>
        </div>
      </div>

      {/* 24-Hour Interactive Execution Gas Chart with Hover Tooltips */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-0.5">
              <span>HOURLY CAPEX TELEMETRY</span>
              <span className="text-slate-600">/</span>
              <span>24-HOUR ROLLING EXECUTION PROFILE</span>
            </div>
            <h2 className="text-base font-bold text-white">24-Hour Gas Execution Curve & Capital Retention</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full bg-rose-500/80" />
              <span>Ethereum L1 Prohibitive Cost</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Monad Sub-Cent Execution</span>
            </div>
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div 
          className="relative rounded-xl border border-slate-800/80 bg-[#080C16] p-4 pt-6 select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Tooltip Float Box */}
          {hoveredPoint && (
            <div 
              className="absolute z-30 pointer-events-none rounded-lg border border-emerald-500/50 bg-[#0C1424] p-3 shadow-2xl text-[11px] font-mono w-64 backdrop-blur-md transition-all duration-75"
              style={{
                left: `${Math.min(Math.max(tooltipPos.x - 128, 10), 400)}px`,
                top: `${Math.max(tooltipPos.y - 140, 10)}px`,
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-white font-sans text-xs">{hoveredPoint.hour} UTC Epoch</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {hoveredPoint.txs} transactions
                </span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Monad Cost/Tx:</span>
                  <span className="text-emerald-400 font-bold">${hoveredPoint.monadCostUsd.toFixed(5)} ({hoveredPoint.monadGwei} gwei)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ethereum L1 Eq.:</span>
                  <span className="text-rose-400 line-through">${hoveredPoint.ethCostUsd.toFixed(2)} ({hoveredPoint.ethGwei} gwei)</span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                  <span>Batch Monad Total:</span>
                  <span className="text-slate-200">${(hoveredPoint.monadCostUsd * hoveredPoint.txs).toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>Capital Retained:</span>
                  <span>+${(hoveredPoint.savingsUsd * hoveredPoint.txs).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* SVG Visual Bars / Curves */}
          <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 px-1 pb-1">
            {HOURLY_GAS_DATA.map((pt, idx) => {
              const maxL1 = 30; // max scale for L1
              const heightPct = Math.min(100, Math.max(15, (pt.ethCostUsd / maxL1) * 100));
              const isHovered = hoveredPoint?.hour === pt.hour;

              return (
                <div
                  key={pt.hour}
                  onMouseEnter={(e) => {
                    setHoveredPoint(pt);
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
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-t border-x border-emerald-500/30" />
                  )}

                  {/* L1 Equivalent Bar (Height proportion to cost) */}
                  <div
                    className={`w-full rounded-t transition-all duration-150 ${
                      isHovered ? 'bg-rose-500/70' : 'bg-slate-800/70'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />

                  {/* Monad Gas Indicator (Ultra-thin glowing emerald base pill) */}
                  <div 
                    className={`w-full h-1.5 rounded-sm mt-0.5 transition-all duration-150 ${
                      isHovered ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-emerald-500/80'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Hour Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 px-1">
            <span>00:00 UTC</span>
            <span>06:00</span>
            <span>12:00 (Peak London/NY)</span>
            <span>18:00</span>
            <span>23:00 UTC</span>
          </div>
        </div>
      </div>

      {/* Detailed Operations Breakdown Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">24-Hour Operation Cost Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical on-chain gas costs by protocol interaction type
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Based on Monad Block Gas: 50 gwei @ $0.00045/tx avg
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Protocol Operation</th>
                <th className="py-2.5 px-3 text-right">Avg Gas Units</th>
                <th className="py-2.5 px-3 text-right">24h Invocations</th>
                <th className="py-2.5 px-3 text-right">Monad Gas Total</th>
                <th className="py-2.5 px-3 text-right">Ethereum L1 Equivalent</th>
                <th className="py-2.5 px-3 text-right">Net Savings (USD)</th>
                <th className="py-2.5 px-3 text-center">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {breakdown.map((row) => (
                <tr key={row.operation} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-sans text-white font-medium flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{row.operation}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    {row.avgGasUnits.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    {row.calls24h}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                    ${row.monadCostUsd.toFixed(5)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400/80 line-through tabular-nums">
                    ${row.ethEquivalentUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                    +${row.savingsUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      99.98%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Network Gas Price Monitor & Spike Alerts Panel */}
      <div className="rounded-xl border border-amber-500/30 bg-[#0E1526] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Real-Time Network Gas Monitor & Spike Alerts</h2>
              <span className="text-xs font-mono text-slate-400">
                Autonomous keeper triggers automatically pause cross-chain settlement during L1 congestion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onTriggerGasAlert) {
                  onTriggerGasAlert(
                    'Monad Network Load Test (110 gwei simulated)',
                    'Monad gas fee surged to $0.00095/tx due to high epoch activity. Micro-rebalance execution remains 99.95% cheaper than L1.'
                  );
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>Simulate Monad Surge</span>
            </button>
            <button
              onClick={handleSimulateGasSpike}
              disabled={simulatedSpikeActive}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                simulatedSpikeActive
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{simulatedSpikeActive ? 'Simulating Spike...' : 'Simulate L1 Gas Spike'}</span>
            </button>
          </div>
        </div>

        {/* Automated Circuit Breaker Active Warning Banner */}
        {simulatedSpikeActive && (
          <div className="rounded-xl border border-rose-500/60 bg-rose-950/40 p-4 text-xs font-mono space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse" />
                <span>AUTOMATED CIRCUIT BREAKER ACTIVE: CCIP INFLOW ROUTING PAUSED</span>
              </div>
              <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
                TRIGGER: ETH 48.2 GWEI &gt; {ethGasThreshold} GWEI
              </span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Cross-chain minting from Ethereum L1 has been queued to prevent gas-depleting slippage. 
              Native Monad micro-rebalancing continues executing at 400ms intervals with $0.00045 average fee.
            </p>
          </div>
        )}

        {gasAlertSaved && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300 font-mono flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Gas price threshold alert rules saved and dispatched to Smart Alert system.</span>
          </div>
        )}

        {/* Live Gas Price Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-slate-200">Monad L1 Native Base Fee</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                50 gwei (Nominal)
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                $0.00045 <span className="text-xs text-slate-400 font-normal">/ tx</span>
              </span>
              <span className="text-slate-400 text-[11px]">Threshold: {monadGasThreshold} gwei</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={monadGasThreshold}
              onChange={(e) => setMonadGasThreshold(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Alert if Monad gas &gt; {monadGasThreshold} gwei</span>
              <span>Sub-cent safety cap</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold text-slate-200">Ethereum L1 Base Fee (CCIP Bridge)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                simulatedSpikeActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-300'
              }`}>
                {simulatedSpikeActive ? '48.2 gwei (SPIKE ACTIVE)' : '18.4 gwei (Moderate)'}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold tabular-nums ${
                simulatedSpikeActive ? 'text-rose-400' : 'text-slate-200'
              }`}>
                {simulatedSpikeActive ? '$48.50' : '$18.50'} <span className="text-xs text-slate-400 font-normal">/ tx</span>
              </span>
              <span className="text-slate-400 text-[11px]">Threshold: {ethGasThreshold} gwei</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={ethGasThreshold}
              onChange={(e) => setEthGasThreshold(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Alert if L1 gas &gt; {ethGasThreshold} gwei</span>
              <span>Pause CCIP On-Ramp</span>
            </div>
          </div>
        </div>

        {/* Dispatch Channel Routing Options */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-300 mb-2">Automated Alert Dispatch Channels & Invariants</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <label className="flex items-center gap-2 p-2 rounded-lg bg-[#090D16] border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={alertChannels.slack}
                onChange={(e) => setAlertChannels({ ...alertChannels, slack: e.target.checked })}
                className="accent-emerald-500 rounded"
              />
              <span className="text-slate-300">#slack-treasury</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-[#090D16] border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={alertChannels.pagerduty}
                onChange={(e) => setAlertChannels({ ...alertChannels, pagerduty: e.target.checked })}
                className="accent-emerald-500 rounded"
              />
              <span className="text-slate-300">PagerDuty On-Call</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-[#090D16] border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={alertChannels.discord}
                onChange={(e) => setAlertChannels({ ...alertChannels, discord: e.target.checked })}
                className="accent-emerald-500 rounded"
              />
              <span className="text-slate-300">Discord Bot Hook</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg bg-[#090D16] border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={alertChannels.circuitBreaker}
                onChange={(e) => setAlertChannels({ ...alertChannels, circuitBreaker: e.target.checked })}
                className="accent-emerald-500 rounded"
              />
              <span className="text-emerald-400 font-semibold">Auto Circuit Breaker</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSaveGasRules}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Gas Alert Rules</span>
          </button>
        </div>
      </div>

      {/* Interactive Scaling Simulator */}
      <div className="rounded-xl border border-purple-500/30 bg-[#0E1322] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
              Global Scale Projection
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Monthly Transaction Volume Stress Model
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono block">Monthly Net Savings on Monad:</span>
            <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              +${simSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
            </span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-3 bg-[#090D16] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Monthly Automated Transactions:</span>
            <span className="text-purple-300 font-mono font-bold text-sm">
              {simulatedMonthlyTxs.toLocaleString()} txs / month (~{(simulatedMonthlyTxs / 30).toFixed(0)} txs/day)
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={simulatedMonthlyTxs}
            onChange={(e) => setSimulatedMonthlyTxs(parseInt(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1,000 txs (Pilot Vault)</span>
            <span>25,000 txs (Institutional)</span>
            <span>100,000 txs (Global Multi-Vault OS)</span>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-white text-sm">Monad L1 (Deployed)</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              ${simMonadCost.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Sub-cent gas fees allow continuous, friction-free micro-rebalancing and keeper polling every 400ms.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-slate-300 text-sm">Arbitrum One (L2)</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Rollup Overhead
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-300 tabular-nums">
              ${simArbCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Batch post to L1 creates variable gas spikes during Ethereum mainnet congestion.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-rose-400 text-sm">Ethereum Mainnet (L1)</span>
              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Unfeasible
              </span>
            </div>
            <div className="text-2xl font-bold text-rose-400 tabular-nums">
              ${simEthCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Prohibitive gas forces treasuries into passive weekly rebalancing, suffering extreme target drift.
            </p>
          </div>
        </div>
      </div>

      {/* Gas Efficiency Insights & Algorithmic Execution Frontier */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-0.5">
                <span>ALGORITHMIC EXECUTION EFFICIENCY</span>
                <span className="text-slate-600">/</span>
                <span>FEASIBILITY FRONTIER</span>
              </div>
              <h2 className="text-lg font-bold text-white">Gas Efficiency Insights & Capital Retention Modeling</h2>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
            Gas Drag on Gross Yield: 0.002% (Monad)
          </span>
        </div>

        {/* 3 Core Analytical Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">1. Gas Drag vs Yield Ratio</span>
              <span className="text-emerald-400 font-bold">0.002 bps</span>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">
              99.998% <span className="text-xs text-slate-400 font-normal">Yield Retained</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
              On Ethereum L1, gas overhead consumes <strong>78.4%</strong> of gross rebalancing yield. On Monad, 
              gas drag is virtually zero, allowing the protocol to pass 100% of RWA yields to nvUSD holders.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">2. Optimal Rebalance Cadence</span>
              <span className="text-cyan-400 font-bold">Continuous (400ms)</span>
            </div>
            <div className="text-2xl font-bold text-cyan-300 tabular-nums">
              +18 bps <span className="text-xs text-slate-400 font-normal">Alpha Unlocked</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
              Micro-compounding every hour generates <strong>+$14,200/month</strong> in drift reduction alpha. 
              Sub-cent fees turn rebalancing from an expensive chore into an active yield generator.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="font-sans font-semibold text-slate-200">3. CCIP Routing Slippage</span>
              <span className="text-purple-300 font-bold">&lt; 0.01%</span>
            </div>
            <div className="text-2xl font-bold text-purple-300 tabular-nums">
              Instant Peg <span className="text-xs text-slate-400 font-normal">Preservation</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
              Chainlink CCIP lane rate-limiting protects secondary markets from flash liquidity imbalances while 
              batching origin lock-and-mint settlement for maximum efficiency.
            </p>
          </div>
        </div>

        {/* Operational Gas Runway Simulator */}
        <div className="rounded-xl border border-slate-800 bg-[#090D16] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Operational Gas Runway Calculator</h3>
              <p className="text-xs text-slate-400">
                How long a designated gas reserve budget funds 24/7 continuous autonomous keeper execution
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Simulated Gas Budget:</span>
              <span className="text-base font-bold text-emerald-400">${runwayBudgetUsd.toLocaleString()} USD</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={runwayBudgetUsd}
              onChange={(e) => setRunwayBudgetUsd(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$200 (Pilot)</span>
              <span>$1,000 (Recommended Enterprise Buffer)</span>
              <span>$10,000 (Institutional Vault OS)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/20 space-y-1">
              <span className="text-slate-400 text-[11px]">Monad L1 (Deployed)</span>
              <div className="text-xl font-bold text-emerald-400 tabular-nums">
                {((runwayBudgetUsd / 0.00041) / (24 * 365)).toFixed(1)} Years
              </div>
              <span className="text-[10px] text-slate-400">
                {Math.floor(runwayBudgetUsd / 0.00041).toLocaleString()} automated keeper runs
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 space-y-1">
              <span className="text-slate-400 text-[11px]">Arbitrum One (L2)</span>
              <div className="text-xl font-bold text-slate-200 tabular-nums">
                {((runwayBudgetUsd / 0.45) / (24 * 365)).toFixed(2)} Years
              </div>
              <span className="text-[10px] text-slate-400">
                {Math.floor(runwayBudgetUsd / 0.45).toLocaleString()} automated runs
              </span>
            </div>

            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20 space-y-1">
              <span className="text-slate-400 text-[11px]">Ethereum Mainnet (L1)</span>
              <div className="text-xl font-bold text-rose-400 tabular-nums">
                {((runwayBudgetUsd / 18.50) / 24).toFixed(1)} Days
              </div>
              <span className="text-[10px] text-slate-400">
                Only {Math.floor(runwayBudgetUsd / 18.50).toLocaleString()} runs before exhaustion
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Algorithmic Gas Recommendations */}
        <div className="rounded-xl border border-slate-800 bg-[#090D16] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Algorithmic Keeper Optimization Directives</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-800/80 bg-[#0C1220] space-y-1">
              <span className="font-semibold text-slate-200 block">1. Dynamic Upkeep Thresholds</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Keepers dynamically adjust deviation sensitivity from ±2.5% to ±1.5% during high-volatility 
                macro sessions without risking gas exhaustion.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-800/80 bg-[#0C1220] space-y-1">
              <span className="font-semibold text-slate-200 block">2. Single-Slot Pipelined Consensus</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                MonadDb parallel state access ensures zero lock contention during multi-asset swaps, preventing 
                priority fee inflation during protocol harvest calls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
