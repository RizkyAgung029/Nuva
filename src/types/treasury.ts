export interface VaultAsset {
  id: string;
  name: string;
  symbol: string;
  type: 't-bill' | 'private-credit' | 'invoice' | 'cash-stable';
  allocationPct: number; // Current weight %
  targetPct: number; // Target weight %
  valueUsd: number;
  yieldApy: number;
  oracleFeed: string;
  oraclePrice: number;
  oracleLastUpdated: string;
  custodian: string;
  proofOfReserveStatus: 'verified' | 'pending' | 'syncing';
  riskScore: number; // 1-100
}

export interface RebalanceEvent {
  id: string;
  timestamp: string;
  blockNumber: number;
  strategyName: string;
  triggerType: 'deviation' | 'scheduled-hourly' | 'functions-risk-hedge';
  deltaUsd: number;
  gasCostMonadUsd: number;
  gasCostEthEquivalentUsd: number;
  status: 'executed' | 'pending-quorum' | 'simulated';
  txHash: string;
  details: string;
}

export interface PrivySigner {
  id: string;
  name: string;
  role: 'CFO' | 'Treasury Lead' | 'Risk Officer' | 'Automated Keeper';
  address: string;
  avatar: string;
  status: 'active' | 'offline';
  hasApproved?: boolean;
}

export interface QuorumRequest {
  id: string;
  action: 'Rebalance Execution' | 'Large Withdrawal' | 'Strategy Parameter Update' | 'Custodian Whitelist';
  amountUsd: number;
  requestedBy: string;
  timestamp: string;
  requiredApprovals: number;
  currentApprovals: number;
  signers: PrivySigner[];
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  payloadSummary: string;
}

export interface ChainlinkServiceMetrics {
  dataFeeds: {
    activeFeeds: number;
    heartbeatInterval: string;
    deviationThreshold: string;
    totalUpdates24h: number;
  };
  automation: {
    upkeepId: string;
    status: 'active' | 'paused';
    lastTrigger: string;
    checkUpkeepCadence: string;
    linkBalance: number;
  };
  functions: {
    subscriptionId: string;
    donHostedSecrets: boolean;
    lastComputationTimeMs: number;
    verificationStatus: 'verified' | 'evaluating';
  };
  ccip: {
    supportedChains: string[];
    settledVolumeUsd: number;
    routerAddress: string;
  };
  ace: {
    complianceTier: string;
    sanctionListVersion: string;
    kycProvider: string;
    passedAttestations24h: number;
  };
}

export interface MonadNetworkStats {
  tps: number;
  blockTimeMs: number;
  finalityMs: number;
  avgGasFeeUsd: number;
  chainId: number;
  epoch: number;
  gasSavingsVsL1Pct: number;
}

export type RiskScenarioId = 'baseline' | 'rate-hike' | 'credit-widening' | 'liquidity-crunch';

export interface RiskScenario {
  id: RiskScenarioId;
  name: string;
  tagline: string;
  sofrShiftBps: number;
  creditSpreadShiftBps: number;
  liquidityDrainPct: number;
  blendedApyDelta: number;
  var99Pct: number; // 99% Value-at-Risk %
  liquidityCoverageRatio: number; // % LCR
  recommendedAction: string;
}

export interface TreasuryProjectionYear {
  period: string;
  months: number;
  projectedNavHourly: number;
  projectedNavMonthly: number;
  interestEarnedHourly: number;
  interestEarnedMonthly: number;
  deltaAdvantageUsd: number;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'drift' | 'oracle' | 'quorum' | 'liquidity' | 'compliance' | 'gas' | 'network';

export interface RegulatoryApiEndpoint {
  id: string;
  name: string;
  endpoint: string;
  latencyMs: number;
  version: string;
  status: 'Synchronized' | 'Syncing' | 'Verified' | 'Error';
  lastSyncTimestamp: string;
  merkleRootHash: string;
  jurisdiction: string;
}

export interface GasAlertRule {
  id: string;
  network: 'monad' | 'ethereum' | 'arbitrum';
  metric: 'base_fee_gwei' | 'tx_cost_usd';
  threshold: number;
  condition: 'gt' | 'lt';
  action: 'notify' | 'pause_ccip' | 'throttle_keepers';
  enabled: boolean;
}

export interface SmartAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  source: string;
  actionRequired?: string;
  resolved: boolean;
  metadata?: Record<string, string | number>;
}

export interface CorrelationPair {
  assetA: string;
  assetB: string;
  coefficient: number; // -1.0 to 1.0
  covariance: number;
  diversificationEffect: 'high' | 'moderate' | 'correlated';
  stressCoefficient: number;
}

export interface GasCategoryBreakdown {
  operation: string;
  calls24h: number;
  monadCostUsd: number;
  ethEquivalentUsd: number;
  savingsUsd: number;
  avgGasUnits: number;
}

export interface MonthlyReturn {
  month: string;
  year: number;
  vaultReturnPct: number;
  benchmarkSofrPct: number;
  alphaBps: number;
}

export interface PerformanceStats {
  cumulativeReturnPct: number;
  annualizedReturnPct: number;
  benchmarkReturnPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  informationRatio: number;
  maxDrawdownPct: number;
  calmarRatio: number;
  winRatePct: number;
  monthlyReturns: MonthlyReturn[];
}

export interface InvestorComplianceRecord {
  id: string;
  investorName: string;
  entityType: 'Institutional Fund' | 'Corporate Treasury' | 'Family Office' | 'Accredited Individual';
  walletAddress: string;
  jurisdiction: string;
  regulatoryFramework: 'Reg D 506(c)' | 'Reg S' | 'MiFID II Qualified' | 'MAS Accredited';
  kycProvider: string;
  status: 'approved' | 'pending' | 'restricted';
  attestationHash: string;
  verifiedAt: string;
  expiresAt: string;
  maxAllocationUsd: number;
}

export interface BridgeLane {
  id: string;
  sourceChain: string;
  targetChain: string;
  status: 'active' | 'congested' | 'paused';
  settled24hVolumeUsd: number;
  totalTransactions24h: number;
  avgFinalitySeconds: number;
  ccipRouter: string;
  rateLimitRemainingUsd: number;
  rateLimitCapacityUsd: number;
  linkFeeUsd: number;
}

export interface BridgeTransaction {
  id: string;
  messageId: string;
  timestamp: string;
  sourceChain: string;
  destChain: string;
  token: string;
  amount: number;
  sender: string;
  receiver: string;
  status: 'settled' | 'in-transit' | 'verifying';
  txHash: string;
  ccipExplorerUrl?: string;
}

export interface LiquidityPool {
  id: string;
  pair: string;
  dex: string;
  tvlUsd: number;
  volume24hUsd: number;
  feeTierPct: number;
  vaultYieldApy: number;
  lpFeeApy: number;
  totalApy: number;
  impermanentLossRisk: 'negligible' | 'low' | 'moderate';
  reserveA: number;
  reserveB: number;
  tokenA: string;
  tokenB: string;
}

export interface UserLpPosition {
  id: string;
  poolId: string;
  pair: string;
  depositedAmountUsd: number;
  tokenAAmount: number;
  tokenBAmount: number;
  unclaimedFeesUsd: number;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  inRange: boolean;
  createdAt: string;
}



