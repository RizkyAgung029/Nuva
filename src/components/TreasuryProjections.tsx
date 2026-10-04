import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Zap, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  HelpCircle,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface TreasuryProjectionsProps {
  currentPrincipalUsd: number;
  currentBlendedApy: number;
}

export const TreasuryProjections: React.FC<TreasuryProjectionsProps> = ({
  currentPrincipalUsd,
  currentBlendedApy,
}) => {
  const [initialCapital, setInitialCapital] = useState<number>(currentPrincipalUsd);
  const [projectedApy, setProjectedApy] = useState<number>(currentBlendedApy);
  const [selectedHorizonYears, setSelectedHorizonYears] = useState<number>(1); // 1 year default
  const [reinvestmentBonusBps, setReinvestmentBonusBps] = useState<number>(18); // 18 bps alpha from micro-rebalancing

  const periods = [
    { label: '3 Months', months: 3, years: 0.25 },
    { label: '6 Months', months: 6, years: 0.5 },
    { label: '1 Year', months: 12, years: 1.0 },
    { label: '2 Years', months: 24, years: 2.0 },
    { label: '3 Years', months: 36, years: 3.0 },
    { label: '5 Years', months: 60, years: 5.0 },
  ];

  // Compound calculations
  // Effective rate with micro-rebalancing bonus
  const rHourly = (projectedApy + reinvestmentBonusBps / 100) / 100;
  const rMonthly = projectedApy / 100;

  // Calculates future value with n compoundings per year
  const calculateFV = (P: number, r: number, n: number, t: number) => {
    return P * Math.pow(1 + r / n, n * t);
  };

  const projectionRows = periods.map((p) => {
    // Hourly on Monad (8760 hours/year)
    const fvHourly = calculateFV(initialCapital, rHourly, 8760, p.years);
    // Monthly traditional (12 months/year)
    const fvMonthly = calculateFV(initialCapital, rMonthly, 12, p.years);

    const gainHourly = fvHourly - initialCapital;
    const gainMonthly = fvMonthly - initialCapital;
    const alphaAdvantage = fvHourly - fvMonthly;

    return {
      period: p.label,
      months: p.months,
      years: p.years,
      navHourly: fvHourly,
      navMonthly: fvMonthly,
      gainHourly,
      gainMonthly,
      alphaAdvantage,
    };
  });

  const [hoveredRow, setHoveredRow] = useState<typeof projectionRows[0] | null>(null);

  const activeHorizonRow = projectionRows.find((r) => r.years === selectedHorizonYears) || projectionRows[2];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>INSTITUTIONAL FORECASTING</span>
            <span className="text-slate-600">/</span>
            <span>HIGH-FREQUENCY COMPOUNDING ALPHA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Corporate Treasury Growth & Yield Projections
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate portfolio returns under Monad's hourly micro-compounding versus conventional monthly batching.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Hourly Reinvestment Yield Advantage: +{reinvestmentBonusBps} bps</span>
        </div>
      </div>

      {/* Interactive Simulation Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-slate-800 bg-[#0C1220] p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Initial Treasury Capital</span>
            <span className="font-mono text-white font-bold">${(initialCapital / 1e6).toFixed(1)}M USD</span>
          </div>
          <input
            type="range"
            min="5000000"
            max="100000000"
            step="1000000"
            value={initialCapital}
            onChange={(e) => setInitialCapital(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>$5M (Seed Treasury)</span>
            <span>$50M</span>
            <span>$100M (Enterprise)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Projected Benchmark APY</span>
            <span className="font-mono text-emerald-400 font-bold">{projectedApy.toFixed(2)}% APY</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="9.0"
            step="0.05"
            value={projectedApy}
            onChange={(e) => setProjectedApy(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>3.0% (Defensive)</span>
            <span>5.62% (Current)</span>
            <span>9.0% (High-Yield RWA)</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Micro-Rebalancing Drift Alpha</span>
            <span className="font-mono text-cyan-400 font-bold">+{reinvestmentBonusBps} bps</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={reinvestmentBonusBps}
            onChange={(e) => setReinvestmentBonusBps(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>+5 bps (Passive)</span>
            <span>+18 bps (Autonomous Keepers)</span>
            <span>+50 bps (Max Drift)</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Callout Cards for Active Horizon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Projected NAV ({activeHorizonRow.period})
          </span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            ${(activeHorizonRow.navHourly / 1e6).toFixed(3)}M
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            +${(activeHorizonRow.gainHourly / 1e6).toFixed(3)}M cumulative gain
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Monad Micro-Compounding Alpha
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            +${activeHorizonRow.alphaAdvantage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Pure excess yield vs monthly batching
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Effective Compounded APY
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight tabular-nums">
            {(Math.pow(1 + rHourly / 8760, 8760) * 100 - 100).toFixed(3)}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Continuous APY compound rate
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Monad Gas Overhead ({activeHorizonRow.period})
          </span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight tabular-nums">
            ${(activeHorizonRow.years * 365 * 24 * 0.00041).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            vs ${(activeHorizonRow.years * 365 * 24 * 18.5).toLocaleString(undefined, { maximumFractionDigits: 0 })} on L1
          </span>
        </div>
      </div>

      {/* Visual Horizon Selector & Growth Curves */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Horizon Growth Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select horizon to inspect projected asset valuation curve
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {periods.map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedHorizonYears(p.years)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedHorizonYears === p.years
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Growth Trajectory Chart with Hover Tooltips */}
        <div className="relative rounded-xl border border-slate-800 bg-[#090D16] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            <span className="font-semibold text-white">Projected NAV Trajectory (Monad Continuous vs Traditional Monthly)</span>
            <span className="text-[11px] font-mono text-cyan-400">Hover any pillar for detailed valuation</span>
          </div>

          <div className="grid grid-cols-6 gap-3 items-end h-44 pt-6 pb-2 px-2 border-b border-slate-800">
            {projectionRows.map((row) => {
              const maxNav = projectionRows[projectionRows.length - 1].navHourly;
              const heightPct = Math.max(25, (row.navHourly / maxNav) * 100);
              const isSelected = row.years === selectedHorizonYears;
              const isHovered = hoveredRow?.period === row.period;

              return (
                <div
                  key={row.period}
                  onMouseEnter={() => setHoveredRow(row)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => setSelectedHorizonYears(row.years)}
                  className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  {/* Tooltip Float Box */}
                  {isHovered && (
                    <div className="absolute -top-24 z-20 w-48 rounded-lg border border-emerald-500/50 bg-[#0E1526] p-2.5 shadow-2xl text-[11px] font-mono pointer-events-none transition-all">
                      <div className="text-white font-bold font-sans border-b border-slate-800 pb-1 mb-1">
                        {row.period} Projection
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Monad NAV:</span>
                        <span className="text-emerald-400 font-bold">${(row.navHourly / 1e6).toFixed(3)}M</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Monthly NAV:</span>
                        <span className="text-slate-200">${(row.navMonthly / 1e6).toFixed(3)}M</span>
                      </div>
                      <div className="flex justify-between text-cyan-400 pt-1 border-t border-slate-800/80">
                        <span>Alpha Gain:</span>
                        <span className="font-bold">+${row.alphaAdvantage.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  )}

                  {/* Dual Bar: Monad (emerald) vs Monthly (blue) */}
                  <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                    {/* Monthly bar */}
                    <div 
                      className={`w-3 rounded-t transition-all duration-300 ${
                        isSelected || isHovered ? 'bg-blue-400/80' : 'bg-slate-700'
                      }`}
                      style={{ height: `${heightPct * 0.96}%` }}
                    />
                    {/* Monad Hourly bar */}
                    <div 
                      className={`w-4 rounded-t transition-all duration-300 ${
                        isSelected || isHovered
                          ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/20' 
                          : 'bg-emerald-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className={`text-[10px] font-mono mt-2 transition-colors ${
                    isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {row.period}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded bg-emerald-500" />
                <span>Monad Hourly Compounding</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded bg-blue-500" />
                <span>Conventional Monthly Batching</span>
              </span>
            </div>
            <span>Values in USD Millions ($M)</span>
          </div>
        </div>

        {/* Growth Bar Representation */}
        <div className="space-y-4 pt-2">
          {projectionRows.map((row) => {
            const isSelected = row.years === selectedHorizonYears;
            const pctGrowth = (row.gainHourly / initialCapital) * 100;

            return (
              <div
                key={row.period}
                onMouseEnter={() => setHoveredRow(row)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => setSelectedHorizonYears(row.years)}
                className={`rounded-lg border p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-slate-800/80 bg-[#090D16] hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-sans text-sm">{row.period}</span>
                    <span className="text-[11px] font-mono text-slate-500">({row.months} Months)</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Active Horizon
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
                    <span className="text-slate-400">
                      Standard Monthly: ${(row.navMonthly / 1e6).toFixed(3)}M
                    </span>
                    <span className="text-white font-bold">
                      Monad Hourly: ${(row.navHourly / 1e6).toFixed(3)}M
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      (+{pctGrowth.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, 15 + pctGrowth * 1.8)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
                  <span>Interest Generated: <strong className="text-emerald-300">${row.gainHourly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></span>
                  <span className="text-cyan-400 font-semibold">
                    Monad Micro-Rebalance Bonus: +${row.alphaAdvantage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Tabular Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Full Forecast Matrix: Monad vs Traditional DeFi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Forecast Period</th>
                <th className="py-2.5 px-3 text-right">Initial Principal</th>
                <th className="py-2.5 px-3 text-right">Traditional Monthly NAV</th>
                <th className="py-2.5 px-3 text-right">Monad Continuous NAV</th>
                <th className="py-2.5 px-3 text-right">Micro-Rebalance Gain</th>
                <th className="py-2.5 px-3 text-right">Monad Gas Spent</th>
                <th className="py-2.5 px-3 text-right">Ethereum Gas Equiv.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {projectionRows.map((r) => (
                <tr key={r.period} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3 font-sans text-slate-200 font-semibold">{r.period}</td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    ${(initialCapital / 1e6).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    ${(r.navMonthly / 1e6).toFixed(3)}M
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                    ${(r.navHourly / 1e6).toFixed(3)}M
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                    +${r.alphaAdvantage.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-3 text-right text-purple-300 tabular-nums">
                    ${(r.years * 365 * 24 * 0.00041).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400/80 line-through tabular-nums">
                    ${(r.years * 365 * 24 * 18.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
