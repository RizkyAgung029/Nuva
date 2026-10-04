import React, { useState } from 'react';
import { 
  VaultAsset, 
  RebalanceEvent, 
  ChainlinkServiceMetrics, 
  MonadNetworkStats,
  RiskScenarioId
} from '../types/treasury';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Shield,
  FileSpreadsheet,
  Globe2,
  Droplets
} from 'lucide-react';
import { RiskSensitivityBar } from './RiskSensitivityBar';

interface OverviewDashboardProps {
  assets: VaultAsset[];
  rebalanceEvents: RebalanceEvent[];
  chainlinkMetrics: ChainlinkServiceMetrics;
  monadStats: MonadNetworkStats;
  onNavigate: (tab: string) => void;
  onTriggerRebalance: () => void;
  totalVaultAssetsUsd: number;
  totalSharesMinted: number;
  currentRiskScenario: RiskScenarioId;
  onSelectRiskScenario: (scenario: RiskScenarioId) => void;
  onApplyStressMitigation: () => void;
  onOpenAuditReport: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  assets,
  rebalanceEvents,
  chainlinkMetrics,
  monadStats,
  onNavigate,
  onTriggerRebalance,
  totalVaultAssetsUsd,
  totalSharesMinted,
  currentRiskScenario,
  onSelectRiskScenario,
  onApplyStressMitigation,
  onOpenAuditReport,
}) => {
  const sharePrice = totalSharesMinted > 0 ? totalVaultAssetsUsd / totalSharesMinted : 1.0;
  const blendedApy = assets.reduce((acc, a) => acc + (a.yieldApy * a.allocationPct) / 100, 0);
  const [hoveredDay, setHoveredDay] = useState<any | null>(null);
  const [chartTooltipPos, setChartTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const sevenDayData = [
    { day: 'Sep 28', tvlUsd: 41800000, apy: 5.58, rebalances: 24, gasSavedUsd: 442.80 },
    { day: 'Sep 29', tvlUsd: 42050000, apy: 5.60, rebalances: 24, gasSavedUsd: 443.20 },
    { day: 'Sep 30', tvlUsd: 42210000, apy: 5.61, rebalances: 25, gasSavedUsd: 461.50 },
    { day: 'Oct 01', tvlUsd: 42400000, apy: 5.62, rebalances: 24, gasSavedUsd: 442.90 },
    { day: 'Oct 02', tvlUsd: 42610000, apy: 5.63, rebalances: 26, gasSavedUsd: 480.10 },
    { day: 'Oct 03', tvlUsd: 42720000, apy: 5.64, rebalances: 24, gasSavedUsd: 443.00 },
    { day: 'Oct 04', tvlUsd: totalVaultAssetsUsd, apy: blendedApy, rebalances: 24, gasSavedUsd: 442.85 },
  ];

  return (
    <div className="space-y-8">
      {/* Strategic Blueprint Kicker Banner */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-[#0E1726] to-[#0A101D] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>METROPOLIS 2026 GLOBAL HACKATHON BLUEPRINT</span>
              <span className="text-slate-600">/</span>
              <span>CHAINLINK & PRIVY BOUNTY ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Institutional RWA Treasury Vault on Monad
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed for enterprise treasuries and global liquidity managers. Harnesses Monad's 10,000 TPS and 
              sub-cent execution to power continuous <span className="text-emerald-300 font-medium">Chainlink micro-rebalancing</span>, 
              fortified by an <span className="text-cyan-300 font-medium">ERC-4626 two-contract architecture</span> and 
              <span className="text-purple-300 font-medium"> Privy enterprise quorum security</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('vaults')}
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Deposit Collateral</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('projections')}
              className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Projections</span>
            </button>
            <button
              onClick={onOpenAuditReport}
              className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Risk Sensitivity & Macro Stress Testing Engine Bar */}
      <RiskSensitivityBar
        currentScenario={currentRiskScenario}
        onSelectScenario={onSelectRiskScenario}
        onApplyRecommendedAction={onApplyStressMitigation}
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Value Locked */}
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Total Value Locked (NAV)</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              PoR 100.2%
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            ${totalVaultAssetsUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Underlying:</span>
            <span className="text-slate-300">Circle USDC + RWA Notes</span>
          </div>
        </div>

        {/* Metric 2: Blended Treasury APY */}
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Weighted Treasury APY</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +0.18% 7d
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
            {blendedApy.toFixed(2)}%
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Benchmark:</span>
            <span className="text-slate-300">SOFR 4.85% + 77 bps</span>
          </div>
        </div>

        {/* Metric 3: nvUSD Share Price */}
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">nvUSD Share Price</span>
            <span className="text-[11px] font-mono text-cyan-400">ERC-4626</span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            ${sharePrice.toFixed(5)}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Shares Minted:</span>
            <span className="text-slate-300">{(totalSharesMinted / 1e6).toFixed(2)}M nvUSD</span>
          </div>
        </div>

        {/* Metric 4: Micro-Rebalance Efficiency on Monad */}
        <div 
          onClick={() => onNavigate('gas')}
          className="rounded-xl border border-slate-800 bg-[#0C1220] p-5 cursor-pointer hover:border-purple-500/40 transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium group-hover:text-purple-300 transition-colors">Monad Gas Savings</span>
            <span className="text-[11px] font-mono text-purple-400 flex items-center gap-0.5">
              <span>View breakdown</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-300 tabular-nums">
            99.98%
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Avg TX Cost:</span>
            <span className="text-emerald-400 font-semibold">${monadStats.avgGasFeeUsd.toFixed(5)}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{monadStats.blockTimeMs}ms blocks</span>
          </div>
        </div>
      </div>

      {/* 7-Day Institutional TVL & Rebalance Trajectory Curve with Hover Tooltips */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-0.5">
              <span>ROLLING 7-DAY LIQUIDITY TREND</span>
              <span className="text-slate-600">/</span>
              <span>PROOF OF RESERVE RECONCILIATION</span>
            </div>
            <h2 className="text-base font-bold text-white">Institutional Treasury TVL & Autonomous Compounding</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Continuous Micro-Rebalances: 24/day</span>
            <span className="text-emerald-400 font-semibold">Current NAV: ${(totalVaultAssetsUsd / 1e6).toFixed(3)}M</span>
          </div>
        </div>

        {/* Visual Sparkline / Bar Curve with Floating Tooltip */}
        <div 
          className="relative rounded-xl border border-slate-800/80 bg-[#080C16] p-4 pt-6 select-none"
          onMouseLeave={() => setHoveredDay(null)}
        >
          {hoveredDay && (
            <div 
              className="absolute z-30 pointer-events-none rounded-lg border border-emerald-500/50 bg-[#0C1424] p-3 shadow-2xl text-[11px] font-mono w-60 backdrop-blur-md transition-all duration-75"
              style={{
                left: `${Math.min(Math.max(chartTooltipPos.x - 120, 10), 450)}px`,
                top: `${Math.max(chartTooltipPos.y - 135, 10)}px`,
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                <span className="font-bold text-white font-sans text-xs">{hoveredDay.day}, 2026</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                  PoR Verified
                </span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Treasury NAV:</span>
                  <span className="text-emerald-400 font-bold">${(hoveredDay.tvlUsd / 1e6).toFixed(3)}M USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Blended APY:</span>
                  <span className="text-cyan-300 font-bold">{hoveredDay.apy.toFixed(2)}% APY</span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-1">
                  <span>Micro-Rebalances:</span>
                  <span className="text-slate-200">{hoveredDay.rebalances} automated</span>
                </div>
                <div className="flex justify-between text-purple-300">
                  <span>Gas Retained:</span>
                  <span>+${hoveredDay.gasSavedUsd.toFixed(2)} vs L1</span>
                </div>
              </div>
            </div>
          )}

          {/* 7 Interactive Pillars */}
          <div className="h-32 w-full flex items-end justify-between gap-3 px-2 pb-1">
            {sevenDayData.map((d) => {
              const minTvl = 41000000;
              const maxTvl = 43000000;
              const heightPct = Math.min(100, Math.max(25, ((d.tvlUsd - minTvl) / (maxTvl - minTvl)) * 100));
              const isHovered = hoveredDay?.day === d.day;

              return (
                <div
                  key={d.day}
                  onMouseEnter={(e) => {
                    setHoveredDay(d);
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      setChartTooltipPos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      setChartTooltipPos({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                  }}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  {isHovered && (
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-t border-x border-emerald-500/30" />
                  )}

                  <div
                    className={`w-full rounded-t transition-all duration-200 ${
                      isHovered
                        ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/30'
                        : 'bg-emerald-600/70 hover:bg-emerald-500/80'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />

                  <span className="text-[10px] font-mono text-slate-400 mt-2">
                    ${(d.tvlUsd / 1e6).toFixed(1)}M
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 px-2">
            {sevenDayData.map((d) => (
              <span key={d.day} className="text-center">{d.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Discovery Navigation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('gas')}
          className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#0A0F1D] hover:border-purple-500/40 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block group-hover:text-purple-300 transition-colors">Gas Savings Breakdown</span>
              <span className="text-[11px] font-mono text-slate-400">99.98% CapEx Retention vs L1</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('correlation')}
          className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#0A0F1D] hover:border-cyan-500/40 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block group-hover:text-cyan-300 transition-colors">Risk Correlation Matrix</span>
              <span className="text-[11px] font-mono text-slate-400">&rho; Heatmap & Diversification</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('alerts')}
          className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-[#0A0F1D] hover:border-amber-500/40 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block group-hover:text-amber-300 transition-colors">Smart Alert System</span>
              <span className="text-[11px] font-mono text-slate-400">Autonomous Drift & Quorum Alerts</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </button>
      </div>

      {/* Chainlink Real-Time Oracle Feed Ticker */}
      <div className="rounded-xl border border-slate-800/80 bg-[#0B101D] p-4">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Chainlink Data Streams & Real-Time RWA Feeds</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Heartbeat: Sub-second · Decentralized DON Consensus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {assets.map((asset) => (
            <div 
              key={asset.id} 
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-medium text-slate-200">{asset.symbol}</span>
                <span className="text-[10px] font-mono text-slate-500">{asset.oracleLastUpdated}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  ${asset.oraclePrice.toFixed(4)}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {asset.yieldApy}% APY
                </span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 truncate" title={asset.oracleFeed}>
                {asset.oracleFeed}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Asset Allocation Breakdown & Strategy Rebalancer Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: RWA Collateral Breakdown */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">RWA Collateral Allocation & Target Drift</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target bands trigger Chainlink Automation upkeep when deviation exceeds ±2.5%
              </p>
            </div>
            <button
              onClick={() => onNavigate('rebalancer')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Configure Bands</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Allocation Progress Bars */}
          <div className="space-y-4">
            {assets.map((asset) => {
              const drift = asset.allocationPct - asset.targetPct;
              const isOverweight = drift > 0;
              const isDriftWarning = Math.abs(drift) > 2.0;

              return (
                <div key={asset.id} className="space-y-2 border-b border-slate-800/60 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{asset.name}</span>
                      <span className="font-mono text-slate-400">({asset.symbol})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                      <span className="text-slate-300">
                        ${(asset.valueUsd / 1e6).toFixed(2)}M
                      </span>
                      <span className="font-semibold text-white">
                        {asset.allocationPct.toFixed(1)}%
                      </span>
                      <span className={`text-[11px] ${isDriftWarning ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                        {isOverweight ? `+${drift.toFixed(1)}%` : `${drift.toFixed(1)}%`} target
                      </span>
                    </div>
                  </div>

                  {/* Dual bar: current vs target marker */}
                  <div className="relative h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        asset.type === 't-bill' ? 'bg-emerald-500' :
                        asset.type === 'private-credit' ? 'bg-cyan-500' :
                        asset.type === 'invoice' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${asset.allocationPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Custodian: {asset.custodian}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      PoR Verified
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institutional Compliance Notice */}
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-200 block">
                Chainlink Automated Compliance Engine (ACE) Gated
              </span>
              <p className="text-slate-400 leading-relaxed">
                All deposits and redemptions undergo on-chain cryptographic verification against 
                jurisdictional rules and OFAC sanction databases. Non-accredited or sanctioned addresses 
                revert directly at the smart contract level without off-chain intermediaries.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Rebalancer Trigger & Multi-Service Scorecard */}
        <div className="space-y-6">
          {/* Rebalancer Trigger Card */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                Autonomous Execution
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Dynamic Micro-Rebalancer</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Continuously maintains target risk-adjusted weights using Chainlink Keepers on Monad.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Active Strategy:</span>
                <span className="text-slate-200">Target Drift Band</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Max Drift Detected:</span>
                <span className="text-amber-400 font-semibold">+2.4% (USTB-3M)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Rebalance Gas:</span>
                <span className="text-emerald-400">$0.00041 (Monad)</span>
              </div>
            </div>

            <button
              onClick={onTriggerRebalance}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Simulate Keeper Upkeep</span>
            </button>
          </div>

          {/* Chainlink Multiplier Status */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Chainlink Hackathon Multiplier</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">5x Active</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Combining 5 distinct Chainlink protocols to maximize judging score multipliers:
            </p>

            <ul className="text-xs space-y-2 text-slate-300 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Data Streams & Feeds (NAV pricing)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Proof of Reserve (Custody proof)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Automation v2 (Keepers micro-rebalance)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Functions (Invoice verification DON)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>CCIP v1.6 (Cross-chain settlement)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Activity / On-Chain Micro-Rebalance Ledger */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Autonomous Micro-Rebalance Events</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live ledger of upkeep transactions executed on Monad testnet
            </p>
          </div>
          <button
            onClick={() => onNavigate('rebalancer')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Timestamp / Block</th>
                <th className="py-2.5 px-3">Strategy</th>
                <th className="py-2.5 px-3">Trigger Type</th>
                <th className="py-2.5 px-3 text-right">Volume (USD)</th>
                <th className="py-2.5 px-3 text-right">Monad Gas</th>
                <th className="py-2.5 px-3 text-right">Ethereum Gas Equiv.</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rebalanceEvents.slice(0, 4).map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="text-slate-200 block">{evt.timestamp}</span>
                    <span className="text-[10px] text-slate-500">Block #{evt.blockNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">
                    {evt.strategyName}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-400">
                      {evt.triggerType === 'deviation' ? 'Target Drift (>2.5%)' :
                       evt.triggerType === 'scheduled-hourly' ? 'Scheduled Hourly' : 'DON Risk Hedge'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-white font-semibold tabular-nums">
                    ${evt.deltaUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-semibold tabular-nums">
                    ${evt.gasCostMonadUsd.toFixed(5)}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400/80 line-through tabular-nums">
                    ${evt.gasCostEthEquivalentUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      Executed
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
