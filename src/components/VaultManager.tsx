import React, { useState } from 'react';
import { VaultAsset, PrivySigner } from '../types/treasury';
import { 
  Lock, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck, 
  Info, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

interface VaultManagerProps {
  assets: VaultAsset[];
  totalVaultAssetsUsd: number;
  totalSharesMinted: number;
  onDeposit: (amount: number) => void;
  onRedeem: (shares: number) => void;
  currentSigner: PrivySigner;
}

export const VaultManager: React.FC<VaultManagerProps> = ({
  assets,
  totalVaultAssetsUsd,
  totalSharesMinted,
  onDeposit,
  onRedeem,
  currentSigner,
}) => {
  const [activeAction, setActiveAction] = useState<'deposit' | 'redeem'>('deposit');
  const [depositAmount, setDepositAmount] = useState<string>('50000');
  const [redeemShares, setRedeemShares] = useState<string>('25000');
  const [showAttackExplainer, setShowAttackExplainer] = useState<boolean>(false);
  const [simulatedOffsetEnabled, setSimulatedOffsetEnabled] = useState<boolean>(true);
  const [txSuccessMessage, setTxSuccessMessage] = useState<string | null>(null);

  const VIRTUAL_OFFSET = 1000000; // 1e6 virtual shares offset

  // ERC-4626 Math calculation
  const numDeposit = parseFloat(depositAmount) || 0;
  const numRedeem = parseFloat(redeemShares) || 0;

  // convertToShares formula
  const calculatedShares = totalVaultAssetsUsd > 0
    ? (numDeposit * (totalSharesMinted + (simulatedOffsetEnabled ? VIRTUAL_OFFSET : 0))) / 
      (totalVaultAssetsUsd + 1)
    : numDeposit;

  // convertToAssets formula
  const calculatedRedeemAssets = (totalSharesMinted + (simulatedOffsetEnabled ? VIRTUAL_OFFSET : 0)) > 0
    ? (numRedeem * (totalVaultAssetsUsd + 1)) / 
      (totalSharesMinted + (simulatedOffsetEnabled ? VIRTUAL_OFFSET : 0))
    : numRedeem;

  const currentSharePrice = totalSharesMinted > 0 ? totalVaultAssetsUsd / totalSharesMinted : 1.0;

  const handleExecuteDeposit = () => {
    if (numDeposit <= 0) return;
    onDeposit(numDeposit);
    setTxSuccessMessage(`Successfully minted ${calculatedShares.toLocaleString(undefined, { maximumFractionDigits: 2 })} nvUSD shares for $${numDeposit.toLocaleString()} USDC via Privy Wallet Action.`);
    setTimeout(() => setTxSuccessMessage(null), 6000);
  };

  const handleExecuteRedeem = () => {
    if (numRedeem <= 0) return;
    onRedeem(numRedeem);
    setTxSuccessMessage(`Successfully redeemed ${numRedeem.toLocaleString()} nvUSD shares for $${calculatedRedeemAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC.`);
    setTimeout(() => setTxSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-8">
      {/* Title & Architecture Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>CORE ARCHITECTURE</span>
            <span className="text-slate-600">/</span>
            <span>DECOUPLED TWO-CONTRACT ERC-4626 STANDARD</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            ERC-4626 Tokenized Vault & Share Accounting
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Engineered with separated vault logic (<code className="text-slate-200">RWAVault.sol</code>) and 
            claim tokens (<code className="text-slate-200">nvUSDToken.sol</code>) for institutional trust and upgradability.
          </p>
        </div>

        <button
          onClick={() => setShowAttackExplainer(!showAttackExplainer)}
          className="self-start md:self-auto px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>{showAttackExplainer ? 'Hide Security Details' : 'Inflation Attack Defense'}</span>
        </button>
      </div>

      {/* Inflation Attack Defense Sandbox / Explainer */}
      {showAttackExplainer && (
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Vulnerability Mitigation: Inflation & Donation Attack
              </span>
              <h3 className="text-base font-bold text-white">
                OpenZeppelin Virtual-Shares Offset Pattern (1e6 Offset)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Virtual Offset:</span>
              <button
                onClick={() => setSimulatedOffsetEnabled(!simulatedOffsetEnabled)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  simulatedOffsetEnabled 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {simulatedOffsetEnabled ? 'PROTECTED (OFFSET ON)' : 'VULNERABLE (OFFSET OFF)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
              <span className="font-semibold text-white block">The Attack Vector (Without Offset)</span>
              <p className="text-slate-400 leading-relaxed">
                A malicious first depositor deposits 1 wei, receiving 1 share. They then donate 1,000,000 USDC directly 
                to the vault. The share price becomes $1,000,000 per share. When a second user attempts to deposit 
                $500,000, integer division rounds their shares down to <span className="text-rose-400 font-bold">0 shares</span>, 
                stealing their entire deposit.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-2">
              <span className="font-semibold text-emerald-300 block">NUVA's Implementation (With Offset)</span>
              <p className="text-slate-400 leading-relaxed">
                By maintaining a virtual supply offset of 1,000,000 shares (<code className="text-emerald-400">_OFFSET = 1e6</code>), 
                the share price cannot be artificially multiplied by small donations. The attacker would have to donate 
                billions of dollars without capturing economic surplus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {txSuccessMessage && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{txSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setTxSuccessMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Deposit & Redeem Console (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg max-w-xs">
            <button
              onClick={() => setActiveAction('deposit')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeAction === 'deposit'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>Deposit Collateral</span>
            </button>
            <button
              onClick={() => setActiveAction('redeem')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeAction === 'redeem'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Redeem Shares</span>
            </button>
          </div>

          {activeAction === 'deposit' ? (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Deposit Asset & Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter USDC amount"
                    className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">USDC</span>
                    <button
                      onClick={() => setDepositAmount('100000')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      $100k
                    </button>
                    <button
                      onClick={() => setDepositAmount('500000')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      $500k
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion Preview Box */}
              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Current nvUSD Share NAV:</span>
                  <span className="text-white font-semibold">${currentSharePrice.toFixed(5)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Calculated Shares Minted:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {calculatedShares.toLocaleString('en-US', { maximumFractionDigits: 2 })} nvUSD
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Yield (Annualized):</span>
                  <span className="text-emerald-400 font-semibold">5.62% APY (Compounds Hourly)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rounding Mode (ERC-4626):</span>
                  <span className="text-slate-300">Down (Favoring Vault Solvency)</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    Chainlink ACE Compliance:
                  </span>
                  <span className="text-emerald-400 font-semibold">Attestation Verified (KYC Pass)</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecuteDeposit}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deposit & Mint nvUSD via Privy Action</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="text-center text-[11px] text-slate-500 font-mono">
                Gas sponsored by Monad Paymaster · Transaction finality in ~800ms
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">
                  Shares to Redeem (nvUSD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={redeemShares}
                    onChange={(e) => setRedeemShares(e.target.value)}
                    placeholder="Enter nvUSD shares"
                    className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">nvUSD</span>
                    <button
                      onClick={() => setRedeemShares('50000')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      50k
                    </button>
                    <button
                      onClick={() => setRedeemShares('250000')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition-colors cursor-pointer"
                    >
                      250k
                    </button>
                  </div>
                </div>
              </div>

              {/* Redemption Preview Box */}
              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Current nvUSD NAV:</span>
                  <span className="text-white font-semibold">${currentSharePrice.toFixed(5)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gross Redemption Value:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    ${calculatedRedeemAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Protocol Exit Fee:</span>
                  <span className="text-slate-300">0.00% (Zero exit penalty)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Privy Quorum Requirement:</span>
                  <span className={numRedeem * currentSharePrice > 100000 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                    {numRedeem * currentSharePrice > 100000 ? 'Dual-Approval Quorum Required (>$100k)' : 'Single Direct Signer'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecuteRedeem}
                className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Redemption & Burn nvUSD</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="text-center text-[11px] text-slate-500 font-mono">
                Redemption settled atomically into connected Privy smart account
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Architectural Deep-Dive & Dual-Contract Proof (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Two-Contract Separation Architecture */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
              <Layers className="h-4 w-4" />
              <span>Architectural Rigor</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Why Two Separate Contracts?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              As emphasized in the hackathon strategic blueprint, monolithic single-contract vaults 
              pose existential regulatory and investor risks when updating yield or rebalancing strategies.
            </p>

            <div className="space-y-3 pt-2">
              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs space-y-1">
                <span className="font-semibold text-emerald-400 block font-mono">
                  1. Financial Trust & Immutability
                </span>
                <p className="text-slate-400 leading-relaxed">
                  The <code className="text-slate-200">nvUSD</code> token contract remains completely static 
                  and independent. Rebalancing strategies or oracle logic can be updated without reissuing claim tokens.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs space-y-1">
                <span className="font-semibold text-cyan-400 block font-mono">
                  2. Regulatory Auditability
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Securities regulators and institutional custodians audit a lightweight ERC-20 token interface, 
                  leaving complex DeFi swaps and Chainlink keepers isolated in the vault backend.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs space-y-1">
                <span className="font-semibold text-purple-400 block font-mono">
                  3. Non-Standard Asset Resiliency
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Safely handles tokens with custom fee-on-transfer hooks or compliance restrictions 
                  without compromising share accounting math.
                </p>
              </div>
            </div>
          </div>

          {/* Current Signer Privy Session Badge */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5 space-y-2 text-xs">
            <span className="text-slate-400 font-mono block">Active Corporate Authority</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">{currentSigner.name}</span>
                <span className="text-[11px] font-mono text-emerald-400">{currentSigner.role} · {currentSigner.address}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                MPC Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
