import React, { useState } from 'react';
import { SmartAlert, AlertCategory, AlertSeverity } from '../types/treasury';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Send, 
  Settings, 
  Check, 
  X, 
  Filter, 
  ArrowRight, 
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';

interface SmartAlertSystemProps {
  alerts: SmartAlert[];
  onResolveAlert: (id: string) => void;
  onNavigate: (tab: string) => void;
  onTriggerRebalance: () => void;
}

export const SmartAlertSystem: React.FC<SmartAlertSystemProps> = ({
  alerts,
  onResolveAlert,
  onNavigate,
  onTriggerRebalance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all');
  const [webhookSimulating, setWebhookSimulating] = useState<boolean>(false);
  const [webhookSuccess, setWebhookSuccess] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('T-Bill Concentration Cap (>55%)');
  const [newRuleThreshold, setNewRuleThreshold] = useState<string>('55.0%');

  const filteredAlerts = alerts.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const activeCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.severity === 'warning' && !a.resolved).length;

  const handleDispatchWebhook = () => {
    setWebhookSimulating(true);
    setWebhookSuccess(null);
    setTimeout(() => {
      setWebhookSimulating(false);
      setWebhookSuccess('Dispatched webhook event to Slack (#treasury-risk-feed) and PagerDuty API successfully.');
      setTimeout(() => setWebhookSuccess(null), 5000);
    }, 1200);
  };

  const handleActionClick = (alert: SmartAlert) => {
    if (alert.category === 'drift') {
      onTriggerRebalance();
      onResolveAlert(alert.id);
    } else if (alert.category === 'quorum') {
      onNavigate('privy');
    } else if (alert.category === 'oracle') {
      onNavigate('chainlink');
    } else if (alert.category === 'gas' || alert.category === 'network') {
      onNavigate('gas');
      onResolveAlert(alert.id);
    } else {
      onResolveAlert(alert.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span>REAL-TIME TELEMETRY & EVENT DISPATCH</span>
            <span className="text-slate-600">/</span>
            <span>INTELLIGENT RISK ALERTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Institutional Smart Alert System
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous monitoring of target drift bands, Chainlink oracle heartbeats, Privy multi-sig quorums, and compliance gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Configure Rules</span>
          </button>
          <button
            onClick={handleDispatchWebhook}
            disabled={webhookSimulating}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{webhookSimulating ? 'Dispatching...' : 'Test Webhook'}</span>
          </button>
        </div>
      </div>

      {webhookSuccess && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{webhookSuccess}</span>
          </div>
          <button onClick={() => setWebhookSuccess(null)} className="text-slate-400 hover:text-white cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Alert Status KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Active Unresolved Alerts</span>
          <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Across 5 telemetry sources
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Warnings / Pending Action</span>
          <div className="text-2xl font-bold font-mono text-amber-400 tracking-tight tabular-nums">
            {warningCount}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Requires keeper or quorum action
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Critical Invariants</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
            0 Faults
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            Zero solvency breaches
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0C1220] p-5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Webhook Dispatch Status</span>
          <div className="text-2xl font-bold font-mono text-purple-300 tracking-tight">
            Connected
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-2 block">
            Slack · PagerDuty · Webhook
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setSelectedCategory('drift')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === 'drift'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Allocation Drift
        </button>
        <button
          onClick={() => setSelectedCategory('quorum')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === 'quorum'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privy Quorum
        </button>
        <button
          onClick={() => setSelectedCategory('oracle')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === 'oracle'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Chainlink Oracle / PoR
        </button>
        <button
          onClick={() => setSelectedCategory('compliance')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCategory === 'compliance'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Compliance (ACE)
        </button>
        <button
          onClick={() => setSelectedCategory('gas')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'gas'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="h-3 w-3" />
          <span>Gas & Network</span>
        </button>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border p-5 transition-all ${
              alert.resolved
                ? 'border-slate-800/60 bg-[#090D16]/50 opacity-70'
                : alert.severity === 'critical'
                ? 'border-rose-500/40 bg-rose-950/20'
                : alert.severity === 'warning'
                ? 'border-amber-500/30 bg-[#0C1220]'
                : 'border-slate-800 bg-[#0C1220]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    alert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Source: {alert.source}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-slate-500">{alert.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{alert.description}</p>

                {alert.metadata && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-400">
                    {Object.entries(alert.metadata).map(([k, v]) => (
                      <span key={k} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {k}: <strong className="text-slate-200">{v}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                {!alert.resolved ? (
                  <>
                    {alert.actionRequired && (
                      <button
                        onClick={() => handleActionClick(alert)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>{alert.actionRequired}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Alert Rules Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#0C1220] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Configure Automated Alert Rule</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-mono text-slate-400 block mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">Condition Threshold</label>
                <input
                  type="text"
                  value={newRuleThreshold}
                  onChange={(e) => setNewRuleThreshold(e.target.value)}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-mono text-slate-400 block mb-1">Dispatch Target</label>
                <select className="w-full bg-[#090D16] border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500">
                  <option>Slack (#treasury-alerts) + Email</option>
                  <option>PagerDuty P1 Incident</option>
                  <option>Institutional Webhook (JSON POST)</option>
                  <option>Telegram Officer Bot</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
