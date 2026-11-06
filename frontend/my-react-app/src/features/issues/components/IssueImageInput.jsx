import { useState } from 'react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export default function IssueImageInput({ value, currentImage, onChange }) {
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && !ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError('Choose a JPG, PNG, WEBP, GIF, or AVIF image.');
      onChange(null);
      return;
    }
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError('Image must be 5 MB or smaller.');
      onChange(null);
      return;
    }

    setError('');
    onChange(file);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Photo (optional)
      </label>
      <input
        key={value?.name || 'empty'}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleChange}
        className="w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold hover:file:bg-slate-200"
      />
      <p className="mt-1 text-[11px] text-slate-400">
        JPG, PNG, WEBP, GIF, or AVIF; max 5 MB.
      </p>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {value?.name && (
        <p className="mt-1 text-xs text-slate-500">Selected: {value.name}</p>
      )}
      {!value && currentImage && (
        <img
          src={currentImage}
          alt="Issue photo preview"
          className="mt-3 h-24 w-24 rounded-lg border border-slate-200 object-cover"
        />
      )}
    </div>
  );
}
