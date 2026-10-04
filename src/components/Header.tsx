import React from 'react';
import { Shield, Sparkles, Wallet, ExternalLink, ChevronDown, CheckCircle2, RefreshCw, Sun, Moon } from 'lucide-react';
import { PrivySigner } from '../types/treasury';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentSigner: PrivySigner;
  onSwitchSigner: (signer: PrivySigner) => void;
  allSigners: PrivySigner[];
  isPrivyConnected: boolean;
  onTogglePrivy: () => void;
  onOpenAuditReport: () => void;
  unreadAlertsCount?: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentSigner,
  onSwitchSigner,
  allSigners,
  isPrivyConnected,
  onTogglePrivy,
  onOpenAuditReport,
  unreadAlertsCount = 0,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showSignerDropdown, setShowSignerDropdown] = React.useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'vaults', label: 'ERC-4626' },
    { id: 'projections', label: 'Projections' },
    { id: 'performance', label: 'Performance' },
    { id: 'bridge', label: 'CCIP Bridge' },
    { id: 'liquidity', label: 'Liquidity Pools' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'gas', label: 'Gas Savings' },
    { id: 'correlation', label: 'Correlation' },
    { id: 'alerts', label: 'Alerts', badge: unreadAlertsCount },
    { id: 'rebalancer', label: 'Rebalancer' },
    { id: 'privy', label: 'Privy' },
    { id: 'chainlink', label: 'Chainlink' },
    { id: 'monad', label: 'Monad' },
    { id: 'contracts', label: 'Contracts' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#090D16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <span className="text-lg">N</span>
          </div>
          <button 
            onClick={() => setActiveTab('overview')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              NUVA Treasury
            </span>
            <span className="block text-[11px] text-slate-400 font-mono tracking-wider">
              MONAD RWA VAULT OS
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4.5 overflow-x-auto max-w-2xl xl:max-w-4xl py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-xs font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer relative py-2 flex items-center gap-1.5 ${
                activeTab === item.id
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 font-mono">
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary actions & User controls */}
        <div className="flex items-center gap-3">
          {/* Monad Network Pill / Unboxed Indicator */}
          <div className="hidden sm:flex items-center gap-2 border border-slate-800 bg-slate-900/60 px-2.5 py-1 rounded-md text-xs font-mono text-slate-300">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Monad Testnet</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">10k TPS</span>
          </div>

          {/* Export Audit Report Button */}
          <button
            onClick={onOpenAuditReport}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Export Institutional Audit Report"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export Audit</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-purple-600" />
            )}
          </button>

          {/* Privy Role Selector / Auth */}
          {isPrivyConnected ? (
            <div className="relative">
              <button
                onClick={() => setShowSignerDropdown(!showSignerDropdown)}
                className="flex items-center gap-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  {currentSigner.role[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="font-medium text-slate-200 block leading-tight">{currentSigner.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono leading-tight">{currentSigner.role}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showSignerDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-800 bg-[#0E1525] p-2 shadow-2xl z-50">
                  <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
                    <span className="text-[11px] font-mono text-slate-400 block">Privy Embedded Smart Account</span>
                    <span className="text-xs font-mono text-slate-200 truncate block">{currentSigner.address}</span>
                  </div>
                  
                  <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Switch Corporate Signer
                  </div>
                  {allSigners.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSwitchSigner(s);
                        setShowSignerDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                        currentSigner.id === s.id
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <span className="font-medium block">{s.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{s.role} · {s.address}</span>
                      </div>
                      {currentSigner.id === s.id && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}

                  <div className="border-t border-slate-800/80 mt-1 pt-1">
                    <button
                      onClick={() => {
                        onTogglePrivy();
                        setShowSignerDropdown(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                    >
                      Disconnect Privy Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onTogglePrivy}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect via Privy</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden flex items-center gap-3 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#0B101D] text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === item.id
                ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            <span>{item.label}</span>
            {typeof item.badge === 'number' && item.badge > 0 && (
              <span className="flex h-3.5 min-w-3.5 px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 font-mono">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </header>
  );
};
