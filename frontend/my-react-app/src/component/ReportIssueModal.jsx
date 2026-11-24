import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router';
import IssueImageInput from '../features/issues/components/IssueImageInput';
import useAiClassify from '../features/ai/hooks/useAiClassify';
import useAiDuplicates from '../features/ai/hooks/useAiDuplicates';
import useAddressGeocoding from '../features/issues/hooks/useAddressGeocoding';
import AiSuggestionBadge from '../features/ai/components/AiSuggestionBadge';
import AiDuplicatesPanel from '../features/ai/components/AiDuplicatesPanel';

const MapLocationPicker = lazy(() => import('../features/issues/components/MapLocationPicker'));

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
  const [aiNotice, setAiNotice] = useState('');

  // Geocoding auto-search state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [mapZoom, setMapZoom] = useState(16);
  const dropdownRef = useRef(null);

  const {
    suggestions,
    isLoading: isGeocoding,
    error: geocodingError,
    clearSuggestions,
  } = useAddressGeocoding(formData.location, 600, searchEnabled);

  // Close suggestions on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLocationInputChange = (e) => {
    const val = e.target.value;
    onFormChange({ ...formData, location: val });
    setSearchEnabled(true);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (item) => {
    setSearchEnabled(false);
    setShowSuggestions(false);
    clearSuggestions();
    setMapZoom(16);
    onFormChange({
      ...formData,
      location: item.displayName,
      latitude: item.lat,
      longitude: item.lon,
    });
  };

  if (!isOpen) return null;

  const canClassify = formData.title.trim().length >= 6 && formData.description.trim().length >= 10;
  const canCheckDups = canClassify && formData.category && formData.location.trim();

  const handleAiClassify = async () => {
    setAiNotice('');
    if (!canClassify) {
      setAiNotice('Please enter a Title (min 6 chars) and a brief Description first so AI can analyze the problem.');
      return;
    }
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
    setAiNotice('');
    if (!canCheckDups) {
      setAiNotice('Please fill in Title, Description, Category, and Location before checking for duplicates.');
      return;
    }
    setDupDismissed(false);
    await checkForDuplicates({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full p-5 sm:p-7 relative my-auto max-h-[92vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isAuthenticated ? (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              🔒
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h3>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              To report issues and track municipal progress with your verified citizen profile, please log in or create an account.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : reportSuccess ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Issue Reported Successfully!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Thank you! Your civic report has been submitted to the community queue and municipal dispatch.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                New Civic Report
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Report an Issue
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Provide details below to help municipal authorities dispatch assistance quickly.
              </p>
            </div>

            {reportError && (
              <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
                <span className="text-base shrink-0">⚠️</span>
                <span>{reportError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Issue Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Issue Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">
                    {formData.title.length}/50 chars (min 6)
                  </span>
                </div>
                <input
                  type="text"
                  required
                  minLength={6}
                  maxLength={50}
                  placeholder="e.g. Large pothole near Central Market entrance"
                  value={formData.title}
                  onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">
                    {formData.description.length}/500 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  maxLength={500}
                  placeholder="Describe the issue, approximate size, potential traffic or safety hazard..."
                  value={formData.description}
                  onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 placeholder:text-slate-400 resize-y min-h-[85px]"
                ></textarea>
              </div>

              {/* ── AI Smart Assistant ── */}
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/70 via-indigo-50/40 to-purple-50/60 p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center text-xs shadow-xs">
                      ✨
                    </div>
                    <div>
                      <p className="text-xs font-bold text-violet-950 uppercase tracking-wider">
                        AI Smart Assistant
                      </p>
                      <p className="text-[11px] text-violet-700">
                        Auto-fill category & priority or check for duplicates
                      </p>
                    </div>
                  </div>

                  {/* AI Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAiClassify}
                      disabled={isClassifying}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition duration-150 cursor-pointer ${
                        canClassify
                          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'
                          : 'bg-white/80 hover:bg-white text-violet-800 border border-violet-200/80 hover:border-violet-300'
                      }`}
                      title="Analyze title and description to suggest category and priority"
                    >
                      {isClassifying ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Auto-Detect</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCheckDuplicates}
                      disabled={isDupChecking}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition duration-150 cursor-pointer ${
                        canCheckDups
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
                          : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 hover:border-amber-300'
                      }`}
                      title="Check if a similar complaint was already submitted in this area"
                    >
                      {isDupChecking ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <span>🔍</span>
                          <span>Check Duplicates</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Hint / Notice */}
                {aiNotice && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 p-2 rounded-lg font-medium">
                    💡 {aiNotice}
                  </p>
                )}

                {/* Classify Error */}
                {classifyError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {classifyError}
                  </div>
                )}

                {/* Classify Result Badge */}
                {classifyResult && (
                  <AiSuggestionBadge result={classifyResult} onDismiss={clearClassify} />
                )}

                {/* Duplicate Error */}
                {dupError && !dupResult && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {dupError}
                  </div>
                )}

                {/* Duplicate Result Panel */}
                {dupResult && !dupDismissed && (
                  <AiDuplicatesPanel
                    result={dupResult}
                    onDismiss={() => { clearDupResult(); setDupDismissed(true); }}
                    onProceedAnyway={() => setDupDismissed(true)}
                  />
                )}
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                      className="w-full appearance-none px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 pr-10 cursor-pointer"
                    >
                      <option value="Road">🛣️ Road</option>
                      <option value="Water">💧 Water</option>
                      <option value="Streetlight">💡 Streetlight</option>
                      <option value="Garbage">🗑️ Garbage</option>
                      <option value="Pothole">🕳️ Pothole</option>
                      <option value="Sanitation">🧹 Sanitation</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => onFormChange({ ...formData, priority: e.target.value })}
                      className="w-full appearance-none px-4 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 pr-10 cursor-pointer"
                    >
                      <option value="Low">🟢 Low Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="High">🔴 High Priority</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location / Address with Geocoding */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Location / Landmark <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Type address to search & pin map
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="e.g. 5th Cross Road, Near Central Bank, Ward 12"
                    value={formData.location}
                    onChange={handleLocationInputChange}
                    onFocus={() => {
                      if (suggestions.length > 0 || formData.location?.trim().length >= 3) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 placeholder:text-slate-400"
                  />

                  {/* Loading spinner */}
                  {isGeocoding && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Address Suggestions Dropdown */}
                {showSuggestions && formData.location?.trim().length >= 3 && (
                  <div className="absolute left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto animate-fadeIn">
                    {isGeocoding && suggestions.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <svg className="w-3.5 h-3.5 animate-spin text-emerald-600" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Searching OpenStreetMap locations...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Matching Addresses ({suggestions.length})</span>
                          <span>Click to pin on map</span>
                        </div>
                        {suggestions.map((item) => (
                          <button
                            key={item.placeId}
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 transition flex items-start gap-2.5 cursor-pointer group"
                          >
                            <span className="text-sm mt-0.5 text-slate-400 group-hover:text-emerald-600 shrink-0">
                              📍
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-950 truncate">
                                {item.displayName.split(',')[0]}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate leading-snug">
                                {item.displayName}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Lat: {item.lat.toFixed(5)}, Lng: {item.lon.toFixed(5)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : geocodingError ? (
                      <div className="p-3 text-center text-xs text-amber-700 bg-amber-50">
                        ⚠️ {geocodingError}. You can still pinpoint the location directly on the map below.
                      </div>
                    ) : (
                      <div className="p-3.5 text-center text-xs text-slate-500">
                        <p className="font-semibold text-slate-700">No matching locations found.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          You can drop a pin directly on the interactive map below.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Map Location Picker */}
              <Suspense
                fallback={
                  <div className="w-full h-[240px] rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Loading map...
                  </div>
                }
              >
                <MapLocationPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  zoom={mapZoom}
                  height="240px"
                  onChange={(lat, lng) =>
                    onFormChange({ ...formData, latitude: lat, longitude: lng })
                  }
                />
              </Suspense>

              {/* Image Input */}
              <IssueImageInput
                value={formData.image}
                onChange={(image) => onFormChange({ ...formData, image })}
              />

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
