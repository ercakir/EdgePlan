import React from 'react';
import { Clock, AlertTriangle, Cpu, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, unit, subtitle, type, deltaStr }) {
  const getIcon = () => {
    switch (type) {
      case 'makespan': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'tardy': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'utilization': return <Cpu className="w-5 h-5 text-emerald-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'makespan': return 'bg-blue-950/70 border-blue-500/40';
      case 'tardy': return 'bg-amber-950/70 border-amber-500/40';
      case 'utilization': return 'bg-emerald-950/70 border-emerald-500/40';
      default: return 'bg-purple-950/70 border-purple-500/40';
    }
  };

  const isPositiveDelta = deltaStr && deltaStr.startsWith('+');

  return (
    <div className="bg-[#0e1726] p-6 rounded-2xl border border-slate-700/60 shadow-card-dark hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</span>
        <div className={`p-2.5 rounded-xl border ${getBg()}`}>
          {getIcon()}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">{subtitle}</span>
        {deltaStr && (
          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
            type === 'tardy'
              ? (isPositiveDelta ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30')
              : (isPositiveDelta ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-blue-950 text-blue-400 border border-blue-500/30')
          }`}>
            {isPositiveDelta ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {deltaStr}
          </span>
        )}
      </div>
    </div>
  );
}
