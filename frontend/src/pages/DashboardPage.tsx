import { useLeads } from '@/hooks/useLeads';
import { LeadStatus, LeadSource } from '@/types';
import { Users, TrendingUp, Target, XCircle, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

const StatCard = ({
  label, value, icon, gradient, change, isLoading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  change?: string;
  isLoading: boolean;
}) => (
  <div className={`rounded-2xl p-6 text-white shadow-lg card-hover ${gradient} relative overflow-hidden`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> {change}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="h-9 w-20 bg-white/20 rounded-lg animate-pulse mb-1" />
      ) : (
        <p className="text-4xl font-bold mb-1">{value}</p>
      )}
      <p className="text-white/70 text-sm font-medium">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: allLeads, isLoading } = useLeads({ limit: 1000 });

  const leads = allLeads?.data ?? [];
  const total = allLeads?.meta?.total ?? 0;
  const qualified = leads.filter((l) => l.status === LeadStatus.QUALIFIED).length;
  const contacted = leads.filter((l) => l.status === LeadStatus.CONTACTED).length;
  const lost = leads.filter((l) => l.status === LeadStatus.LOST).length;
  const newLeads = leads.filter((l) => l.status === LeadStatus.NEW).length;

  const bySource = Object.values(LeadSource).map((src) => ({
    source: src,
    count: leads.filter((l) => l.source === src).length,
    color: src === LeadSource.WEBSITE ? 'bg-violet-500' : src === LeadSource.INSTAGRAM ? 'bg-pink-500' : 'bg-orange-500',
  }));

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statusConfig = [
    { status: LeadStatus.NEW, count: newLeads, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
    { status: LeadStatus.CONTACTED, count: contacted, color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300' },
    { status: LeadStatus.QUALIFIED, count: qualified, color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300' },
    { status: LeadStatus.LOST, count: lost, color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Here's what's happening with your leads today.
          </p>
        </div>
        <Link
          to="/leads"
          className="hidden sm:flex items-center gap-2 gradient-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
        >
          View All Leads <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={total} gradient="gradient-bg" icon={<Users className="h-5 w-5 text-white" />} isLoading={isLoading} />
        <StatCard label="Qualified" value={qualified} gradient="gradient-green" icon={<Target className="h-5 w-5 text-white" />} isLoading={isLoading} />
        <StatCard label="Contacted" value={contacted} gradient="gradient-yellow" icon={<TrendingUp className="h-5 w-5 text-white" />} isLoading={isLoading} />
        <StatCard label="Lost" value={lost} gradient="gradient-red" icon={<XCircle className="h-5 w-5 text-white" />} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Leads by Source</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{total} total</span>
          </div>
          <div className="space-y-4">
            {bySource.map(({ source, count, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{source}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Status Breakdown</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">pipeline</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {statusConfig.map(({ status, count, bg, text, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status} className={`rounded-xl p-4 ${bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-2 w-2 rounded-full ${color}`} />
                    <span className={`text-xs font-medium ${text}`}>{status}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Recent Leads</h2>
          <Link to="/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No leads yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first lead to get started</p>
            <Link to="/leads" className="inline-flex items-center gap-1.5 mt-4 gradient-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Add Lead
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentLeads.map((lead) => {
              const statusColor =
                lead.status === LeadStatus.QUALIFIED ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                lead.status === LeadStatus.LOST ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                lead.status === LeadStatus.CONTACTED ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
              return (
                <div key={lead._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{lead.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
