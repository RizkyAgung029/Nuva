import React from 'react';
import { RiskScenario, RiskScenarioId } from '../types/treasury';
import { ShieldAlert, Zap, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const RISK_SCENARIOS: Record<RiskScenarioId, RiskScenario> = {
  baseline: {
    id: 'baseline',
    name: 'Nominal Baseline',
    tagline: 'Standard macro environment. SOFR at 4.85%, stable corporate credit spreads.',
    sofrShiftBps: 0,
    creditSpreadShiftBps: 0,
    liquidityDrainPct: 0,
    blendedApyDelta: 0,
    var99Pct: 1.4,
    liquidityCoverageRatio: 142,
    recommendedAction: 'Maintain target weights; execute routine hourly yield harvest upkeep.',
  },
  'rate-hike': {
    id: 'rate-hike',
    name: 'Fed Rate Hike (+100 bps)',
    tagline: 'Hawkish surprise. Short-end yields spike, inverted yield curve steepens.',
    sofrShiftBps: 100,
    creditSpreadShiftBps: 15,
    liquidityDrainPct: 5,
    blendedApyDelta: 0.93,
    var99Pct: 2.1,
    liquidityCoverageRatio: 135,
    recommendedAction: 'Rotate $1.4M USDC buffer into USTB-3M to lock in 6.22% risk-free rate.',
  },
  'credit-widening': {
    id: 'credit-widening',
    name: 'Credit Spread Widening',
    tagline: 'Recessionary stress. Corporate default risk premiums widen by +175 bps.',
    sofrShiftBps: -25,
    creditSpreadShiftBps: 175,
    liquidityDrainPct: 12,
    blendedApyDelta: -0.67,
    var99Pct: 4.8,
    liquidityCoverageRatio: 118,
    recommendedAction: 'Trigger Chainlink Functions hedge: de-risk 40% of trade receivables into T-Bills.',
  },
  'liquidity-crunch': {
    id: 'liquidity-crunch',
    name: 'Liquidity Run Shock',
    tagline: 'Systemic banking panic. 35% concurrent institutional redemption scenario.',
    sofrShiftBps: 50,
    creditSpreadShiftBps: 220,
    liquidityDrainPct: 35,
    blendedApyDelta: -1.15,
    var99Pct: 6.4,
    liquidityCoverageRatio: 104,
    recommendedAction: 'Enforce Privy 2-of-3 Quorum timelock on redemptions >$100k; expand cash buffer to 22%.',
  },
};

interface RiskSensitivityBarProps {
  currentScenario: RiskScenarioId;
  onSelectScenario: (scenario: RiskScenarioId) => void;
  onApplyRecommendedAction: () => void;
}

export const RiskSensitivityBar: React.FC<RiskSensitivityBarProps> = ({
  currentScenario,
  onSelectScenario,
  onApplyRecommendedAction,
}) => {
  const scenario = RISK_SCENARIOS[currentScenario];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-mono uppercase font-bold text-white tracking-wider">
            Risk Sensitivity & Macro Stress Testing Engine
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            · Simulated In-Flight Shocks
          </span>
        </div>

        {/* Scenario Segmented Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          {(Object.keys(RISK_SCENARIOS) as RiskScenarioId[]).map((key) => {
            const sc = RISK_SCENARIOS[key];
            const isSelected = currentScenario === key;
            return (
              <button
                key={key}
                onClick={() => onSelectScenario(key)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-3 text-xs font-mono">
          <span className="text-slate-500 block mb-0.5">Macro Yield Impact</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold tabular-nums ${
              scenario.blendedApyDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {scenario.blendedApyDelta >= 0 ? `+${scenario.blendedApyDelta.toFixed(2)}%` : `${scenario.blendedApyDelta.toFixed(2)}%`}
            </span>
            <span className="text-[10px] text-slate-400">
              ({scenario.sofrShiftBps >= 0 ? `+${scenario.sofrShiftBps}` : scenario.sofrShiftBps} bps SOFR)
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-3 text-xs font-mono">
          <span className="text-slate-500 block mb-0.5">Value at Risk (99% 1-Day VaR)</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold tabular-nums ${
              scenario.var99Pct > 3 ? 'text-rose-400' : scenario.var99Pct > 2 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {scenario.var99Pct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400">
              {scenario.var99Pct > 3 ? 'Elevated' : 'Within Limits'}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-3 text-xs font-mono">
          <span className="text-slate-500 block mb-0.5">Liquidity Coverage Ratio (LCR)</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold tabular-nums ${
              scenario.liquidityCoverageRatio < 110 ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {scenario.liquidityCoverageRatio}%
            </span>
            <span className="text-[10px] text-slate-400">Basel III &ge; 100%</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-3 text-xs font-mono">
          <span className="text-slate-500 block mb-0.5">Credit Spread Shift</span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-200 tabular-nums">
              +{scenario.creditSpreadShiftBps} bps
            </span>
            <span className="text-[10px] text-slate-400">
              OAS benchmark
            </span>
          </div>
        </div>
      </div>

      {/* Scenario Recommendation Bar */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-amber-300 block font-mono text-[11px] uppercase tracking-wide">
            Automated Keeper Recommendation ({scenario.name})
          </span>
          <p className="text-slate-300 text-xs">
            {scenario.recommendedAction}
          </p>
        </div>

        {currentScenario !== 'baseline' && (
          <button
            onClick={onApplyRecommendedAction}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Apply Stress Mitigation</span>
          </button>
        )}
      </div>
    </div>
  );
};
