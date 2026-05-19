import { useLeads } from '@/hooks/useLeads';
import { LeadStatus, LeadSource } from '@/types';
import { Users, TrendingUp, Target, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const StatCard = ({
  label,
  value,
  icon,
  color,
  isLoading,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isLoading: boolean;
}) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : (
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
      <div className={`rounded-xl p-3 ${color}`}>{icon}</div>
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
  }));

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={total} icon={<Users className="h-5 w-5 text-blue-600" />} color="bg-blue-50 dark:bg-blue-900/30" isLoading={isLoading} />
        <StatCard label="Qualified" value={qualified} icon={<Target className="h-5 w-5 text-green-600" />} color="bg-green-50 dark:bg-green-900/30" isLoading={isLoading} />
        <StatCard label="Contacted" value={contacted} icon={<TrendingUp className="h-5 w-5 text-yellow-600" />} color="bg-yellow-50 dark:bg-yellow-900/30" isLoading={isLoading} />
        <StatCard label="Lost" value={lost} icon={<XCircle className="h-5 w-5 text-red-500" />} color="bg-red-50 dark:bg-red-900/30" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Leads by Source</h2>
          <div className="space-y-3">
            {bySource.map(({ source, count }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{source}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { status: LeadStatus.NEW, count: newLeads, color: 'bg-blue-500' },
              { status: LeadStatus.CONTACTED, count: contacted, color: 'bg-yellow-500' },
              { status: LeadStatus.QUALIFIED, count: qualified, color: 'bg-green-500' },
              { status: LeadStatus.LOST, count: lost, color: 'bg-red-500' },
            ].map(({ status, count, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{status}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : recentLeads.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No leads yet. Add your first lead!</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentLeads.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    lead.status === LeadStatus.QUALIFIED ? 'bg-green-100 text-green-700' :
                    lead.status === LeadStatus.LOST ? 'bg-red-100 text-red-700' :
                    lead.status === LeadStatus.CONTACTED ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
