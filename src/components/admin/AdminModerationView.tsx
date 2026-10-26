import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  UserX, 
  Activity, 
  Database, 
  Lock, 
  Filter,
  Eye,
  Check
} from 'lucide-react';

export const AdminModerationView: React.FC = () => {
  const { 
    currentUser, 
    updateCurrentUser, 
    reports, 
    resolveReport, 
    dismissReport, 
    deleteHarmfulPost, 
    posts, 
    users, 
    addToast 
  } = useSocial();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleRemoveContent = (report: any) => {
    if (report.targetType === 'post') {
      deleteHarmfulPost(report.targetId);
    }
    resolveReport(report.id, 'Content removed');
  };

  const handleWarnUser = (report: any) => {
    resolveReport(report.id, 'Official warning issued');
    addToast(`Warning notice dispatched for ${report.targetId}`, 'warning');
  };

  if (!isAdmin) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Protected Moderation Console</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Access to this console requires verified administrator privileges on Qevora. Please sign in with the authorized administrator account (<span className="text-blue-600 font-mono font-medium">roynirobn@gmail.com</span>).
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 md:pb-8 space-y-5">
      {/* Platform Health & Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Qevora Safety & Moderation Console</h2>
              <p className="text-xs text-slate-400">Authenticated as @{currentUser.handle} ({currentUser.role})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Rules Active
            </span>
          </div>
        </div>

        {/* Health Metrics Grid (Tabular Numerals) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reports In Queue</p>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-1">
              {reports.filter((r) => r.status === 'pending').length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved Tickets</p>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-1">
              {reports.filter((r) => r.status === 'resolved').length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Users</p>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-1">
              {users.length}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storage Quota</p>
            <p className="text-xl font-extrabold text-emerald-600 tabular-nums mt-1">
              Healthy (1.2%)
            </p>
          </div>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Incident Reports Queue</h3>
            <p className="text-xs text-slate-400">Review user-flagged content for spam, harassment, or safety violations</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(['all', 'pending', 'resolved', 'dismissed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table / List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {report.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {report.reason}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      report.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-snug font-medium">
                    {report.targetTitle}
                  </p>

                  {report.details && (
                    <p className="text-xs text-slate-500 italic">
                      "{report.details}"
                    </p>
                  )}

                  <p className="text-[10px] text-slate-400">
                    Flagged {report.createdAt} by {report.reportedBy}
                  </p>
                </div>

                {/* Moderator Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {report.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleRemoveContent(report)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Content</span>
                      </button>

                      <button
                        onClick={() => handleWarnUser(report)}
                        className="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Warn</span>
                      </button>

                      <button
                        onClick={() => dismissReport(report.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Closed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Queue is clear</p>
              <p className="text-xs text-slate-400 mt-0.5">No reports matching the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
