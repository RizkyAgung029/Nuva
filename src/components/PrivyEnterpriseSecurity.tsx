import React, { useState } from 'react';
import { PrivySigner, QuorumRequest } from '../types/treasury';
import { 
  Shield, 
  Users, 
  Key, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  ArrowRight, 
  FileText, 
  Plus, 
  Check, 
  X,
  ExternalLink,
  Sliders,
  Sparkles
} from 'lucide-react';

interface PrivyEnterpriseSecurityProps {
  currentSigner: PrivySigner;
  allSigners: PrivySigner[];
  quorumRequests: QuorumRequest[];
  onApproveRequest: (requestId: string, signer: PrivySigner) => void;
  onSwitchSigner: (signer: PrivySigner) => void;
}

export const PrivyEnterpriseSecurity: React.FC<PrivyEnterpriseSecurityProps> = ({
  currentSigner,
  allSigners,
  quorumRequests,
  onApproveRequest,
  onSwitchSigner,
}) => {
  const [dailyLimitUsd] = useState<number>(1000000);
  const [dailySpentUsd] = useState<number>(242000);
  const [activeSubTab, setActiveSubTab] = useState<'quorum' | 'policies' | 'wallet-actions'>('quorum');
  const [approvedNotification, setApprovedNotification] = useState<string | null>(null);

  const handleSign = (request: QuorumRequest) => {
    onApproveRequest(request.id, currentSigner);
    setApprovedNotification(`Approved request #${request.id} as ${currentSigner.name} (${currentSigner.role})`);
    setTimeout(() => setApprovedNotification(null), 5000);
  };

  const spentPercentage = Math.min(100, (dailySpentUsd / dailyLimitUsd) * 100);

  return (
    <div className="space-y-8">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>PRIVY ENTERPRISE INFRASTRUCTURE</span>
            <span className="text-slate-600">/</span>
            <span>ZERO-FRICTION ONBOARDING & QUORUM SECURITY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Privy Enterprise Identity & Multi-Sig Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Institutional MPC embedded wallets with granular quorum policies, team role-based permissions, and wallet actions abstraction.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 text-xs font-mono text-purple-300">
          <Key className="h-3.5 w-3.5" />
          <span>MPC Shamir Secret Shares: 3/3 Healthy</span>
        </div>
      </div>

      {/* Corporate User Session Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
              {currentSigner.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">{currentSigner.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {currentSigner.role}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                Privy Embedded Address: <span className="text-slate-200">{currentSigner.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-mono">Simulate Alternate Authority:</span>
              <span className="text-xs text-slate-300">Switch role to satisfy quorum threshold</span>
            </div>
            <select
              value={currentSigner.id}
              onChange={(e) => {
                const found = allSigners.find((s) => s.id === e.target.value);
                if (found) onSwitchSigner(found);
              }}
              className="bg-[#090D16] border border-slate-700 text-xs font-mono text-slate-200 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-emerald-500"
            >
              {allSigners.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.role}: {s.name} ({s.address.slice(0, 6)}...)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {approvedNotification && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{approvedNotification}</span>
          </div>
          <button 
            onClick={() => setApprovedNotification(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub Navigation Controls */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-xs">
        <button
          onClick={() => setActiveSubTab('quorum')}
          className={`px-3 py-2 font-semibold transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeSubTab === 'quorum'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Quorum Approval Queue ({quorumRequests.filter((r) => r.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setActiveSubTab('policies')}
          className={`px-3 py-2 font-semibold transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeSubTab === 'policies'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Security Policies & Spend Limits
        </button>
        <button
          onClick={() => setActiveSubTab('wallet-actions')}
          className={`px-3 py-2 font-semibold transition-colors cursor-pointer border-b-2 -mb-1 ${
            activeSubTab === 'wallet-actions'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Privy Wallet Actions Abstraction
        </button>
      </div>

      {/* Sub-Tab 1: Quorum Approvals Queue */}
      {activeSubTab === 'quorum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {quorumRequests.map((req) => {
              const alreadySigned = req.signers.some((s) => s.id === currentSigner.id);
              const isExecutable = req.currentApprovals >= req.requiredApprovals;

              return (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-400">Request #{req.id}</span>
                      <span className="font-bold text-white text-base">{req.action}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        req.status === 'executed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      Amount: <strong className="text-white text-sm tabular-nums">${req.amountUsd.toLocaleString()} USD</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {req.payloadSummary}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400">Quorum Progress:</span>
                        <span className="font-bold text-white">
                          {req.currentApprovals} of {req.requiredApprovals} Signatures Collected
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                        <span>Signed by:</span>
                        {req.signers.map((s) => (
                          <span key={s.id} className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                            {s.role} ({s.name})
                          </span>
                        ))}
                      </div>
                    </div>

                    {req.status === 'pending' && (
                      <div>
                        {alreadySigned ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Signed by current account</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSign(req)}
                            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Key className="h-3.5 w-3.5" />
                            <span>Sign & Authorize as {currentSigner.role}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Granular Security Policies */}
      {activeSubTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Velocity Limit */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-semibold uppercase">
                Velocity Limiting
              </span>
              <span className="text-xs font-mono text-slate-400">Rolling 24h Window</span>
            </div>

            <h3 className="text-base font-bold text-white">Daily Outflow Velocity Cap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prevents unauthorized balance draining. Any single or cumulative transfers exceeding 
              $1,000,000 automatically pause transactions and enforce a 24h timelock.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Current 24h Outflow:</span>
                <span className="text-white font-bold">${dailySpentUsd.toLocaleString()} / ${dailyLimitUsd.toLocaleString()}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${spentPercentage}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-emerald-400">
                {(100 - spentPercentage).toFixed(1)}% Capacity Remaining ($758,000 available)
              </div>
            </div>
          </div>

          {/* Contract Allowlist */}
          <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Target Whitelist
              </span>
              <span className="text-xs font-mono text-emerald-400">3 Approved Contracts</span>
            </div>

            <h3 className="text-base font-bold text-white">Institutional Contract Allowlist</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Privy embedded treasury wallet cannot invoke arbitrary addresses. 
              Only verified on-chain adapters may receive calldata.
            </p>

            <div className="space-y-2 pt-1 text-xs font-mono">
              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Monad Native DEX Router</span>
                  <span className="text-[10px] text-slate-500">0x39a1...84c1</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Whitelisted</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Chainlink Rebalancer Engine</span>
                  <span className="text-[10px] text-slate-500">0x88f2...b129</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Whitelisted</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#090D16] p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">BNY Mellon Custody Settlement</span>
                  <span className="text-[10px] text-slate-500">0x12dc...001f</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Whitelisted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Privy Wallet Actions Abstraction */}
      {activeSubTab === 'wallet-actions' && (
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase">
                Zero-Friction UX
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Privy High-Level Wallet Actions Integration
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">SDK v1.82.0</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            In standard Web3 apps, depositing into an RWA vault requires four friction points: 
            connecting an external wallet, approving token spending, signing an EIP-712 permit, 
            and finally executing the deposit. With <strong>Privy Wallet Actions</strong>, this is 
            batched into a single declarative API call, abstracting gas fees and calldata completely:
          </p>

          {/* Interactive Code Snippet */}
          <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4 font-mono text-xs overflow-x-auto text-slate-300">
            <div className="text-slate-500 mb-2">// Frontend/Treasury integration using Privy Wallet Actions</div>
            <span className="text-purple-400">const</span> {'{'} executeWalletAction {'}'} = <span className="text-cyan-400">usePrivyWalletActions</span>();<br /><br />
            <span className="text-slate-500">// One-click batched institutional deposit</span><br />
            <span className="text-purple-400">await</span> executeWalletAction({'{'}<br />
            &nbsp;&nbsp;action: <span className="text-emerald-400">'DEPOSIT_RWA_VAULT'</span>,<br />
            &nbsp;&nbsp;params: {'{'}<br />
            &nbsp;&nbsp;&nbsp;&nbsp;vaultAddress: <span className="text-emerald-400">'0x8841...77A2'</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;asset: <span className="text-emerald-400">'USDC'</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;amount: <span className="text-cyan-400">500000n</span> * <span className="text-cyan-400">10n**6n</span>, <span className="text-slate-500">// $500,000</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;receiver: user.wallet.address,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;sponsorGas: <span className="text-purple-400">true</span> <span className="text-slate-500">// Monad Paymaster</span><br />
            &nbsp;&nbsp;{'}'},<br />
            &nbsp;&nbsp;policies: [<span className="text-emerald-400">'QUORUM_APPROVAL_2_OF_3'</span>]<br />
            {'}'});
          </div>
        </div>
      )}
    </div>
  );
};
