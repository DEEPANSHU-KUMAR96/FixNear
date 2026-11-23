import { useState } from 'react';
import { Link } from 'react-router';
import IssueImageInput from '../features/issues/components/IssueImageInput';
import useAiClassify from '../features/ai/hooks/useAiClassify';
import useAiDuplicates from '../features/ai/hooks/useAiDuplicates';
import AiSuggestionBadge from '../features/ai/components/AiSuggestionBadge';
import AiDuplicatesPanel from '../features/ai/components/AiDuplicatesPanel';

export default function ReportIssueModal({
  isOpen,
  onClose,
  reportSuccess,
  reportError,
  formData,
  onFormChange,
  onSubmit,
  isAuthenticated = true,
}) {
  const { classify, isClassifying, result: classifyResult, error: classifyError, clearResult: clearClassify } = useAiClassify();
  const { checkForDuplicates, isChecking: isDupChecking, result: dupResult, error: dupError, clearResult: clearDupResult } = useAiDuplicates();
  const [dupDismissed, setDupDismissed] = useState(false);

  if (!isOpen) return null;

  const canClassify = formData.title.trim().length >= 6 && formData.description.trim().length >= 10;
  const canCheckDups = canClassify && formData.category && formData.location.trim();

  const handleAiClassify = async () => {
    const data = await classify({ title: formData.title, description: formData.description });
    if (data) {
      const validCats = ['Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
      const validPris = ['Low', 'Medium', 'High'];
      onFormChange({
        ...formData,
        category: validCats.includes(data.category) ? data.category : formData.category,
        priority: validPris.includes(data.priority) ? data.priority : formData.priority,
      });
    }
  };

  const handleCheckDuplicates = async () => {
    setDupDismissed(false);
    await checkForDuplicates({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isAuthenticated ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🔒</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
              To report and track issues with your verified citizen profile, please log in or create an account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/login" className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition">Log In</Link>
              <Link to="/register" className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Create Account</Link>
            </div>
          </div>
        ) : reportSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Issue Reported!</h3>
            <p className="text-slate-600 text-sm">Thank you! Your civic report has been submitted and added to the community queue.</p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">New Civic Report</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Report an Issue</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Provide details below to help dispatch municipal assistance quickly.</p>
            </div>

            {reportError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">{reportError}</div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title (min 6, max 50 chars)</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  maxLength={50}
                  placeholder="e.g. Broken streetlight near park entrance"
                  value={formData.title}
                  onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description (max 500 chars)</label>
                <textarea
                  rows="3"
                  required
                  maxLength={500}
                  placeholder="Give additional context (e.g. size, duration of issue, hazard to traffic)..."
                  value={formData.description}
                  onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                ></textarea>
              </div>

              {/* ── AI Tools Section ── */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 space-y-2.5">
                <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <span>🤖</span> AI Tools
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAiClassify}
                    disabled={isClassifying || !canClassify}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-violet-600 hover:bg-violet-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title={!canClassify ? 'Fill in title (6+ chars) and description first' : 'Auto-detect category and priority'}
                  >
                    {isClassifying ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Classifying...
                      </>
                    ) : <>✨ Suggest Category & Priority</>}
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckDuplicates}
                    disabled={isDupChecking || !canCheckDups}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title={!canCheckDups ? 'Fill in title, description, category & location first' : 'Check if a similar issue was already reported'}
                  >
                    {isDupChecking ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Checking...
                      </>
                    ) : <>🔍 Check Similar Issues</>}
                  </button>
                </div>

                <p className="text-[10px] text-indigo-500 leading-tight">
                  {!canClassify
                    ? '⬆ Fill title & description to enable AI tools'
                    : !canCheckDups
                      ? '⬆ Also fill Category & Location to enable duplicate check'
                      : '✓ All fields ready — both AI tools are active'}
                </p>

                {classifyError && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">{classifyError}</div>
                )}
                {classifyResult && <AiSuggestionBadge result={classifyResult} onDismiss={clearClassify} />}
                {dupError && !dupResult && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">{dupError}</div>
                )}
                {dupResult && !dupDismissed && (
                  <AiDuplicatesPanel
                    result={dupResult}
                    onDismiss={() => { clearDupResult(); setDupDismissed(true); }}
                    onProceedAnyway={() => setDupDismissed(true)}
                  />
                )}
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Road">Road</option>
                    <option value="Water">Water</option>
                    <option value="Streetlight">Streetlight</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Pothole">Pothole</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => onFormChange({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5th Cross, Main Market Road"
                  value={formData.location}
                  onChange={(e) => onFormChange({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <IssueImageInput
                value={formData.image}
                onChange={(image) => onFormChange({ ...formData, image })}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition cursor-pointer">Submit Report</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
