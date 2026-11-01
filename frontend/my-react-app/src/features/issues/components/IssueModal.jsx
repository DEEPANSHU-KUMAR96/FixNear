import { Link } from 'react-router';

export default function IssueModal({
    isOpen,
    editingIssue,
    formData,
    onFormChange,
    onSubmit,
    onClose,
    isLoading,
    submitError,
    submitSuccess,
    isAuthenticated,
}) {
    if (!isOpen && !editingIssue) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                {/* Close button */}
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

                {/* Check if user is authenticated for reporting */}
                {!isAuthenticated ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                            🔒
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h3>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                            To report and track issues with your verified citizen profile, please log in or create an account.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link
                                to="/login"
                                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                ) : submitSuccess ? (
                    <div className="text-center py-8">
                        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{submitSuccess}</h3>
                        <p className="text-slate-500 text-xs">Synchronized with MongoDB database.</p>
                    </div>
                ) : (
                    <div>
                        <div className="mb-5">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {editingIssue ? 'Update Report' : 'Civic Dispatch'}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                {editingIssue ? 'Edit Issue Details' : 'Report an Issue'}
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">
                                Directly synced with your municipal database
                            </p>
                        </div>

                        {submitError && (
                            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                                {submitError}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Issue Title (max 50 chars)
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={50}
                                    placeholder="e.g. Open Pothole near Central Market"
                                    value={formData.title}
                                    onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

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

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Location / Street Address
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 4th Cross Road, Ward 12"
                                    value={formData.location}
                                    onChange={(e) => onFormChange({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Description (max 500 chars)
                                </label>
                                <textarea
                                    rows="3"
                                    required
                                    maxLength={500}
                                    placeholder="Describe the issue, size, potential hazard or duration..."
                                    value={formData.description}
                                    onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    {isLoading ? 'Saving...' : editingIssue ? 'Save Changes' : 'Submit Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

