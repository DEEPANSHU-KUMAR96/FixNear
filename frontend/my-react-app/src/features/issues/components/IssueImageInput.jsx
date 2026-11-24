import { useState, useRef } from 'react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export default function IssueImageInput({ value, currentImage, onChange }) {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError('Supported formats: JPG, PNG, WEBP, GIF, AVIF');
      onChange(null);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 5 MB or smaller.');
      onChange(null);
      return;
    }

    setError('');
    onChange(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewUrl = value ? URL.createObjectURL(value) : currentImage;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          Photo Evidence <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <span className="text-[11px] text-slate-400">Max 5MB (JPG, PNG, WEBP)</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-1.5 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 group-hover:scale-105 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
              Click to upload photo <span className="font-normal text-slate-400">or drag and drop</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border border-slate-200 rounded-xl p-2.5 bg-white flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={previewUrl}
              alt="Issue preview"
              className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {value?.name || 'Uploaded photo'}
              </p>
              <p className="text-[11px] text-slate-400">
                {value ? `${(value.size / (1024 * 1024)).toFixed(2)} MB` : 'Attached image'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              aria-label="Remove image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
