import React, { useState } from 'react';
import { CorrelationPair, RiskScenarioId } from '../types/treasury';
import { 
  GitCommit, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface AssetRiskCorrelationProps {
  pairs: CorrelationPair[];
  currentScenario: RiskScenarioId;
}

export const AssetRiskCorrelation: React.FC<AssetRiskCorrelationProps> = ({
  pairs,
  currentScenario,
}) => {
  const assetList = ['USTB-3M', 'IGCP-A1', 'TK-INVOICE', 'USDC', 'SPY Benchmark'];
  const [selectedPair, setSelectedPair] = useState<CorrelationPair>(pairs[0]);

  // Helper to lookup correlation between two assets
  const getPair = (a: string, b: string): { coeff: number; cov: number; effect: string } => {
    if (a === b) return { coeff: 1.0, cov: 0.005, effect: 'Identical' };
    const found = pairs.find(
      (p) => (p.assetA === a && p.assetB === b) || (p.assetA === b && p.assetB === a)
    );
    if (!found) return { coeff: 0, cov: 0, effect: 'Neutral' };

    const isStress = currentScenario !== 'baseline';
    const effectiveCoeff = isStress ? found.stressCoefficient : found.coefficient;

    return {
      coeff: effectiveCoeff,
      cov: found.covariance,
      effect: found.diversificationEffect,
    };
  };

  const getColorClass = (val: number) => {
    if (val === 1.0) return 'bg-slate-800 text-slate-400 font-normal';
    if (val < -0.2) return 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30';
    if (val < 0.15) return 'bg-cyan-500/15 text-cyan-300 font-medium';
    if (val < 0.45) return 'bg-amber-500/15 text-amber-300 font-medium';
    return 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30';
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>PORTFOLIO COVARIANCE & TAIL RISK</span>
            <span className="text-slate-600">/</span>
            <span>PEARSON CORRELATION MATRIX</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Asset Risk Correlation & Diversification Matrix
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quantitative analysis of cross-asset interdependencies, portfolio volatility mitigation, and flight-to-quality dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-xs font-mono text-cyan-300">
          <Activity className="h-3.5 w-3.5" />
          <span>Portfolio Sharpe Ratio: 2.84 · Volatility: 1.82%</span>
        </div>
      </div>

      {/* Portfolio Risk Diagnostic Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Portfolio Diversification Ratio</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            1.44x
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Sub-additive risk benefit
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Annualized Volatility (&sigma;)</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            1.82%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Ultra-low standard deviation
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Max Historical Drawdown</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight tabular-nums">
            -0.28%
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Buffered by short duration T-Bills
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Correlation Shift Mode</span>
          <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight capitalize">
            {currentScenario}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            {currentScenario !== 'baseline' ? 'Stress flight active' : 'Normal market regime'}
          </span>
        </div>
      </div>

      {/* Main Heatmap Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Heatmap (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Cross-Asset Heatmap (&rho;)</h2>
            <span className="text-[11px] font-mono text-slate-400">Click any cell to inspect pair</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr>
                  <th className="p-2 text-left text-slate-400"></th>
                  {assetList.map((a) => (
                    <th key={a} className="p-2 text-slate-300 font-semibold text-[11px]">
                      {a}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assetList.map((rowAsset) => (
                  <tr key={rowAsset}>
                    <td className="p-2 text-left font-sans text-slate-300 font-medium text-xs whitespace-nowrap">
                      {rowAsset}
                    </td>
                    {assetList.map((colAsset) => {
                      const data = getPair(rowAsset, colAsset);
                      const isSelf = rowAsset === colAsset;
                      const isCurrentPair =
                        (selectedPair.assetA === rowAsset && selectedPair.assetB === colAsset) ||
                        (selectedPair.assetA === colAsset && selectedPair.assetB === rowAsset);

                      return (
                        <td key={colAsset} className="p-1">
                          <button
                            onClick={() => {
                              if (!isSelf) {
                                const found = pairs.find(
                                  (p) =>
                                    (p.assetA === rowAsset && p.assetB === colAsset) ||
                                    (p.assetA === colAsset && p.assetB === rowAsset)
                                );
                                if (found) setSelectedPair(found);
                              }
                            }}
                            disabled={isSelf}
                            className={`w-full py-2.5 rounded text-xs transition-all tabular-nums cursor-pointer ${
                              getColorClass(data.coeff)
                            } ${isCurrentPair ? 'ring-2 ring-white shadow-lg' : ''}`}
                          >
                            {data.coeff >= 0 ? `+${data.coeff.toFixed(2)}` : data.coeff.toFixed(2)}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
              <span>Negative (&le; -0.2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-cyan-500/20" />
              <span>Uncorrelated (-0.2 to 0.15)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500/20" />
              <span>Moderate (0.15 to 0.45)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-500/20 border border-rose-500/50" />
              <span>High (&gt; 0.45)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Pair Deep-Dive Inspector (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
              Pairwise Risk Inspector
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {selectedPair.assetA} &times; {selectedPair.assetB}
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex justify-between items-center">
              <span className="text-slate-400">Baseline Pearson Coefficient (&rho;):</span>
              <span className="text-white font-bold text-sm">
                {selectedPair.coefficient >= 0 ? `+${selectedPair.coefficient.toFixed(2)}` : selectedPair.coefficient.toFixed(2)}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex justify-between items-center">
              <span className="text-slate-400">Stress Regime Coefficient:</span>
              <span className="text-amber-400 font-bold text-sm">
                {selectedPair.stressCoefficient >= 0 ? `+${selectedPair.stressCoefficient.toFixed(2)}` : selectedPair.stressCoefficient.toFixed(2)}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex justify-between items-center">
              <span className="text-slate-400">Pairwise Covariance (&sigma;):</span>
              <span className="text-slate-200 font-bold text-sm">
                {selectedPair.covariance.toFixed(4)}
              </span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex justify-between items-center">
              <span className="text-slate-400">Diversification Benefit:</span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                selectedPair.diversificationEffect === 'high'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {selectedPair.diversificationEffect} Diversifier
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 text-xs space-y-2">
            <span className="font-semibold text-white block">Institutional Risk Takeaway</span>
            <p className="text-slate-400 leading-relaxed font-sans">
              {selectedPair.coefficient < 0 ? (
                <>
                  Holding <strong className="text-white">{selectedPair.assetA}</strong> alongside <strong className="text-white">{selectedPair.assetB}</strong> creates negative covariance. 
                  During market downturns, price gains in one leg buffer drawdowns in the other, stabilizing the nvUSD NAV.
                </>
              ) : (
                <>
                  <strong className="text-white">{selectedPair.assetA}</strong> and <strong className="text-white">{selectedPair.assetB}</strong> exhibit moderate positive co-movement. 
                  Chainlink micro-rebalancing maintains strict tranche caps to prevent concentration risk.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
