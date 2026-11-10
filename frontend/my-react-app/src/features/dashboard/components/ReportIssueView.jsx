import { useState, useRef } from 'react';

const CATEGORIES = ['Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export default function ReportIssueView({ onSubmit, isLoading, onCancel }) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    location: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError('Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 5MB or smaller.');
      return;
    }

    setError('');
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setError('Please enter a title for the issue.');
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
      setSuccessMsg('Complaint submitted successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        location: '',
        image: null,
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err?.message || 'Failed to submit complaint. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2">
      {/* Page Header with Back Button */}
      <div className="flex items-center gap-3 mb-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Go back"
            title="Go back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Report a New Issue
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fill in the details to report a civic issue in your area.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Title <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={50}
            placeholder="e.g. Water leakage near park"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Description <span className="text-red-500 font-bold">*</span>
          </label>
          <textarea
            rows={4}
            required
            maxLength={500}
            placeholder="Provide detailed description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition min-h-[110px] resize-y shadow-2xs"
          />
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Category <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-10 shadow-2xs ${
                  !formData.category ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                <option value="" disabled className="text-slate-400">
                  Select category
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="text-slate-800">
                    {cat}
                  </option>
                ))}
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
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Priority <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition pr-10 shadow-2xs ${
                  !formData.priority ? 'text-slate-400' : 'text-slate-800'
                }`}
              >
                <option value="" disabled className="text-slate-400">
                  Select priority
                </option>
                {PRIORITIES.map((pri) => (
                  <option key={pri} value={pri} className="text-slate-800">
                    {pri}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Location <span className="text-red-500 font-bold">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              required
              placeholder="Enter address or landmark"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Upload Images (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Upload Images (Optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/20 rounded-xl py-6 px-4 cursor-pointer transition flex items-center justify-center gap-3.5 group shadow-2xs"
            >
              {/* Picture/Image Icon */}
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Text */}
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Click to upload images
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  PNG, JPG up to 5MB each
                </p>
              </div>
            </div>
          ) : (
            <div className="relative border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-xs">
                    {formData.image?.name || 'Selected image'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formData.image?.size ? `${(formData.image.size / 1024).toFixed(1)} KB` : 'Image ready'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="pt-2 flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-6 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
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
  );
}
