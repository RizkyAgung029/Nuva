import React, { useState } from 'react';
import { LiquidityPool, UserLpPosition } from '../types/treasury';
import { 
  Droplets, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Plus, 
  Sliders, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Layers,
  Sparkles,
  Percent,
  AlertCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface LiquidityProvisioningToolProps {
  pools: LiquidityPool[];
  userPositions: UserLpPosition[];
  onAddPosition?: (position: UserLpPosition) => void;
  onClaimFees?: (positionId: string) => void;
  onWithdrawPosition?: (positionId: string) => void;
}

export const LiquidityProvisioningTool: React.FC<LiquidityProvisioningToolProps> = ({
  pools,
  userPositions,
  onAddPosition,
  onClaimFees,
  onWithdrawPosition,
}) => {
  const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0]?.id || 'pool-nvusd-usdc');
  const [depositAmountUsd, setDepositAmountUsd] = useState<number>(100000);
  const [rangePreset, setRangePreset] = useState<'tight' | 'moderate' | 'full'>('tight');
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState<string | null>(null);

  const activePool = pools.find((p) => p.id === selectedPoolId) || pools[0];
  const totalSecondaryTvl = pools.reduce((acc, p) => acc + p.tvlUsd, 0);
  const totalVolume24h = pools.reduce((acc, p) => acc + p.volume24hUsd, 0);
  const totalUserLpDeposited = userPositions.reduce((acc, p) => acc + p.depositedAmountUsd, 0);
  const totalUnclaimedFees = userPositions.reduce((acc, p) => acc + p.unclaimedFeesUsd, 0);

  const rangeBounds = {
    tight: { min: 0.9995, max: 1.0005, label: 'Pegged Concentration (0.9995 - 1.0005)', desc: '100x capital multiplier for 1:1 RWA backing' },
    moderate: { min: 0.9950, max: 1.0050, label: 'Moderate Band (0.9950 - 1.0050)', desc: 'Buffers against macro volatility spikes' },
    full: { min: 0.9000, max: 1.1000, label: 'Full Spectrum (0.9000 - 1.1000)', desc: 'Passive range without rebalancing upkeep' },
  }[rangePreset];

  const handleDepositLiquidity = () => {
    setIsProvisioning(true);
    setProvisionSuccessMsg(null);

    setTimeout(() => {
      setIsProvisioning(false);
      const halfAmount = depositAmountUsd / 2;
      const newPos: UserLpPosition = {
        id: `pos-${Math.floor(890 + Math.random() * 100)}`,
        poolId: activePool.id,
        pair: activePool.pair,
        depositedAmountUsd: depositAmountUsd,
        tokenAAmount: halfAmount,
        tokenBAmount: halfAmount,
        unclaimedFeesUsd: 0,
        minPrice: rangeBounds.min,
        maxPrice: rangeBounds.max,
        currentPrice: 1.0000,
        inRange: true,
        createdAt: new Date().toISOString().split('T')[0],
      };

      if (onAddPosition) {
        onAddPosition(newPos);
      }

      setProvisionSuccessMsg(
        `Successfully provisioned $${depositAmountUsd.toLocaleString()} liquidity into ${activePool.pair} (${activePool.dex}). Earning ${activePool.totalApy.toFixed(2)}% APY.`
      );
      setTimeout(() => setProvisionSuccessMsg(null), 6000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>SECONDARY MARKET INFRASTRUCTURE</span>
            <span className="text-slate-600">/</span>
            <span>nvUSD CONCENTRATED LIQUIDITY OS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Secondary Liquidity Provisioning & AMM Yield Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deploy institutional capital into concentrated liquidity pools across Monad DEXs to capture combined RWA vault yield and trading fees.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono text-emerald-400">
          <Droplets className="h-3.5 w-3.5" />
          <span>Double-Dip Yield: 5.64% RWA + Up to 12.4% LP Fee APY</span>
        </div>
      </div>

      {/* High-Level Secondary Liquidity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Secondary nvUSD TVL</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            ${(totalSecondaryTvl / 1e6).toFixed(2)}M
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            Across 3 Monad DEX protocols
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">24h Secondary Trading Volume</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight tabular-nums">
            ${(totalVolume24h / 1e6).toFixed(2)}M
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Tight peg arbitrage efficiency
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Your Active LP Capital</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight tabular-nums">
            ${(totalUserLpDeposited / 1e6).toFixed(2)}M
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            {userPositions.length} active LP positions
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Accumulated Fee Yield</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            +${totalUnclaimedFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-2 block">
            Claimable instant settlement
          </span>
        </div>
      </div>

      {/* Active Secondary AMM Pools */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Active nvUSD Liquidity Pools on Monad</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any pool to configure concentrated liquidity ranges and deposit capital
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Monad Swap Gas: ~$0.00030 per swap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 font-mono text-xs">
          {pools.map((pool) => {
            const isSelected = selectedPoolId === pool.id;
            return (
              <div
                key={pool.id}
                onClick={() => setSelectedPoolId(pool.id)}
                className={`rounded-xl border p-5 space-y-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-[#090D16] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-white text-base">{pool.pair}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                    {(pool.feeTierPct * 100).toFixed(0)} bps Fee
                  </span>
                </div>

                <div className="text-[11px] font-sans text-slate-400">{pool.dex}</div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pool TVL:</span>
                    <span className="text-slate-200 font-bold">${(pool.tvlUsd / 1e6).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">24h Volume:</span>
                    <span className="text-slate-200">${(pool.volume24hUsd / 1e6).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Underlying RWA APY:</span>
                    <span className="text-emerald-400 font-bold">{pool.vaultYieldApy.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AMM Swap Fee APY:</span>
                    <span className="text-cyan-300 font-bold">+{pool.lpFeeApy.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/60 pt-1 font-bold text-sm">
                    <span className="text-white">Blended LP APY:</span>
                    <span className="text-emerald-400">{pool.totalApy.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                  <span>IL Risk: <strong className="text-emerald-400 capitalize">{pool.impermanentLossRisk}</strong></span>
                  <span className={isSelected ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                    {isSelected ? '✓ Selected' : 'Click to Configure'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Liquidity Provisioning Workstation */}
      <div className="rounded-xl border border-emerald-500/30 bg-[#0E1526] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-400" />
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                Concentrated Liquidity Range Configuration
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Provision Liquidity into {activePool.pair}
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            DEX: {activePool.dex}
          </span>
        </div>

        {provisionSuccessMsg && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{provisionSuccessMsg}</span>
            </div>
            <button onClick={() => setProvisionSuccessMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="text-slate-300 font-sans font-medium block mb-1.5">Concentrated Range Preset</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['tight', 'moderate', 'full'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setRangePreset(preset)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-colors ${
                      rangePreset === preset
                        ? 'border-emerald-500 bg-emerald-950/30 text-white font-bold'
                        : 'border-slate-800 bg-[#090D16] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block capitalize font-sans">{preset} Band</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {preset === 'tight' ? '±0.05% (Max Multiplier)' : preset === 'moderate' ? '±0.5% (Balanced)' : 'Full Spectrum'}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-2">
                Selected: <strong>{rangeBounds.label}</strong> — {rangeBounds.desc}.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-sans font-medium block mb-1.5">Total Capital to Deploy (USD)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={depositAmountUsd}
                  onChange={(e) => setDepositAmountUsd(Math.max(1000, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-[#090D16] border border-slate-800 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400 text-xs">USD</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-[11px]">
                <span className="text-slate-500">Quick amounts:</span>
                <button onClick={() => setDepositAmountUsd(50000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$50k</button>
                <button onClick={() => setDepositAmountUsd(100000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$100k</button>
                <button onClick={() => setDepositAmountUsd(500000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$500k</button>
                <button onClick={() => setDepositAmountUsd(1000000)} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer">$1.0M</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-[#090D16] rounded-lg border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500 block">50% Token A:</span>
                <span className="text-white font-bold">${(depositAmountUsd / 2).toLocaleString()} nvUSD</span>
              </div>
              <div>
                <span className="text-slate-500 block">50% Token B:</span>
                <span className="text-white font-bold">${(depositAmountUsd / 2).toLocaleString()} {activePool.tokenB}</span>
              </div>
            </div>
          </div>

          {/* Yield Projection Card */}
          <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-sans font-semibold text-slate-200 block mb-2">
                Yield Accrual Simulation
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Vault RWA APY:</span>
                  <span className="text-emerald-400 font-bold">{activePool.vaultYieldApy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">AMM Swap Fee APY:</span>
                  <span className="text-cyan-300 font-bold">+{activePool.lpFeeApy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80 font-bold">
                  <span className="text-white">Combined LP APY:</span>
                  <span className="text-emerald-300">{activePool.totalApy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Est. Monthly Earnings:</span>
                  <span className="text-white font-bold">+${((depositAmountUsd * activePool.totalApy) / 100 / 12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Impermanent Loss:</span>
                  <span className="text-emerald-400">&lt; 0.001% (Pegged)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDepositLiquidity}
              disabled={isProvisioning}
              className={`w-full py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isProvisioning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{isProvisioning ? 'Provisioning Liquidity...' : 'Provision Secondary Liquidity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Your Active Liquidity Positions Ledger */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Your Institutional Liquidity Positions</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Active AMM positions receiving real-time fee accruals on Monad
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Total LP Positions: {userPositions.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Position ID & Pool</th>
                <th className="py-2.5 px-3 text-right">Deposited Capital</th>
                <th className="py-2.5 px-3 text-center">Concentrated Range</th>
                <th className="py-2.5 px-3 text-right">Unclaimed Fees</th>
                <th className="py-2.5 px-3 text-center">Range Status</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {userPositions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white font-sans">{pos.pair}</span>
                    <span className="text-slate-500 block text-[10px]">ID: {pos.id} · Created {pos.createdAt}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-200 tabular-nums">
                    ${pos.depositedAmountUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300">
                    [{pos.minPrice.toFixed(4)} &ndash; {pos.maxPrice.toFixed(4)}]
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold tabular-nums">
                    +${pos.unclaimedFeesUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      In Range
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onClaimFees && onClaimFees(pos.id)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold text-[11px] cursor-pointer transition-colors"
                      >
                        Claim Fees
                      </button>
                      <button
                        onClick={() => onWithdrawPosition && onWithdrawPosition(pos.id)}
                        className="px-2.5 py-1 rounded border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-[11px] cursor-pointer transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
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
