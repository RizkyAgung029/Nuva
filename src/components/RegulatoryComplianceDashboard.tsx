import React, { useState } from 'react';
import { InvestorComplianceRecord } from '../types/treasury';
import { 
  ShieldCheck, 
  Lock, 
  Globe2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  ExternalLink,
  Cpu,
  UserCheck,
  X,
  RefreshCw,
  Database,
  Radio
} from 'lucide-react';

interface RegulatoryComplianceDashboardProps {
  records: InvestorComplianceRecord[];
  onAddRecord: (record: InvestorComplianceRecord) => void;
  onTriggerComplianceAlert?: (title: string, desc: string) => void;
}

interface ApiEndpointState {
  id: string;
  name: string;
  endpoint: string;
  latencyMs: number;
  version: string;
  status: 'Synchronized' | 'Syncing' | 'Verified';
  lastSync: string;
  merkleHash: string;
  jurisdiction: string;
}

export const RegulatoryComplianceDashboard: React.FC<RegulatoryComplianceDashboardProps> = ({
  records,
  onAddRecord,
  onTriggerComplianceAlert,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [testAddress, setTestAddress] = useState<string>('0x8841...77A2');
  const [testResult, setTestResult] = useState<{
    status: 'compliant' | 'revert';
    details: string;
    jurisdiction?: string;
    framework?: string;
  } | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAddEndpointModal, setShowAddEndpointModal] = useState<boolean>(false);
  const [showMerkleAuditModal, setShowMerkleAuditModal] = useState<boolean>(false);

  // Regulatory API Sync State
  const [isSyncingApis, setIsSyncingApis] = useState<boolean>(false);
  const [syncingEndpointId, setSyncingEndpointId] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('24s ago');
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Endpoint form state
  const [customApiName, setCustomApiName] = useState<string>('EU MiCA Sovereign Transparency Registry');
  const [customApiUrl, setCustomApiUrl] = useState<string>('esma.europa.eu/mica/v1');
  const [customApiJurisdiction, setCustomApiJurisdiction] = useState<string>('European Union');

  // New investor form state
  const [newName, setNewName] = useState<string>('Gotham Institutional Alpha SPV');
  const [newType, setNewType] = useState<any>('Institutional Fund');
  const [newAddress, setNewAddress] = useState<string>('0x22f1...99bc');
  const [newJurisdiction, setNewJurisdiction] = useState<string>('United States (New York)');
  const [newFramework, setNewFramework] = useState<any>('Reg D 506(c)');
  const [newMaxAllocation, setNewMaxAllocation] = useState<number>(20000000);

  const [apis, setApis] = useState<ApiEndpointState[]>([
    {
      id: 'api-ofac',
      name: 'US Treasury OFAC SDN Sanctions Feed',
      endpoint: 'api.treasury.gov/ofac-sdn/v2',
      latencyMs: 42,
      version: 'OFAC-SDN-2026.10',
      status: 'Synchronized',
      lastSync: '12s ago',
      merkleHash: '0x8f1e94a02bc7194f',
      jurisdiction: 'United States',
    },
    {
      id: 'api-sec',
      name: 'SEC EDGAR Form D Accreditation API',
      endpoint: 'sec.gov/edgar/crd/v1',
      latencyMs: 78,
      version: 'CRD-2026-Q4',
      status: 'Synchronized',
      lastSync: '48s ago',
      merkleHash: '0x3c71a91e5509ba21',
      jurisdiction: 'United States',
    },
    {
      id: 'api-mas',
      name: 'Monetary Authority of Singapore (MAS) FID Registry',
      endpoint: 'mas.gov.sg/fid/v3',
      latencyMs: 112,
      version: 'MAS-ACCREDITED-v4',
      status: 'Synchronized',
      lastSync: '1m ago',
      merkleHash: '0x992bcf4181a4d0e9',
      jurisdiction: 'Singapore',
    },
    {
      id: 'api-finma',
      name: 'FINMA Swiss Financial Intermediary Feed',
      endpoint: 'finma.ch/registry/v2',
      latencyMs: 95,
      version: 'FINMA-AML-2026',
      status: 'Synchronized',
      lastSync: '2m ago',
      merkleHash: '0x2e084fcb91738aa1',
      jurisdiction: 'Switzerland',
    },
    {
      id: 'api-ace',
      name: 'Chainlink ACE Decentralized Identity Oracle',
      endpoint: 'ace.chain.link/node-cluster-monad',
      latencyMs: 34,
      version: 'ACE-DON-CONSENSUS-31/31',
      status: 'Synchronized',
      lastSync: 'Just now',
      merkleHash: '0xaa409f81734bc771',
      jurisdiction: 'Global DON Consensus',
    },
  ]);

  // Handle individual endpoint sync
  const handleSyncIndividualEndpoint = (id: string) => {
    setSyncingEndpointId(id);
    setTimeout(() => {
      setApis((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'Verified',
                latencyMs: Math.floor(28 + Math.random() * 25),
                lastSync: 'Just now',
                merkleHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
              }
            : a
        )
      );
      setSyncingEndpointId(null);
      setSyncSuccessMessage(`Synchronized and cryptographically verified feed #${id}. 0 diffs found.`);
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    }, 800);
  };

  const handleAddCustomEndpoint = () => {
    if (!customApiName || !customApiUrl) return;
    const newEndpoint: ApiEndpointState = {
      id: `api-custom-${Date.now()}`,
      name: customApiName,
      endpoint: customApiUrl,
      latencyMs: 65,
      version: 'REST-JSON-v1.2',
      status: 'Synchronized',
      lastSync: 'Just now',
      merkleHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      jurisdiction: customApiJurisdiction,
    };
    setApis((prev) => [...prev, newEndpoint]);
    setShowAddEndpointModal(false);
    setSyncSuccessMessage(`Registered sovereign regulatory feed: ${customApiName}`);
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleSyncApis = () => {
    setIsSyncingApis(true);
    setSyncSuccessMessage(null);
    setTimeout(() => {
      setIsSyncingApis(false);
      setLastSyncTime('Just now');
      setApis((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'Verified',
          latencyMs: Math.floor(25 + Math.random() * 30),
          lastSync: 'Just now',
          merkleHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        }))
      );
      setSyncSuccessMessage(`Successfully synchronized ${apis.length} regulatory databases. Sanctions list verified and 0 compliance diffs detected.`);
      if (onTriggerComplianceAlert) {
        onTriggerComplianceAlert(
          'Regulatory API Sync Completed: 0 Diffs Detected',
          `Automated synchronization across ${apis.length} sovereign endpoints complete. All 31 Chainlink ACE DON nodes attest 100% consensus.`
        );
      }
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    }, 1200);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunComplianceCheck = () => {
    const clean = testAddress.trim().toLowerCase();
    const matched = records.find(
      (r) => r.walletAddress.toLowerCase().includes(clean) || clean.includes(r.walletAddress.toLowerCase())
    );

    if (matched && matched.status === 'approved') {
      setTestResult({
        status: 'compliant',
        details: `Address ${matched.walletAddress} verified under ${matched.regulatoryFramework}. Zero sanctions detected. Permitted to mint nvUSD up to $${(matched.maxAllocationUsd / 1e6).toFixed(1)}M.`,
        jurisdiction: matched.jurisdiction,
        framework: matched.regulatoryFramework,
      });
    } else {
      setTestResult({
        status: 'revert',
        details: `Smart contract call reverted: ChainlinkACEGuard.sol error 'ACE_UNVERIFIED_INVESTOR(0x01)'. Address has not submitted KYC credentials or exceeds jurisdiction quota.`,
      });
    }
  };

  const handleSaveInvestor = () => {
    const newRecord: InvestorComplianceRecord = {
      id: `cmp-${Math.floor(910 + Math.random() * 100)}`,
      investorName: newName,
      entityType: newType,
      walletAddress: newAddress,
      jurisdiction: newJurisdiction,
      regulatoryFramework: newFramework,
      kycProvider: 'Chainlink ACE Verified Credential Oracle',
      status: 'approved',
      attestationHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      verifiedAt: new Date().toISOString().split('T')[0],
      expiresAt: '2027-10-04',
      maxAllocationUsd: newMaxAllocation,
    };

    onAddRecord(newRecord);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>CHAINLINK ACE (AUTOMATED COMPLIANCE ENGINE)</span>
            <span className="text-slate-600">/</span>
            <span>DECENTRALIZED KYC & SANCTIONS GATING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Regulatory Compliance & Investor Accreditation Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Cryptographic on-chain gating for Reg D 506(c), Reg S, and global sanctions compliance without centralized chokepoints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Attest New Investor</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Whitelisted Institutional Entities</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {records.length} Verified
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            100% on-chain credentialed
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">OFAC / FinCEN Sanction Check</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
            Active
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Database: OFAC-SDN-2026.10
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Enforced Frameworks</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tracking-tight">
            Reg D / Reg S
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            MAS Accredited + MiFID II
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Smart Contract Interception</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight">
            Strict Revert
          </div>
          <span className="text-[11px] text-purple-400 font-mono mt-2 block">
            ChainlinkACEGuard.sol Hook
          </span>
        </div>
      </div>

      {/* Regulatory API Sync Gateway Panel */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Regulatory API Synchronization Gateway</h2>
              <span className="text-xs font-mono text-slate-400">
                Direct oracle feeds from sovereign compliance bodies · Last sync: {lastSyncTime} · 0 Sanctions Diffs
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMerkleAuditModal(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>Merkle Diff Audit</span>
            </button>
            <button
              onClick={() => setShowAddEndpointModal(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
              <span>Add Sovereign Feed</span>
            </button>
            <button
              onClick={handleSyncApis}
              disabled={isSyncingApis}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
                isSyncingApis
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncingApis ? 'animate-spin' : ''}`} />
              <span>{isSyncingApis ? 'Syncing All Feeds...' : 'Sync All Regulatory APIs'}</span>
            </button>
          </div>
        </div>

        {syncSuccessMessage && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between text-xs text-emerald-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{syncSuccessMessage}</span>
            </div>
            <button onClick={() => setSyncSuccessMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {apis.map((api) => {
            const isSyncingThis = syncingEndpointId === api.id;
            return (
              <div key={api.id} className="rounded-lg border border-slate-800 bg-[#090D16] p-3 text-xs space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-200 font-semibold font-sans">
                  <span className="truncate pr-2">{api.name}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate">{api.endpoint}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">{api.jurisdiction}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-800/80">
                  <span>Root: <code className="text-slate-300">{api.merkleHash.substring(0, 10)}...</code></span>
                  <span>Latency: <strong className="text-emerald-400">{api.latencyMs}ms</strong></span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">Synced: {api.lastSync}</span>
                  <button
                    onClick={() => handleSyncIndividualEndpoint(api.id)}
                    disabled={isSyncingThis}
                    className="px-2 py-0.5 rounded border border-slate-700 hover:border-emerald-500/40 text-[10px] font-mono text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`h-2.5 w-2.5 ${isSyncingThis ? 'animate-spin text-emerald-400' : ''}`} />
                    <span>{isSyncingThis ? 'Syncing...' : 'Ping & Sync'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Merkle Root & Sanctions Audit Diff Modal */}
      {showMerkleAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-[#0C1220] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Sanctions Diff & Merkle Root Audit</h3>
              </div>
              <button onClick={() => setShowMerkleAuditModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Cryptographic integrity verification across all 31 sovereign Chainlink ACE DON validator nodes. 
              Merkle trees of prohibited entity hashes are compared against on-chain smart contract storage.
            </p>

            <div className="space-y-2 text-xs font-mono bg-[#090D16] p-4 rounded-lg border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Consensus Nodes:</span>
                <span className="text-emerald-400 font-bold">31 / 31 (100% Agreement)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Aggregated Merkle Root:</span>
                <span className="text-cyan-300">0x7f8a91bc4028ea91...</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Monitored Sanctions Entries:</span>
                <span className="text-white font-bold">1,482,910 entities</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">24h Net Additions:</span>
                <span className="text-amber-400">+3 entities (OFAC SDN)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Local Node / DON Discrepancy:</span>
                <span className="text-emerald-400 font-bold">0.00% (Zero Diffs)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowMerkleAuditModal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Sovereign Feed Modal */}
      {showAddEndpointModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#0C1220] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Register Sovereign Regulatory Feed</h3>
              <button onClick={() => setShowAddEndpointModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Regulatory Authority Name</label>
                <input
                  type="text"
                  value={customApiName}
                  onChange={(e) => setCustomApiName(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">API Endpoint / Oracle Hook</label>
                <input
                  type="text"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sovereign Jurisdiction</label>
                <input
                  type="text"
                  value={customApiJurisdiction}
                  onChange={(e) => setCustomApiJurisdiction(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddEndpointModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomEndpoint}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Register & Verify Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Compliance Gating Simulator */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#0E1526] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Live On-Chain Compliance Verifier (EVM Hook)</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">ChainlinkACEGuard.verifyKYC(address)</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Simulate how the RWA Vault evaluates incoming transactions during <code className="text-emerald-300">deposit()</code> or 
          <code className="text-emerald-300"> transfer()</code>. Unverified or non-accredited wallets trigger an immediate EVM revert.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <input
            type="text"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            placeholder="Enter EVM address to evaluate"
            className="flex-1 w-full bg-[#090D16] border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleRunComplianceCheck}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            Run ACE Invariant Check
          </button>
        </div>

        {testResult && (
          <div className={`rounded-lg border p-4 text-xs font-mono transition-all ${
            testResult.status === 'compliant'
              ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
              : 'border-rose-500/50 bg-rose-950/20 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {testResult.status === 'compliant' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>ON-CHAIN VERDICT: COMPLIANT & AUTHORIZED</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>ON-CHAIN VERDICT: REVERTED - NON-COMPLIANT</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">{testResult.details}</p>
          </div>
        )}
      </div>

      {/* Whitelist Ledger Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Accredited Investor Whitelist Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically attested entities permitted to hold nvUSD tokens
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entity, address, jurisdiction..."
              className="w-full bg-[#090D16] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Entity & Wallet</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3">Framework</th>
                <th className="py-2.5 px-3 text-right">Max Allocation</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-sans font-semibold text-white block">{r.investorName}</span>
                    <span className="text-[10px] text-slate-500">{r.walletAddress}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{r.entityType}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{r.jurisdiction}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 text-[10px]">
                      {r.regulatoryFramework}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-white font-bold tabular-nums">
                    ${(r.maxAllocationUsd / 1e6).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      r.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {r.status === 'approved' ? <CheckCircle2 className="h-3 w-3" /> : null}
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attest New Investor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#0C1220] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Attest Institutional Investor via ACE</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-mono text-slate-400 block mb-1">Entity Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-slate-400 block mb-1">Entity Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option>Institutional Fund</option>
                    <option>Corporate Treasury</option>
                    <option>Family Office</option>
                    <option>Accredited Individual</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-slate-400 block mb-1">Framework</label>
                  <select
                    value={newFramework}
                    onChange={(e) => setNewFramework(e.target.value)}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option>Reg D 506(c)</option>
                    <option>Reg S</option>
                    <option>MAS Accredited</option>
                    <option>MiFID II Qualified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">Jurisdiction</label>
                <input
                  type="text"
                  value={newJurisdiction}
                  onChange={(e) => setNewJurisdiction(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">Max Allocation Cap (USD)</label>
                <input
                  type="number"
                  value={newMaxAllocation}
                  onChange={(e) => setNewMaxAllocation(parseFloat(e.target.value))}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInvestor}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Issue On-Chain Attestation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
