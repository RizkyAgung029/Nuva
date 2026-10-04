import React, { useState } from 'react';
import { VaultAsset, RebalanceEvent } from '../types/treasury';
import { 
  Zap, 
  RefreshCw, 
  Settings2, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Play,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface MicroRebalancerProps {
  assets: VaultAsset[];
  rebalanceEvents: RebalanceEvent[];
  onExecuteRebalance: (strategy: string, deltaUsd: number) => void;
  deviationThreshold: number;
  onUpdateThreshold: (threshold: number) => void;
}

export const MicroRebalancer: React.FC<MicroRebalancerProps> = ({
  assets,
  rebalanceEvents,
  onExecuteRebalance,
  deviationThreshold,
  onUpdateThreshold,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'drift' | 'hourly' | 'functions'>('drift');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const strategies = [
    {
      id: 'drift',
      name: 'Dynamic Drift Band Optimizer',
      desc: 'Triggers Chainlink Automation when asset allocation deviates past ±2.5% threshold.',
      cadence: 'Event-driven (Continuous ~400ms check)',
      active: true,
    },
    {
      id: 'hourly',
      name: 'Hourly Yield Harvest & Liquidity Sweeper',
      desc: 'Compounds off-chain yield vouchers and sweeps liquid cash buffers to optimal earning assets.',
      cadence: 'Cron: At minute 0 every hour',
      active: true,
    },
    {
      id: 'functions',
      name: 'Chainlink Functions Risk Engine',
      desc: 'Decentralized Oracle Network executes off-chain Monte Carlo VaR models before reallocating capital.',
      cadence: 'Daily risk assessment & emergency hedge',
      active: true,
    },
  ];

  // Calculate highest drift
  let maxDriftAsset = assets[0];
  let maxDriftAbs = 0;
  assets.forEach((a) => {
    const drift = Math.abs(a.allocationPct - a.targetPct);
    if (drift > maxDriftAbs) {
      maxDriftAbs = drift;
      maxDriftAsset = a;
    }
  });

  const isUpkeepNeeded = maxDriftAbs >= deviationThreshold;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setTimeout(() => {
          setSimulationStep(4);
          const deltaAmount = Math.round(maxDriftAbs * 50000 + 40000);
          onExecuteRebalance(
            selectedStrategy === 'drift' ? 'Target Drift Band Optimizer' :
            selectedStrategy === 'hourly' ? 'Hourly Yield Harvest' : 'Chainlink Functions Risk Engine',
            deltaAmount
          );
          setIsSimulating(false);
          setSimulationStep(0);
        }, 1200);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>CHAINLINK AUTOMATION & FUNCTIONS</span>
            <span className="text-slate-600">/</span>
            <span>HIGH-FREQUENCY MICRO-REBALANCING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Autonomous Portfolio Micro-Rebalancer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sub-cent gas fees on Monad allow 24/7 continuous rebalancing that eliminates target weight slippage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0C1220] text-xs font-mono">
            <span className="text-slate-400">Deviation Threshold:</span>
            <span className="text-emerald-400 font-bold">±{deviationThreshold.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Execution Flow Simulation Banner */}
      <div className="rounded-xl border border-purple-500/30 bg-[#0E1322] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
              <Cpu className="h-4 w-4" />
              <span>Modular Upkeep Workflow: KeeperCompatibleInterface</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Autonomous Upkeep Simulator (Monad Execution)
            </h2>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`px-4 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
              isSimulating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Executing Upkeep On-Chain...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Simulate Automated Upkeep</span>
              </>
            )}
          </button>
        </div>

        {/* 4-Step Pipeline Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`rounded-lg border p-4 transition-all ${
            simulationStep === 1 
              ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
              : simulationStep > 1 
              ? 'border-slate-700 bg-slate-900/60'
              : 'border-slate-800 bg-[#090D16]'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>01. checkUpkeep()</span>
              {simulationStep > 1 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            </div>
            <span className="font-semibold text-xs text-white block">Drift Detection</span>
            <p className="text-[11px] text-slate-400 mt-1">
              DON Keeper monitors target vs current weights. Condition: <code className="text-slate-300">maxDrift &ge; 2.5%</code>.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-400">
              {isUpkeepNeeded ? 'Drift 2.4% -> Trigger Ready' : 'Within Band (0.8%)'}
            </div>
          </div>

          {/* Step 2 */}
          <div className={`rounded-lg border p-4 transition-all ${
            simulationStep === 2 
              ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500'
              : simulationStep > 2 
              ? 'border-slate-700 bg-slate-900/60'
              : 'border-slate-800 bg-[#090D16]'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>02. Chainlink Functions</span>
              {simulationStep > 2 && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
            </div>
            <span className="font-semibold text-xs text-white block">Off-Chain Risk Analysis</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Verifies custodian liquidity depth and invoice credit scores via serverless DON consensus.
            </p>
            <div className="mt-2 text-[10px] font-mono text-cyan-400">
              Latency: 184ms · Consensus: 31/31 nodes
            </div>
          </div>

          {/* Step 3 */}
          <div className={`rounded-lg border p-4 transition-all ${
            simulationStep === 3 
              ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500'
              : simulationStep > 3 
              ? 'border-slate-700 bg-slate-900/60'
              : 'border-slate-800 bg-[#090D16]'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>03. performUpkeep()</span>
              {simulationStep > 3 && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
            </div>
            <span className="font-semibold text-xs text-white block">Forward to RWAVault</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Calls <code className="text-slate-300">executeRebalance(payload)</code> with onlyRebalancer security modifier.
            </p>
            <div className="mt-2 text-[10px] font-mono text-purple-400">
              Payload: Encoded bytes calldata
            </div>
          </div>

          {/* Step 4 */}
          <div className={`rounded-lg border p-4 transition-all ${
            simulationStep === 4 
              ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
              : 'border-slate-800 bg-[#090D16]'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>04. Monad Settlement</span>
              <span className="text-[10px] font-mono text-emerald-400">~400ms</span>
            </div>
            <span className="font-semibold text-xs text-white block">Atomic DEX Swap</span>
            <p className="text-[11px] text-slate-400 mt-1">
              Sub-cent transaction settled in block. Allocation reset to target ratios with zero front-running.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-400">
              Gas: $0.00042 · Finality: 800ms
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Management & Drift Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Strategy Selection & Sliders (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Hot-Swappable Strategies</h2>
            <span className="text-xs font-mono text-slate-400">IRebalancerStrategy.sol</span>
          </div>

          <div className="space-y-3">
            {strategies.map((strat) => (
              <button
                key={strat.id}
                onClick={() => setSelectedStrategy(strat.id as any)}
                className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedStrategy === strat.id
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-white'
                    : 'border-slate-800 bg-[#090D16] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{strat.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{strat.desc}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Cadence: {strat.cadence}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Deviation Sensitivity Control */}
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Target Drift Sensitivity</span>
              <span className="font-mono text-emerald-400 font-bold">±{deviationThreshold.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={deviationThreshold}
              onChange={(e) => onUpdateThreshold(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0.5% (High-Frequency)</span>
              <span>2.5% (Balanced Standard)</span>
              <span>5.0% (Wide Band)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Asset Drift Live Table (6 cols) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Live Drift vs Target Bands</h2>
            <span className="text-xs font-mono text-slate-400">4 Monitored Tranches</span>
          </div>

          <div className="space-y-4">
            {assets.map((asset) => {
              const drift = asset.allocationPct - asset.targetPct;
              const isDrifting = Math.abs(drift) >= deviationThreshold;

              return (
                <div key={asset.id} className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{asset.name}</span>
                    <span className={`font-mono text-xs font-bold ${
                      isDrifting ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {drift > 0 ? `+${drift.toFixed(1)}%` : `${drift.toFixed(1)}%`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Current: <strong className="text-white">{asset.allocationPct.toFixed(1)}%</strong></span>
                    <span>Target: <strong className="text-slate-300">{asset.targetPct.toFixed(1)}%</strong></span>
                    <span>Value: ${(asset.valueUsd / 1e6).toFixed(2)}M</span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isDrifting ? 'bg-amber-400' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, asset.allocationPct * 1.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-[#090D16] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Slippage & MEV Protection</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Monad's pipelined execution prevents toxic mempool sandwich attacks. 
              The rebalancer calldata specifies exact minimum output tolerances (<code className="text-slate-300">maxSlippage = 5 bps</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
