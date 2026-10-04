import React, { useState } from 'react';
import { SOLIDITY_CONTRACTS } from '../data/mockBlockchain';
import { 
  Code, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Terminal,
  FileCode
} from 'lucide-react';

export const ContractsViewer: React.FC = () => {
  const [activeContract, setActiveContract] = useState<keyof typeof SOLIDITY_CONTRACTS>('rwaVault');
  const [copied, setCopied] = useState<boolean>(false);

  const contractTabs = [
    { id: 'rwaVault', label: 'RWAVault.sol (ERC-4626)', type: 'Vault Logic' },
    { id: 'nvUSDToken', label: 'nvUSDToken.sol', type: 'Decoupled Claim Token' },
    { id: 'rebalancer', label: 'Rebalancer.sol', type: 'Chainlink Keeper' },
    { id: 'iRebalancerStrategy', label: 'IRebalancerStrategy.sol', type: 'Strategy Interface' },
    { id: 'chainlinkACE', label: 'ChainlinkACEGuard.sol', type: 'Compliance Engine' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACTS[activeContract]);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([SOLIDITY_CONTRACTS[activeContract]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeContract}.sol`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>SMART CONTRACT ARCHITECTURE</span>
            <span className="text-slate-600">/</span>
            <span>PRODUCTION SOLIDITY 0.8.20</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dual-Contract ERC-4626 & Chainlink Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Auditable, modular contracts compiled for Monad EVM. Implements virtual-share offset against inflation attacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .sol</span>
          </button>
        </div>
      </div>

      {/* Contract Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        {contractTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveContract(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap text-left ${
              activeContract === tab.id
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCode className="h-3.5 w-3.5 text-emerald-400" />
              <span>{tab.label}</span>
            </div>
            <span className="text-[10px] text-slate-500 block pl-5">{tab.type}</span>
          </button>
        ))}
      </div>

      {/* Code Display Sandbox */}
      <div className="rounded-xl border border-slate-800 bg-[#070B12] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-[#0A0F1A] text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-200 font-semibold">{activeContract}.sol</span>
            <span className="text-slate-600">·</span>
            <span>Solidity ^0.8.20</span>
            <span className="text-slate-600">·</span>
            <span>Monad EVM Compatible</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              OpenZeppelin Verified
            </span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
          <pre className="text-xs font-mono text-slate-300 leading-relaxed">
            <code>{SOLIDITY_CONTRACTS[activeContract]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
