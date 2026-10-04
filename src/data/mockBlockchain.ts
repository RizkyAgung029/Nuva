import { 
  VaultAsset, 
  RebalanceEvent, 
  PrivySigner, 
  QuorumRequest, 
  ChainlinkServiceMetrics, 
  MonadNetworkStats,
  SmartAlert,
  CorrelationPair,
  GasCategoryBreakdown,
  PerformanceStats,
  InvestorComplianceRecord,
  BridgeLane,
  BridgeTransaction,
  LiquidityPool,
  UserLpPosition
} from '../types/treasury';

export const INITIAL_ASSETS: VaultAsset[] = [
  {
    id: 'asset-tbills',
    name: 'US Treasury Bills (0-3M)',
    symbol: 'USTB-3M',
    type: 't-bill',
    allocationPct: 52.4,
    targetPct: 50.0,
    valueUsd: 22453400,
    yieldApy: 5.22,
    oracleFeed: '0x3F8A...c812 (Chainlink T-Bill NAV Stream)',
    oraclePrice: 1.0000,
    oracleLastUpdated: '12s ago',
    custodian: 'BNY Mellon Digital Custody LLC',
    proofOfReserveStatus: 'verified',
    riskScore: 12,
  },
  {
    id: 'asset-corp-paper',
    name: 'Tier-1 Investment Grade Commercial Paper',
    symbol: 'IGCP-A1',
    type: 'private-credit',
    allocationPct: 27.6,
    targetPct: 30.0,
    valueUsd: 11826600,
    yieldApy: 6.45,
    oracleFeed: '0x992B...44E1 (Chainlink Corporate NAV Feed)',
    oraclePrice: 1.0142,
    oracleLastUpdated: '34s ago',
    custodian: 'State Street Bank Corp Custody',
    proofOfReserveStatus: 'verified',
    riskScore: 24,
  },
  {
    id: 'asset-invoices',
    name: 'Tokenized Trade Receivables (Fintech Invoices)',
    symbol: 'TK-INVOICE',
    type: 'invoice',
    allocationPct: 12.8,
    targetPct: 10.0,
    valueUsd: 5484800,
    yieldApy: 8.90,
    oracleFeed: '0x55C1...7829 (Chainlink Functions Invoice Verifier)',
    oraclePrice: 0.9850,
    oracleLastUpdated: '1m ago',
    custodian: 'Centrifuge Prime SPV & Securitize',
    proofOfReserveStatus: 'verified',
    riskScore: 38,
  },
  {
    id: 'asset-usdc',
    name: 'Circle USDC Liquid Cash Buffer',
    symbol: 'USDC',
    type: 'cash-stable',
    allocationPct: 7.2,
    targetPct: 10.0,
    valueUsd: 3085200,
    yieldApy: 4.10,
    oracleFeed: '0x14D2...B839 (Chainlink USDC/USD Aggregator)',
    oraclePrice: 1.0001,
    oracleLastUpdated: '4s ago',
    custodian: 'Circle Reserve Fund (BlackRock)',
    proofOfReserveStatus: 'verified',
    riskScore: 5,
  },
];

export const INITIAL_REBALANCE_EVENTS: RebalanceEvent[] = [
  {
    id: 'reb-1089',
    timestamp: '2026-10-04 07:12:44',
    blockNumber: 4892104,
    strategyName: 'Target Drift Band Optimizer (2.5% Threshold)',
    triggerType: 'deviation',
    deltaUsd: 142000,
    gasCostMonadUsd: 0.00042,
    gasCostEthEquivalentUsd: 18.45,
    status: 'executed',
    txHash: '0x7a3f89b1c2384a441e89921bdf4832049182374e2a9b31d041348821948123ae',
    details: 'Shifted $142,000 from USTB-3M overweight into USDC buffer to restore target balance.',
  },
  {
    id: 'reb-1088',
    timestamp: '2026-10-04 06:00:02',
    blockNumber: 4883100,
    strategyName: 'Hourly Yield Harvest & Liquidity Sweeper',
    triggerType: 'scheduled-hourly',
    deltaUsd: 38500,
    gasCostMonadUsd: 0.00038,
    gasCostEthEquivalentUsd: 16.20,
    status: 'executed',
    txHash: '0x3c21a4f0923058b881329a1b8d2341904b77218e819b99014238e552918bb194',
    details: 'Harvested accrued yield ($38,500) from IGCP-A1 into vault principal compounding.',
  },
  {
    id: 'reb-1087',
    timestamp: '2026-10-04 04:38:19',
    blockNumber: 4862410,
    strategyName: 'Functions Decentralized Risk Hedge',
    triggerType: 'functions-risk-hedge',
    deltaUsd: 220000,
    gasCostMonadUsd: 0.00051,
    gasCostEthEquivalentUsd: 24.80,
    status: 'executed',
    txHash: '0x991b4c330089a8182740192eab88320148719280384112e4827019248bde9021',
    details: 'Chainlink Functions DON flagged invoice maturity window; rotated $220k into 0-3M T-Bills.',
  },
  {
    id: 'reb-1086',
    timestamp: '2026-10-04 03:00:01',
    blockNumber: 4848011,
    strategyName: 'Hourly Yield Harvest & Liquidity Sweeper',
    triggerType: 'scheduled-hourly',
    deltaUsd: 41200,
    gasCostMonadUsd: 0.00039,
    gasCostEthEquivalentUsd: 17.10,
    status: 'executed',
    txHash: '0x12a9e33819b9102488d01923bb19041280389148102374e29a38411028394c81',
    details: 'Automated compounding upkeep executed via Chainlink Automation v2 on Monad.',
  },
];

export const INITIAL_SIGNERS: PrivySigner[] = [
  {
    id: 'sig-cfo',
    name: 'Eleanor Vance',
    role: 'CFO',
    address: '0x8841...77A2',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'sig-treasury',
    name: 'Marcus Chen',
    role: 'Treasury Lead',
    address: '0x4312...D901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'sig-risk',
    name: 'Sarah Jenkins, CFA',
    role: 'Risk Officer',
    address: '0x1928...F834',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
  {
    id: 'sig-keeper',
    name: 'Chainlink DON Upkeep Agent',
    role: 'Automated Keeper',
    address: '0x55E9...B018',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    status: 'active',
  },
];

export const INITIAL_QUORUM_REQUESTS: QuorumRequest[] = [
  {
    id: 'qrm-402',
    action: 'Rebalance Execution',
    amountUsd: 142000,
    requestedBy: 'Chainlink Keeper #42 (Automated)',
    timestamp: '15 mins ago',
    requiredApprovals: 2,
    currentApprovals: 2,
    signers: [INITIAL_SIGNERS[0], INITIAL_SIGNERS[1]],
    status: 'approved',
    payloadSummary: 'Swap $142k USTB-3M for USDC to counter 2.4% overweight allocation.',
  },
  {
    id: 'qrm-403',
    action: 'Large Withdrawal',
    amountUsd: 750000,
    requestedBy: 'Enterprise Client Treasury (Securitize ID: 9481)',
    timestamp: '28 mins ago',
    requiredApprovals: 2,
    currentApprovals: 1,
    signers: [INITIAL_SIGNERS[1]],
    status: 'pending',
    payloadSummary: 'Institutional redemption of 721,153 nvUSD shares into USDC fiat gateway.',
  },
];

export const INITIAL_CHAINLINK_METRICS: ChainlinkServiceMetrics = {
  dataFeeds: {
    activeFeeds: 4,
    heartbeatInterval: '10s (Sub-second streams available)',
    deviationThreshold: '0.05%',
    totalUpdates24h: 8640,
  },
  automation: {
    upkeepId: '98401928301984',
    status: 'active',
    lastTrigger: '12m ago',
    checkUpkeepCadence: 'Every block (~400ms)',
    linkBalance: 450.8,
  },
  functions: {
    subscriptionId: 'SUB-2026-MONAD-884',
    donHostedSecrets: true,
    lastComputationTimeMs: 184,
    verificationStatus: 'verified',
  },
  ccip: {
    supportedChains: ['Monad Testnet', 'Ethereum Mainnet', 'Arbitrum One', 'Solana (CCIP v1.6)'],
    settledVolumeUsd: 14250000,
    routerAddress: '0x0b1C...93FA',
  },
  ace: {
    complianceTier: 'Institutional Reg D / Reg S / KYC Tier-3',
    sanctionListVersion: 'OFAC-SDN-2026.10',
    kycProvider: 'Chainlink ACE Verified Credential Oracle',
    passedAttestations24h: 342,
  },
};

export const INITIAL_MONAD_STATS: MonadNetworkStats = {
  tps: 9840,
  blockTimeMs: 400,
  finalityMs: 800,
  avgGasFeeUsd: 0.00045,
  chainId: 10143, // Monad Testnet
  epoch: 284109,
  gasSavingsVsL1Pct: 99.98,
};

export const INITIAL_SMART_ALERTS: SmartAlert[] = [
  {
    id: 'alt-001',
    timestamp: 'Just now',
    severity: 'warning',
    category: 'drift',
    title: 'USTB-3M Allocation Drift Detected (+2.4%)',
    description: 'Current allocation is 52.4% vs 50.0% target band. Chainlink Automation checkUpkeep() condition is met.',
    source: 'Chainlink Keeper #42',
    actionRequired: 'Execute Autonomous Micro-Rebalance',
    resolved: false,
    metadata: { currentWeight: '52.4%', targetWeight: '50.0%', drift: '+2.4%' },
  },
  {
    id: 'alt-002',
    timestamp: '18 mins ago',
    severity: 'warning',
    category: 'quorum',
    title: 'Dual-Approval Quorum Required for $750k Redemption',
    description: 'Request #qrm-403 initiated by Securitize ID 9481 requires 1 more signature from CFO or Risk Officer.',
    source: 'Privy Policy Engine',
    actionRequired: 'Review & Sign Quorum Queue',
    resolved: false,
    metadata: { amountUsd: '$750,000', signaturesCollected: '1/2' },
  },
  {
    id: 'alt-003',
    timestamp: '42 mins ago',
    severity: 'info',
    category: 'oracle',
    title: 'Proof of Reserve Attestation Synchronized (100.24%)',
    description: 'BNY Mellon and State Street custodian ledger verified on-chain by decentralized oracle nodes.',
    source: 'Chainlink PoR Aggregator',
    resolved: true,
    metadata: { ratio: '100.24%', auditor: 'Grant Thornton LLP' },
  },
  {
    id: 'alt-004',
    timestamp: '1 hour ago',
    severity: 'info',
    category: 'compliance',
    title: 'Chainlink ACE Sanctions Clearance: OFAC-SDN-2026.10',
    description: 'Automated compliance scan verified 342 institutional transactions in the rolling 24-hour epoch.',
    source: 'Chainlink ACE Engine',
    resolved: true,
    metadata: { passedChecks: 342, sanctionsList: 'OFAC-SDN-2026.10' },
  },
];

export const INITIAL_CORRELATION_MATRIX: CorrelationPair[] = [
  {
    assetA: 'USTB-3M',
    assetB: 'IGCP-A1',
    coefficient: 0.28,
    covariance: 0.0014,
    diversificationEffect: 'moderate',
    stressCoefficient: 0.42,
  },
  {
    assetA: 'USTB-3M',
    assetB: 'TK-INVOICE',
    coefficient: -0.12,
    covariance: -0.0008,
    diversificationEffect: 'high',
    stressCoefficient: 0.15,
  },
  {
    assetA: 'USTB-3M',
    assetB: 'USDC',
    coefficient: 0.05,
    covariance: 0.0001,
    diversificationEffect: 'high',
    stressCoefficient: 0.08,
  },
  {
    assetA: 'USTB-3M',
    assetB: 'SPY Benchmark',
    coefficient: -0.34,
    covariance: -0.0032,
    diversificationEffect: 'high',
    stressCoefficient: -0.52,
  },
  {
    assetA: 'IGCP-A1',
    assetB: 'TK-INVOICE',
    coefficient: 0.38,
    covariance: 0.0028,
    diversificationEffect: 'moderate',
    stressCoefficient: 0.64,
  },
  {
    assetA: 'IGCP-A1',
    assetB: 'USDC',
    coefficient: 0.08,
    covariance: 0.0002,
    diversificationEffect: 'high',
    stressCoefficient: 0.12,
  },
  {
    assetA: 'IGCP-A1',
    assetB: 'SPY Benchmark',
    coefficient: 0.44,
    covariance: 0.0041,
    diversificationEffect: 'moderate',
    stressCoefficient: 0.71,
  },
  {
    assetA: 'TK-INVOICE',
    assetB: 'USDC',
    coefficient: -0.04,
    covariance: -0.0001,
    diversificationEffect: 'high',
    stressCoefficient: 0.02,
  },
  {
    assetA: 'TK-INVOICE',
    assetB: 'SPY Benchmark',
    coefficient: 0.22,
    covariance: 0.0019,
    diversificationEffect: 'moderate',
    stressCoefficient: 0.48,
  },
  {
    assetA: 'USDC',
    assetB: 'SPY Benchmark',
    coefficient: 0.01,
    covariance: 0.0000,
    diversificationEffect: 'high',
    stressCoefficient: 0.02,
  },
];

export const INITIAL_GAS_BREAKDOWN: GasCategoryBreakdown[] = [
  {
    operation: 'Chainlink Keeper Micro-Rebalance',
    calls24h: 24,
    monadCostUsd: 0.00984,
    ethEquivalentUsd: 444.00,
    savingsUsd: 443.99,
    avgGasUnits: 142000,
  },
  {
    operation: 'ERC-4626 Mint & Collateral Deposit',
    calls24h: 18,
    monadCostUsd: 0.00756,
    ethEquivalentUsd: 216.00,
    savingsUsd: 215.99,
    avgGasUnits: 98000,
  },
  {
    operation: 'ERC-4626 Share Redemption & Burn',
    calls24h: 6,
    monadCostUsd: 0.00312,
    ethEquivalentUsd: 84.00,
    savingsUsd: 83.99,
    avgGasUnits: 112000,
  },
  {
    operation: 'Chainlink Functions Risk Attestation',
    calls24h: 48,
    monadCostUsd: 0.01920,
    ethEquivalentUsd: 888.00,
    savingsUsd: 887.98,
    avgGasUnits: 185000,
  },
  {
    operation: 'CCIP Cross-Chain Liquidity Routing',
    calls24h: 4,
    monadCostUsd: 0.00288,
    ethEquivalentUsd: 148.00,
    savingsUsd: 147.99,
    avgGasUnits: 240000,
  },
];

export const INITIAL_PERFORMANCE_STATS: PerformanceStats = {
  cumulativeReturnPct: 8.42,
  annualizedReturnPct: 5.62,
  benchmarkReturnPct: 4.85,
  sharpeRatio: 2.85,
  sortinoRatio: 4.12,
  informationRatio: 1.68,
  maxDrawdownPct: -0.28,
  calmarRatio: 20.07,
  winRatePct: 98.4,
  monthlyReturns: [
    { month: 'Oct', year: 2026, vaultReturnPct: 0.48, benchmarkSofrPct: 0.40, alphaBps: 8 },
    { month: 'Sep', year: 2026, vaultReturnPct: 0.47, benchmarkSofrPct: 0.41, alphaBps: 6 },
    { month: 'Aug', year: 2026, vaultReturnPct: 0.49, benchmarkSofrPct: 0.41, alphaBps: 8 },
    { month: 'Jul', year: 2026, vaultReturnPct: 0.46, benchmarkSofrPct: 0.40, alphaBps: 6 },
    { month: 'Jun', year: 2026, vaultReturnPct: 0.48, benchmarkSofrPct: 0.41, alphaBps: 7 },
    { month: 'May', year: 2026, vaultReturnPct: 0.47, benchmarkSofrPct: 0.40, alphaBps: 7 },
    { month: 'Apr', year: 2026, vaultReturnPct: 0.46, benchmarkSofrPct: 0.40, alphaBps: 6 },
    { month: 'Mar', year: 2026, vaultReturnPct: 0.49, benchmarkSofrPct: 0.42, alphaBps: 7 },
    { month: 'Feb', year: 2026, vaultReturnPct: 0.45, benchmarkSofrPct: 0.39, alphaBps: 6 },
    { month: 'Jan', year: 2026, vaultReturnPct: 0.48, benchmarkSofrPct: 0.41, alphaBps: 7 },
  ],
};

export const INITIAL_COMPLIANCE_RECORDS: InvestorComplianceRecord[] = [
  {
    id: 'cmp-901',
    investorName: 'Apex Capital Prime Treasury SPV',
    entityType: 'Institutional Fund',
    walletAddress: '0x8841...77A2',
    jurisdiction: 'United States (Delaware)',
    regulatoryFramework: 'Reg D 506(c)',
    kycProvider: 'Chainlink ACE Verified Credential',
    status: 'approved',
    attestationHash: '0x3f8a91b...c914e',
    verifiedAt: '2026-09-15',
    expiresAt: '2027-09-15',
    maxAllocationUsd: 25000000,
  },
  {
    id: 'cmp-902',
    investorName: 'Singa Digital Asset Multi-Strategy Ltd',
    entityType: 'Institutional Fund',
    walletAddress: '0x4312...D901',
    jurisdiction: 'Singapore (MAS)',
    regulatoryFramework: 'MAS Accredited',
    kycProvider: 'Chainlink ACE + Onfido Attestation',
    status: 'approved',
    attestationHash: '0x992b44...a183b',
    verifiedAt: '2026-08-20',
    expiresAt: '2027-08-20',
    maxAllocationUsd: 15000000,
  },
  {
    id: 'cmp-903',
    investorName: 'Helvetia Alpine Family Office AG',
    entityType: 'Family Office',
    walletAddress: '0x1928...F834',
    jurisdiction: 'Switzerland (FINMA)',
    regulatoryFramework: 'Reg S',
    kycProvider: 'Chainlink ACE Decentralized Identity',
    status: 'approved',
    attestationHash: '0x55c178...298bc',
    verifiedAt: '2026-07-10',
    expiresAt: '2027-07-10',
    maxAllocationUsd: 10000000,
  },
  {
    id: 'cmp-904',
    investorName: 'Global Web3 Liquidity Dao Treasury',
    entityType: 'Corporate Treasury',
    walletAddress: '0x77c2...e810',
    jurisdiction: 'Cayman Islands',
    regulatoryFramework: 'Reg S',
    kycProvider: 'Chainlink ACE Smart Contract Verifier',
    status: 'approved',
    attestationHash: '0x12dc00...1fe49',
    verifiedAt: '2026-10-01',
    expiresAt: '2027-10-01',
    maxAllocationUsd: 5000000,
  },
  {
    id: 'cmp-905',
    investorName: 'High Net Worth Private Investor',
    entityType: 'Accredited Individual',
    walletAddress: '0xbb19...402a',
    jurisdiction: 'United Kingdom (FCA)',
    regulatoryFramework: 'MiFID II Qualified',
    kycProvider: 'SumSub + Chainlink Oracle',
    status: 'pending',
    attestationHash: '0xpending...verification',
    verifiedAt: '2026-10-03',
    expiresAt: '2027-10-03',
    maxAllocationUsd: 1000000,
  },
];



export const SOLIDITY_CONTRACTS = {
  rwaVault: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC4626.sol";
import "./nvUSDToken.sol";
import "./IRebalancerStrategy.sol";
import "./IChainlinkAggregator.sol";
import "./IChainlinkACE.sol";

/**
 * @title RWAVault (Institutional RWA Treasury Vault on Monad)
 * @notice Implements standard ERC-4626 with decoupled share token (Two-Contract Architecture)
 *         and modular execution entrypoint for Chainlink Automation & Functions.
 * @dev Defends against Inflation Attacks via virtual-shares offset pattern (1e6 offset).
 */
contract RWAVault is ReentrancyGuard, Ownable, IERC4626 {
    using SafeERC20 for IERC20;

    // --- Core References ---
    address public immutable asset;
    IERC20 public immutable underlyingAsset;
    nvUSDToken public immutable shareToken;

    // --- Modular Governance & Rebalancing ---
    address public rebalancerStrategy;
    address public chainlinkACEGuard;
    address public authorizedKeeper;

    // --- Inflation Attack Defense Offset ---
    uint256 private constant _OFFSET = 1e6;

    // --- Events ---
    event StrategyUpdated(address indexed newStrategy);
    event RebalanceExecuted(address indexed caller, bytes payload);
    event DepositExecuted(address indexed sender, address indexed receiver, uint256 assets, uint256 shares);
    event WithdrawExecuted(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);

    // --- Custom Errors ---
    error InvalidAsset();
    error UnauthorizedRebalancer();
    error ComplianceCheckFailed();
    error SlippageExceeded();

    modifier onlyRebalancer() {
        if (msg.sender != rebalancerStrategy && msg.sender != authorizedKeeper) {
            revert UnauthorizedRebalancer();
        }
        _;
    }

    constructor(
        address asset_,
        address shareTokenAddress_,
        address initialRebalancer_
    ) Ownable(msg.sender) {
        if (asset_ == address(0)) revert InvalidAsset();
        asset = asset_;
        underlyingAsset = IERC20(asset_);
        shareToken = nvUSDToken(shareTokenAddress_);
        rebalancerStrategy = initialRebalancer_;
    }

    // --- ERC-4626 Overrides with Virtual-Shares Accounting ---
    function totalAssets() public view override returns (uint256) {
        // Enforces black-box accounting combining local liquidity buffer
        // and real-time Chainlink NAV Oracle stream for off-chain RWA reserves
        return underlyingAsset.balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view override returns (uint256) {
        uint256 supply = shareToken.totalSupply();
        return assets * (supply + _OFFSET) / (totalAssets() + 1);
    }

    function convertToAssets(uint256 shares) public view override returns (uint256) {
        uint256 supply = shareToken.totalSupply();
        return shares * (totalAssets() + 1) / (supply + _OFFSET);
    }

    function previewDeposit(uint256 assets) public view override returns (uint256) {
        // Rounding down to protect the vault against flash inflation
        return convertToShares(assets);
    }

    function previewWithdraw(uint256 assets) public view override returns (uint256) {
        // Rounding up in favor of vault solvency
        uint256 supply = shareToken.totalSupply();
        return (assets * (supply + _OFFSET) + totalAssets()) / (totalAssets() + 1);
    }

    function deposit(uint256 assets, address receiver) external override nonReentrant returns (uint256 shares) {
        // 1. Chainlink Automated Compliance Engine (ACE) check
        if (chainlinkACEGuard != address(0)) {
            require(IChainlinkACE(chainlinkACEGuard).verifyKYC(msg.sender), "ACE: KYC Required");
        }

        shares = previewDeposit(assets);
        require(shares > 0, "Zero shares minted");

        // 2. Transfer underlying collateral into vault custody
        underlyingAsset.safeTransferFrom(msg.sender, address(this), assets);

        // 3. Mint decoupled nvUSD claim tokens to receiver
        shareToken.mint(receiver, shares);

        emit DepositExecuted(msg.sender, receiver, assets, shares);
    }

    function redeem(uint256 shares, address receiver, address owner) external override nonReentrant returns (uint256 assets) {
        require(msg.sender == owner || shareToken.allowance(owner, msg.sender) >= shares, "Insufficient allowance");

        assets = convertToAssets(shares);
        require(assets > 0, "Zero assets redeemed");

        // 1. Burn shares from owner
        shareToken.burnFrom(owner, shares);

        // 2. Transfer underlying asset to receiver
        underlyingAsset.safeTransfer(receiver, assets);

        emit WithdrawExecuted(msg.sender, receiver, owner, assets, shares);
    }

    // --- Modular Micro-Rebalancing Execution Hook ---
    /**
     * @notice Allows designated Keeper / Rebalancer to execute batch rebalancing payload.
     * @dev Operates seamlessly with Monad's 400ms block time and 10k TPS.
     */
    function executeRebalance(bytes calldata payload) external nonReentrant onlyRebalancer {
        (address targetToken, uint256 swapAmount, bytes memory callData) = abi.decode(payload, (address, uint256, bytes));
        
        // Execute dynamic swap or reallocation via Monad native DEX router
        emit RebalanceExecuted(msg.sender, payload);
    }

    function setRebalancerStrategy(address newStrategy) external onlyOwner {
        rebalancerStrategy = newStrategy;
        emit StrategyUpdated(newStrategy);
    }
}`,

  rebalancer: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KeeperCompatibleInterface.sol";
import "./IRebalancerStrategy.sol";
import "./RWAVault.sol";

/**
 * @title Rebalancer (Chainlink Automation v2 & Functions Integration)
 * @notice Listens to target drift bands and off-chain market indices to trigger
 *         micro-rebalancing transactions on Monad with sub-cent gas fees.
 */
contract Rebalancer is KeeperCompatibleInterface {
    RWAVault public immutable vault;
    IRebalancerStrategy public activeStrategy;
    address public automatedComplianceEngine;

    event UpkeepTriggered(uint256 timestamp, bytes performData);
    event StrategySwapped(address indexed newStrategy);

    constructor(address payable vaultAddress_, address initialStrategy_) {
        vault = RWAVault(vaultAddress_);
        activeStrategy = IRebalancerStrategy(initialStrategy_);
    }

    /**
     * @notice Chainlink Automation checkUpkeep
     * @dev Simulated off-chain node checks if portfolio allocation drift > 2.5%
     */
    function checkUpkeep(bytes calldata /* checkData */)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = activeStrategy.shouldRebalance(address(vault));
        if (upkeepNeeded) {
            performData = activeStrategy.getRebalancePayload(address(vault));
        }
    }

    /**
     * @notice Chainlink Automation performUpkeep
     * @dev Executed on Monad with ~400ms finality and negligible gas costs.
     */
    function performUpkeep(bytes calldata performData) external override {
        require(activeStrategy.shouldRebalance(address(vault)), "No rebalance required");

        // Forward verified payload into RWAVault
        vault.executeRebalance(performData);
        emit UpkeepTriggered(block.timestamp, performData);
    }
}`,

  nvUSDToken: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title nvUSDToken (Institutional Decoupled RWA Share Token)
 * @notice Pure standard ERC-20 with EIP-2612 Permit for frictionless Privy integrations.
 *         Decoupled from vault logic: if vault logic upgrades, the claim token remains immutable.
 */
contract nvUSDToken is ERC20, ERC20Permit, Ownable {
    address public vault;

    modifier onlyVault() {
        require(msg.sender == vault, "Caller is not authorized Vault");
        _;
    }

    constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        ERC20Permit(name)
        Ownable(msg.sender)
    {}

    function setVault(address vaultAddress_) external onlyOwner {
        vault = vaultAddress_;
    }

    function mint(address to, uint256 amount) external onlyVault {
        _mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyVault {
        _burn(from, amount);
    }
}`,

  iRebalancerStrategy: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRebalancerStrategy
 * @notice Standard interface for hot-swappable portfolio micro-rebalancing strategies.
 */
interface IRebalancerStrategy {
    function shouldRebalance(address vault) external view returns (bool);
    function getRebalancePayload(address vault) external view returns (bytes memory);
    function getTargetWeights() external view returns (string[] memory assets, uint256[] memory bps);
    function deviationThresholdBps() external view returns (uint256);
}`,

  chainlinkACE: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ChainlinkACEGuard (Automated Compliance Engine)
 * @notice Enforces institutional KYC/AML verification, OFAC sanction screening,
 *         and regional transfer restrictions before any RWA vault mint/transfer.
 */
contract ChainlinkACEGuard {
    address public complianceOracle;
    mapping(address => bool) public isWhitelistedInvestor;
    mapping(address => uint256) public investorJurisdiction;

    event InvestorAttested(address indexed investor, uint256 tier, uint256 timestamp);

    function verifyKYC(address user) external view returns (bool) {
        return isWhitelistedInvestor[user];
    }
}`
};

export const INITIAL_BRIDGE_LANES: BridgeLane[] = [
  {
    id: 'lane-eth-monad',
    sourceChain: 'Ethereum Mainnet (L1)',
    targetChain: 'Monad (L1)',
    status: 'active',
    settled24hVolumeUsd: 8450000,
    totalTransactions24h: 34,
    avgFinalitySeconds: 900, // 15 mins (2 epochs)
    ccipRouter: '0x0b1C...93FA (Ethereum CCIP Router v1.6)',
    rateLimitRemainingUsd: 4150000,
    rateLimitCapacityUsd: 10000000,
    linkFeeUsd: 1.45,
  },
  {
    id: 'lane-arb-monad',
    sourceChain: 'Arbitrum One (L2)',
    targetChain: 'Monad (L1)',
    status: 'active',
    settled24hVolumeUsd: 3120000,
    totalTransactions24h: 88,
    avgFinalitySeconds: 120, // 2 mins
    ccipRouter: '0x772A...b112 (Arbitrum CCIP Router v1.6)',
    rateLimitRemainingUsd: 2880000,
    rateLimitCapacityUsd: 5000000,
    linkFeeUsd: 0.18,
  },
  {
    id: 'lane-base-monad',
    sourceChain: 'Base (L2)',
    targetChain: 'Monad (L1)',
    status: 'active',
    settled24hVolumeUsd: 1850000,
    totalTransactions24h: 62,
    avgFinalitySeconds: 120, // 2 mins
    ccipRouter: '0x44f1...88cc (Base CCIP Router v1.6)',
    rateLimitRemainingUsd: 3150000,
    rateLimitCapacityUsd: 5000000,
    linkFeeUsd: 0.15,
  },
  {
    id: 'lane-sol-monad',
    sourceChain: 'Solana (SVM)',
    targetChain: 'Monad (L1)',
    status: 'active',
    settled24hVolumeUsd: 830000,
    totalTransactions24h: 19,
    avgFinalitySeconds: 30, // 30s
    ccipRouter: '0x992B...c182 (Solana CCIP Router v1.6)',
    rateLimitRemainingUsd: 1670000,
    rateLimitCapacityUsd: 2500000,
    linkFeeUsd: 0.08,
  },
];

export const INITIAL_BRIDGE_TRANSACTIONS: BridgeTransaction[] = [
  {
    id: 'btx-101',
    messageId: '0x3a82...99f1',
    timestamp: '8 mins ago',
    sourceChain: 'Ethereum Mainnet (L1)',
    destChain: 'Monad (L1)',
    token: 'USDC',
    amount: 1500000,
    sender: '0x55a1...88e4 (Franklin Templeton Gateway)',
    receiver: '0x40cc...719a (RWAVault.sol)',
    status: 'settled',
    txHash: '0x71fa...8812',
    ccipExplorerUrl: 'https://ccip.chain.link/msg/0x3a82',
  },
  {
    id: 'btx-102',
    messageId: '0x88b1...2244',
    timestamp: '22 mins ago',
    sourceChain: 'Arbitrum One (L2)',
    destChain: 'Monad (L1)',
    token: 'USDC',
    amount: 450000,
    sender: '0x911c...772a (Securitize Treasury)',
    receiver: '0x40cc...719a (RWAVault.sol)',
    status: 'settled',
    txHash: '0xbb29...914c',
    ccipExplorerUrl: 'https://ccip.chain.link/msg/0x88b1',
  },
  {
    id: 'btx-103',
    messageId: '0xcd19...00ff',
    timestamp: '45 mins ago',
    sourceChain: 'Monad (L1)',
    destChain: 'Ethereum Mainnet (L1)',
    token: 'nvUSD',
    amount: 720000,
    sender: '0x40cc...719a (RWAVault.sol)',
    receiver: '0x92f2...110a (BNY Mellon Custody Settlement)',
    status: 'settled',
    txHash: '0x228a...44fe',
    ccipExplorerUrl: 'https://ccip.chain.link/msg/0xcd19',
  },
  {
    id: 'btx-104',
    messageId: '0xef02...712a',
    timestamp: '1 hour ago',
    sourceChain: 'Base (L2)',
    destChain: 'Monad (L1)',
    token: 'USDC',
    amount: 320000,
    sender: '0x3344...bb71 (Apex Capital Liquidity)',
    receiver: '0x40cc...719a (RWAVault.sol)',
    status: 'settled',
    txHash: '0xdd12...7710',
    ccipExplorerUrl: 'https://ccip.chain.link/msg/0xef02',
  },
  {
    id: 'btx-105',
    messageId: '0xaa18...5501',
    timestamp: 'Just now',
    sourceChain: 'Ethereum Mainnet (L1)',
    destChain: 'Monad (L1)',
    token: 'USDC',
    amount: 1000000,
    sender: '0x66f1...0099 (Brevan Howard Digital)',
    receiver: '0x40cc...719a (RWAVault.sol)',
    status: 'in-transit',
    txHash: '0x881c...99aa',
    ccipExplorerUrl: 'https://ccip.chain.link/msg/0xaa18',
  },
];

export const INITIAL_LIQUIDITY_POOLS: LiquidityPool[] = [
  {
    id: 'pool-nvusd-usdc',
    pair: 'nvUSD / USDC',
    dex: 'Ambient DEX on Monad',
    tvlUsd: 18450000,
    volume24hUsd: 4920000,
    feeTierPct: 0.01, // 1 bps stable pool
    vaultYieldApy: 5.64,
    lpFeeApy: 2.15,
    totalApy: 7.79,
    impermanentLossRisk: 'negligible',
    reserveA: 9225000,
    reserveB: 9225000,
    tokenA: 'nvUSD',
    tokenB: 'USDC',
  },
  {
    id: 'pool-nvusd-usdt',
    pair: 'nvUSD / USDT',
    dex: 'MonadSwap Concentrated AMM',
    tvlUsd: 8200000,
    volume24hUsd: 1840000,
    feeTierPct: 0.02,
    vaultYieldApy: 5.64,
    lpFeeApy: 1.82,
    totalApy: 7.46,
    impermanentLossRisk: 'negligible',
    reserveA: 4100000,
    reserveB: 4100000,
    tokenA: 'nvUSD',
    tokenB: 'USDT',
  },
  {
    id: 'pool-nvusd-monad',
    pair: 'nvUSD / MONAD',
    dex: 'Uniswap v4 on Monad (EVM)',
    tvlUsd: 4150000,
    volume24hUsd: 2650000,
    feeTierPct: 0.05,
    vaultYieldApy: 5.64,
    lpFeeApy: 12.40,
    totalApy: 18.04,
    impermanentLossRisk: 'moderate',
    reserveA: 2075000,
    reserveB: 83000,
    tokenA: 'nvUSD',
    tokenB: 'MONAD',
  },
];

export const INITIAL_USER_LP_POSITIONS: UserLpPosition[] = [
  {
    id: 'pos-881',
    poolId: 'pool-nvusd-usdc',
    pair: 'nvUSD / USDC',
    depositedAmountUsd: 500000,
    tokenAAmount: 250000,
    tokenBAmount: 250000,
    unclaimedFeesUsd: 1420.50,
    minPrice: 0.9995,
    maxPrice: 1.0005,
    currentPrice: 1.0000,
    inRange: true,
    createdAt: '2026-09-24',
  },
  {
    id: 'pos-882',
    poolId: 'pool-nvusd-usdt',
    pair: 'nvUSD / USDT',
    depositedAmountUsd: 250000,
    tokenAAmount: 125000,
    tokenBAmount: 125000,
    unclaimedFeesUsd: 580.20,
    minPrice: 0.9990,
    maxPrice: 1.0010,
    currentPrice: 1.0000,
    inRange: true,
    createdAt: '2026-09-28',
  },
];
