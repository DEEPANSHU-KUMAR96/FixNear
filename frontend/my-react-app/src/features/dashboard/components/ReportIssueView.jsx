import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import IssueImageInput from '../../issues/components/IssueImageInput';
import useAiClassify from '../../ai/hooks/useAiClassify';
import useAiDuplicates from '../../ai/hooks/useAiDuplicates';
import useAddressGeocoding from '../../issues/hooks/useAddressGeocoding';
import AiSuggestionBadge from '../../ai/components/AiSuggestionBadge';
import AiDuplicatesPanel from '../../ai/components/AiDuplicatesPanel';

// Lazy-load map (heavy dependency — Leaflet is ~40KB gz)
const MapLocationPicker = lazy(() => import('../../issues/components/MapLocationPicker'));

const CATEGORIES = ['Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function ReportIssueView({ onSubmit, isLoading, onCancel }) {
  const { classify, isClassifying, result: aiResult, error: aiError, clearResult } = useAiClassify();
  const {
    checkForDuplicates, isChecking: isDupChecking,
    result: dupResult, error: dupError, clearResult: clearDupResult,
  } = useAiDuplicates();
  const [dupDismissed, setDupDismissed] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: '',
    image: null,
    latitude: null,
    longitude: null,
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setFormData((prev) => ({ ...prev, location: val }));
    setSearchEnabled(true);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (item) => {
    setSearchEnabled(false);
    setShowSuggestions(false);
    clearSuggestions();
    setMapZoom(16);
    setFormData((prev) => ({
      ...prev,
      location: item.displayName,
      latitude: item.lat,
      longitude: item.lon,
    }));
  };

  // AI helpers
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
      const aiCategory = CATEGORIES.includes(data.category) ? data.category : formData.category;
      const aiPriority = PRIORITIES.includes(data.priority) ? data.priority : formData.priority;
      setFormData((prev) => ({ ...prev, category: aiCategory, priority: aiPriority }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please enter a title for the issue.');
      return;
    }
    if (formData.title.trim().length < 6) {
      setError('Title must be at least 6 characters long.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide a detailed description.');
      return;
    }
    if (!formData.category) {
      setError('Please select a category.');
      return;
    }
    if (!formData.priority) {
      setError('Please select a priority level.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter the location or landmark.');
      return;
    }

    try {
      await onSubmit(formData);
      setSuccessMsg('Complaint submitted successfully to municipal authorities!');
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        location: '',
        image: null,
        latitude: null,
        longitude: null,
      });
    } catch (err) {
      setError(err?.message || 'Failed to submit complaint. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 sm:py-4 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Go back"
            title="Go back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Civic Report Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a New Issue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit a verified complaint to alert local authorities and speed up ward resolution.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs font-bold text-rose-500 hover:text-rose-800 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              ✓
            </span>
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-900 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Title <span className="text-rose-500">*</span>
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
              placeholder="e.g. Water pipeline leakage near Central Park"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 text-sm placeholder:text-slate-400"
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
              rows={4}
              required
              maxLength={500}
              placeholder="Provide a detailed description of the civic problem, duration, or safety hazards..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 text-sm placeholder:text-slate-400 min-h-[105px] resize-y"
            />
          </div>

          {/* ── AI Smart Assistant ── */}
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/70 via-indigo-50/40 to-purple-50/60 p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-bold text-violet-950 uppercase tracking-wider">
                    AI Smart Assistant
                  </p>
                  <p className="text-[11px] text-violet-700">
                    Auto-fill category & priority or check for existing duplicate complaints
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleAiClassify}
                  disabled={isClassifying}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition duration-150 cursor-pointer ${canClassify
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition duration-150 cursor-pointer ${canCheckDups
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

            {/* Inline Hint */}
            {aiNotice && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 p-2 rounded-lg font-medium">
                💡 {aiNotice}
              </p>
            )}

            {/* AI Error */}
            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {aiError}
              </div>
            )}

            {/* Classify Result Badge */}
            {aiResult && <AiSuggestionBadge result={aiResult} onDismiss={clearResult} />}

            {/* Duplicate Error */}
            {dupError && !dupResult && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 text-sm pr-10 cursor-pointer"
                >
                  <option value="" disabled className="text-slate-400">
                    Select category
                  </option>
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
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 text-sm pr-10 cursor-pointer"
                >
                  <option value="" disabled className="text-slate-400">
                    Select priority
                  </option>
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
                placeholder="e.g. Park Road, Ballabhgarh, Faridabad"
                value={formData.location}
                onChange={handleLocationInputChange}
                onFocus={() => {
                  if (suggestions.length > 0 || formData.location.trim().length >= 3) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10 rounded-xl transition duration-150 text-slate-800 text-sm placeholder:text-slate-400"
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
            {showSuggestions && formData.location.trim().length >= 3 && (
              <div className="absolute left-0 right-0 mt-1.5 z-40 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto animate-fadeIn">
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
              <div className="w-full h-[280px] rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium gap-2">
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
              onChange={(lat, lng) =>
                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
              }
            />
          </Suspense>

          {/* Upload Images with Drag and Drop */}
          <IssueImageInput
            value={formData.image}
            onChange={(image) => setFormData((prev) => ({ ...prev, image }))}
          />

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
