import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, Flag, CheckCircle2 } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal, reportData, submitReport } = useSocial();
  
  const [selectedReason, setSelectedReason] = useState('Spam or scam');
  const [additionalDetails, setAdditionalDetails] = useState('');

  if (!isReportModalOpen || !reportData) return null;

  const reasons = [
    'Spam or scam',
    'Harassment or hate speech',
    'Misinformation or fake news',
    'Inappropriate media / Violence',
    'Intellectual property violation',
    'Other concern',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(selectedReason, additionalDetails);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Report Content</h3>
          </div>
          <button
            onClick={closeReportModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close report dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">Target</p>
            <p className="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">
              {reportData.title}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Why are you reporting this?
            </label>
            <div className="space-y-1.5">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-colors ${
                    selectedReason === reason
                      ? 'border-blue-500 bg-blue-50/60 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{reason}</span>
                  <input
                    type="radio"
                    name="report_reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-blue-600"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Additional Details (Optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={2}
              placeholder="Provide extra context to help our moderation team..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeReportModal}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/20 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
