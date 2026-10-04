/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_ASSETS, 
  INITIAL_REBALANCE_EVENTS, 
  INITIAL_SIGNERS, 
  INITIAL_QUORUM_REQUESTS, 
  INITIAL_CHAINLINK_METRICS, 
  INITIAL_MONAD_STATS,
  INITIAL_SMART_ALERTS,
  INITIAL_CORRELATION_MATRIX,
  INITIAL_GAS_BREAKDOWN,
  INITIAL_PERFORMANCE_STATS,
  INITIAL_COMPLIANCE_RECORDS,
  INITIAL_BRIDGE_LANES,
  INITIAL_BRIDGE_TRANSACTIONS,
  INITIAL_LIQUIDITY_POOLS,
  INITIAL_USER_LP_POSITIONS
} from './data/mockBlockchain';
import { 
  VaultAsset, 
  RebalanceEvent, 
  PrivySigner, 
  QuorumRequest, 
  RiskScenarioId,
  SmartAlert,
  CorrelationPair,
  GasCategoryBreakdown,
  PerformanceStats,
  InvestorComplianceRecord,
  BridgeLane,
  BridgeTransaction,
  LiquidityPool,
  UserLpPosition
} from './types/treasury';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { VaultManager } from './components/VaultManager';
import { MicroRebalancer } from './components/MicroRebalancer';
import { PrivyEnterpriseSecurity } from './components/PrivyEnterpriseSecurity';
import { ChainlinkMesh } from './components/ChainlinkMesh';
import { MonadBenchmarking } from './components/MonadBenchmarking';
import { ContractsViewer } from './components/ContractsViewer';
import { TreasuryProjections } from './components/TreasuryProjections';
import { ExportAuditReportModal } from './components/ExportAuditReportModal';
import { GasSavingsView } from './components/GasSavingsView';
import { AssetRiskCorrelation } from './components/AssetRiskCorrelation';
import { SmartAlertSystem } from './components/SmartAlertSystem';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { RegulatoryComplianceDashboard } from './components/RegulatoryComplianceDashboard';
import { CrossChainBridgeStats } from './components/CrossChainBridgeStats';
import { LiquidityProvisioningTool } from './components/LiquidityProvisioningTool';
import { RISK_SCENARIOS } from './components/RiskSensitivityBar';
import { 
  Shield, 
  Cpu, 
  ExternalLink, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [assets, setAssets] = useState<VaultAsset[]>(INITIAL_ASSETS);
  const [totalVaultAssetsUsd, setTotalVaultAssetsUsd] = useState<number>(42849800);
  const [totalSharesMinted, setTotalSharesMinted] = useState<number>(41200000);
  const [rebalanceEvents, setRebalanceEvents] = useState<RebalanceEvent[]>(INITIAL_REBALANCE_EVENTS);
  const [allSigners, setAllSigners] = useState<PrivySigner[]>(INITIAL_SIGNERS);
  const [currentSigner, setCurrentSigner] = useState<PrivySigner>(INITIAL_SIGNERS[0]); // Eleanor Vance, CFO
  const [isPrivyConnected, setIsPrivyConnected] = useState<boolean>(true);
  const [quorumRequests, setQuorumRequests] = useState<QuorumRequest[]>(INITIAL_QUORUM_REQUESTS);
  const [deviationThreshold, setDeviationThreshold] = useState<number>(2.5);
  const [chainlinkMetrics, setChainlinkMetrics] = useState(INITIAL_CHAINLINK_METRICS);
  const [monadStats, setMonadStats] = useState(INITIAL_MONAD_STATS);
  const [currentRiskScenario, setCurrentRiskScenario] = useState<RiskScenarioId>('baseline');
  const [isAuditReportOpen, setIsAuditReportOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<SmartAlert[]>(INITIAL_SMART_ALERTS);
  const [correlationPairs, setCorrelationPairs] = useState<CorrelationPair[]>(INITIAL_CORRELATION_MATRIX);
  const [gasBreakdown, setGasBreakdown] = useState<GasCategoryBreakdown[]>(INITIAL_GAS_BREAKDOWN);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [performanceStats] = useState<PerformanceStats>(INITIAL_PERFORMANCE_STATS);
  const [complianceRecords, setComplianceRecords] = useState<InvestorComplianceRecord[]>(INITIAL_COMPLIANCE_RECORDS);
  const [bridgeLanes, setBridgeLanes] = useState<BridgeLane[]>(INITIAL_BRIDGE_LANES);
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransaction[]>(INITIAL_BRIDGE_TRANSACTIONS);
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>(INITIAL_LIQUIDITY_POOLS);
  const [userLpPositions, setUserLpPositions] = useState<UserLpPosition[]>(INITIAL_USER_LP_POSITIONS);

  const handleInitiateBridgeTransfer = (newTx: BridgeTransaction) => {
    setBridgeTransactions((prev) => [newTx, ...prev]);
    if (newTx.token === 'USDC') {
      setTotalVaultAssetsUsd((prev) => prev + newTx.amount);
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === 'asset-usdc') {
            return {
              ...a,
              valueUsd: a.valueUsd + newTx.amount,
            };
          }
          return a;
        })
      );
    }
  };

  const handleAddLpPosition = (newPos: UserLpPosition) => {
    setUserLpPositions((prev) => [newPos, ...prev]);
    setLiquidityPools((prev) =>
      prev.map((p) =>
        p.id === newPos.poolId ? { ...p, tvlUsd: p.tvlUsd + newPos.depositedAmountUsd } : p
      )
    );
  };

  const handleClaimLpFees = (posId: string) => {
    setUserLpPositions((prev) =>
      prev.map((p) => (p.id === posId ? { ...p, unclaimedFeesUsd: 0 } : p))
    );
  };

  const handleWithdrawLpPosition = (posId: string) => {
    setUserLpPositions((prev) => prev.filter((p) => p.id !== posId));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleAddComplianceRecord = (record: InvestorComplianceRecord) => {
    setComplianceRecords((prev) => [record, ...prev]);
  };

  const handleTriggerGasAlert = (title: string, desc: string) => {
    const newAlert: SmartAlert = {
      id: `alt-gas-${Date.now()}`,
      timestamp: 'Just now',
      severity: title.includes('Spike') ? 'critical' : 'warning',
      category: 'gas',
      title,
      description: desc,
      source: 'Chainlink Gas Feed & Monad Base Fee Monitor',
      actionRequired: 'Inspect Execution Economics & Circuit Breaker',
      resolved: false,
      metadata: { l1BaseFee: '48.2 gwei', monadFee: '$0.00045', circuitBreaker: 'ACTIVE' },
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleTriggerComplianceAlert = (title: string, desc: string) => {
    const newAlert: SmartAlert = {
      id: `alt-cmp-${Date.now()}`,
      timestamp: 'Just now',
      severity: 'info',
      category: 'compliance',
      title,
      description: desc,
      source: 'Regulatory API Sync Gateway',
      actionRequired: 'Audit Merkle Attestation Root',
      resolved: false,
      metadata: { status: 'Verified', consensus: '31/31 DON nodes' },
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Risk Scenario Switcher
  const handleSelectRiskScenario = (scenarioId: RiskScenarioId) => {
    setCurrentRiskScenario(scenarioId);
    const scenario = RISK_SCENARIOS[scenarioId];

    setAssets((prev) =>
      prev.map((asset) => {
        if (scenarioId === 'rate-hike') {
          if (asset.type === 't-bill') return { ...asset, yieldApy: 6.22, oraclePrice: 1.0000 };
          if (asset.type === 'private-credit') return { ...asset, yieldApy: 7.10, oraclePrice: 1.0110 };
          return asset;
        }
        if (scenarioId === 'credit-widening') {
          if (asset.type === 'private-credit') return { ...asset, yieldApy: 5.80, riskScore: 45, oraclePrice: 0.9920 };
          if (asset.type === 'invoice') return { ...asset, yieldApy: 7.40, riskScore: 68, oraclePrice: 0.9650 };
          if (asset.type === 't-bill') return { ...asset, yieldApy: 4.95, oraclePrice: 1.0020 };
          return asset;
        }
        if (scenarioId === 'liquidity-crunch') {
          if (asset.type === 'cash-stable') return { ...asset, allocationPct: 18.0, targetPct: 20.0 };
          if (asset.type === 'invoice') return { ...asset, allocationPct: 6.0, targetPct: 8.0 };
          return asset;
        }
        // Baseline restore
        const initial = INITIAL_ASSETS.find((a) => a.id === asset.id);
        return initial ? { ...initial } : asset;
      })
    );
  };

  // Apply Stress Mitigation Action
  const handleApplyStressMitigation = () => {
    const scenario = RISK_SCENARIOS[currentRiskScenario];
    let rebalanceDetails = '';
    let delta = 250000;

    if (currentRiskScenario === 'rate-hike') {
      rebalanceDetails = 'Rotated $1,400,000 from cash buffer into US Treasury Bills to capture 6.22% risk-free rate.';
      delta = 1400000;
    } else if (currentRiskScenario === 'credit-widening') {
      rebalanceDetails = 'De-risked $850,000 corporate paper & invoices into T-Bills via Chainlink Functions hedge.';
      delta = 850000;
    } else if (currentRiskScenario === 'liquidity-crunch') {
      rebalanceDetails = 'Boosted liquid USDC cash buffer to 22% and enforced Privy dual-approval quorum for redemptions.';
      delta = 620000;
    } else {
      rebalanceDetails = 'Executed routine yield harvest upkeep on Monad.';
    }

    handleExecuteRebalance(`Stress Mitigation: ${scenario.name}`, delta);
  };

  // Deposit handler
  const handleDeposit = (amountUsd: number) => {
    const currentPrice = totalVaultAssetsUsd / totalSharesMinted;
    const newShares = amountUsd / currentPrice;

    setTotalVaultAssetsUsd((prev) => prev + amountUsd);
    setTotalSharesMinted((prev) => prev + newShares);

    // Update USDC liquid reserve allocation
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === 'asset-usdc') {
          return {
            ...a,
            valueUsd: a.valueUsd + amountUsd,
            allocationPct: ((a.valueUsd + amountUsd) / (totalVaultAssetsUsd + amountUsd)) * 100,
          };
        }
        return {
          ...a,
          allocationPct: (a.valueUsd / (totalVaultAssetsUsd + amountUsd)) * 100,
        };
      })
    );
  };

  // Redeem handler
  const handleRedeem = (sharesToRedeem: number) => {
    const currentPrice = totalVaultAssetsUsd / totalSharesMinted;
    const amountUsd = sharesToRedeem * currentPrice;

    if (amountUsd > totalVaultAssetsUsd) return;

    setTotalVaultAssetsUsd((prev) => prev - amountUsd);
    setTotalSharesMinted((prev) => prev - sharesToRedeem);

    // Deduct from USDC liquid reserve
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === 'asset-usdc') {
          const newVal = Math.max(0, a.valueUsd - amountUsd);
          return {
            ...a,
            valueUsd: newVal,
            allocationPct: (newVal / (totalVaultAssetsUsd - amountUsd)) * 100,
          };
        }
        return {
          ...a,
          allocationPct: (a.valueUsd / (totalVaultAssetsUsd - amountUsd)) * 100,
        };
      })
    );
  };

  // Rebalance execution handler
  const handleExecuteRebalance = (strategyName: string, deltaUsd: number) => {
    // Reset asset weights closer to target
    setAssets((prev) =>
      prev.map((a) => ({
        ...a,
        allocationPct: a.targetPct,
        valueUsd: (totalVaultAssetsUsd * a.targetPct) / 100,
      }))
    );

    // Add new rebalance event
    const newEvent: RebalanceEvent = {
      id: `reb-${Math.floor(1090 + Math.random() * 500)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      blockNumber: monadStats.epoch * 17 + Math.floor(Math.random() * 100),
      strategyName,
      triggerType: 'deviation',
      deltaUsd,
      gasCostMonadUsd: 0.00041,
      gasCostEthEquivalentUsd: 18.25,
      status: 'executed',
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      details: `Autonomous rebalance executed via Chainlink Automation v2 on Monad. Realigned weights to ±0.0% variance.`,
    };

    setRebalanceEvents((prev) => [newEvent, ...prev]);

    // Auto-resolve drift alerts & record gas savings
    setAlerts((prev) =>
      prev.map((a) => (a.category === 'drift' ? { ...a, resolved: true } : a))
    );

    setGasBreakdown((prev) =>
      prev.map((g) => {
        if (g.operation === 'Chainlink Keeper Micro-Rebalance') {
          return {
            ...g,
            calls24h: g.calls24h + 1,
            monadCostUsd: g.monadCostUsd + 0.00041,
            ethEquivalentUsd: g.ethEquivalentUsd + 18.5,
            savingsUsd: g.savingsUsd + 18.49959,
          };
        }
        return g;
      })
    );

    // Increment Chainlink updates
    setChainlinkMetrics((prev) => ({
      ...prev,
      automation: {
        ...prev.automation,
        lastTrigger: 'Just now',
      },
      dataFeeds: {
        ...prev.dataFeeds,
        totalUpdates24h: prev.dataFeeds.totalUpdates24h + 1,
      },
    }));
  };

  // Privy request approval handler
  const handleApproveQuorumRequest = (requestId: string, signer: PrivySigner) => {
    setQuorumRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          if (req.signers.some((s) => s.id === signer.id)) return req;
          const updatedSigners = [...req.signers, signer];
          const updatedApprovals = updatedSigners.length;
          const isApproved = updatedApprovals >= req.requiredApprovals;
          return {
            ...req,
            signers: updatedSigners,
            currentApprovals: updatedApprovals,
            status: isApproved ? 'approved' : 'pending',
          };
        }
        return req;
      })
    );
  };

  const handleTriggerFunctionsCompute = () => {
    setChainlinkMetrics((prev) => ({
      ...prev,
      functions: {
        ...prev.functions,
        lastComputationTimeMs: 168,
        verificationStatus: 'verified',
      },
    }));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#090D16] text-slate-100' : 'light-mode'} flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400 transition-colors duration-200`}>
      {/* Top Bar adhering to strict 3-Zone Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentSigner={currentSigner}
        onSwitchSigner={setCurrentSigner}
        allSigners={allSigners}
        isPrivyConnected={isPrivyConnected}
        onTogglePrivy={() => setIsPrivyConnected(!isPrivyConnected)}
        onOpenAuditReport={() => setIsAuditReportOpen(true)}
        unreadAlertsCount={alerts.filter((a) => !a.resolved).length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Viewport Container (Desktop baseline 1440px max width) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            assets={assets}
            rebalanceEvents={rebalanceEvents}
            chainlinkMetrics={chainlinkMetrics}
            monadStats={monadStats}
            onNavigate={setActiveTab}
            onTriggerRebalance={() => handleExecuteRebalance('Target Drift Band Optimizer', 142000)}
            totalVaultAssetsUsd={totalVaultAssetsUsd}
            totalSharesMinted={totalSharesMinted}
            currentRiskScenario={currentRiskScenario}
            onSelectRiskScenario={handleSelectRiskScenario}
            onApplyStressMitigation={handleApplyStressMitigation}
            onOpenAuditReport={() => setIsAuditReportOpen(true)}
          />
        )}

        {activeTab === 'vaults' && (
          <VaultManager
            assets={assets}
            totalVaultAssetsUsd={totalVaultAssetsUsd}
            totalSharesMinted={totalSharesMinted}
            onDeposit={handleDeposit}
            onRedeem={handleRedeem}
            currentSigner={currentSigner}
          />
        )}

        {activeTab === 'projections' && (
          <TreasuryProjections
            currentPrincipalUsd={totalVaultAssetsUsd}
            currentBlendedApy={assets.reduce((acc, a) => acc + (a.yieldApy * a.allocationPct) / 100, 0)}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceAnalytics
            stats={performanceStats}
            currentVaultApy={assets.reduce((acc, a) => acc + (a.yieldApy * a.allocationPct) / 100, 0)}
          />
        )}

        {activeTab === 'bridge' && (
          <CrossChainBridgeStats
            lanes={bridgeLanes}
            transactions={bridgeTransactions}
            onInitiateBridgeTransfer={handleInitiateBridgeTransfer}
          />
        )}

        {activeTab === 'liquidity' && (
          <LiquidityProvisioningTool
            pools={liquidityPools}
            userPositions={userLpPositions}
            onAddPosition={handleAddLpPosition}
            onClaimFees={handleClaimLpFees}
            onWithdrawPosition={handleWithdrawLpPosition}
          />
        )}

        {activeTab === 'compliance' && (
          <RegulatoryComplianceDashboard
            records={complianceRecords}
            onAddRecord={handleAddComplianceRecord}
            onTriggerComplianceAlert={handleTriggerComplianceAlert}
          />
        )}

        {activeTab === 'gas' && (
          <GasSavingsView
            stats={monadStats}
            breakdown={gasBreakdown}
            onTriggerGasAlert={handleTriggerGasAlert}
          />
        )}

        {activeTab === 'correlation' && (
          <AssetRiskCorrelation
            pairs={correlationPairs}
            currentScenario={currentRiskScenario}
          />
        )}

        {activeTab === 'alerts' && (
          <SmartAlertSystem
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onNavigate={setActiveTab}
            onTriggerRebalance={() => handleExecuteRebalance('Target Drift Band Optimizer', 142000)}
          />
        )}

        {activeTab === 'rebalancer' && (
          <MicroRebalancer
            assets={assets}
            rebalanceEvents={rebalanceEvents}
            onExecuteRebalance={handleExecuteRebalance}
            deviationThreshold={deviationThreshold}
            onUpdateThreshold={setDeviationThreshold}
          />
        )}

        {activeTab === 'privy' && (
          <PrivyEnterpriseSecurity
            currentSigner={currentSigner}
            allSigners={allSigners}
            quorumRequests={quorumRequests}
            onApproveRequest={handleApproveQuorumRequest}
            onSwitchSigner={setCurrentSigner}
          />
        )}

        {activeTab === 'chainlink' && (
          <ChainlinkMesh
            metrics={chainlinkMetrics}
            assets={assets}
            onTriggerFunctionsCompute={handleTriggerFunctionsCompute}
          />
        )}

        {activeTab === 'monad' && (
          <MonadBenchmarking stats={monadStats} />
        )}

        {activeTab === 'contracts' && (
          <ContractsViewer />
        )}
      </main>

      {/* Global Institutional Audit Report Modal */}
      <ExportAuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
        assets={assets}
        totalVaultAssetsUsd={totalVaultAssetsUsd}
        totalSharesMinted={totalSharesMinted}
        rebalanceEvents={rebalanceEvents}
        signers={allSigners}
        quorumRequests={quorumRequests}
        chainlinkMetrics={chainlinkMetrics}
        monadStats={monadStats}
      />

      {/* Footer adhering to Clean Editorial Contract */}
      <footer className="w-full border-t border-slate-800/80 bg-[#070A12] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">NUVA Treasury Protocol</span>
            <span className="text-slate-700">·</span>
            <span className="font-mono text-[11px] text-slate-400">Metropolis Global Hackathon 2026 Reference Implementation</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
            <span>Chainlink Multi-Service Mesh (5x)</span>
            <span className="text-slate-700">·</span>
            <span>Privy Enterprise Quorum</span>
            <span className="text-slate-700">·</span>
            <span>Monad 10k TPS L1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
