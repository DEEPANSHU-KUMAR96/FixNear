import { useState } from 'react';

const CATEGORY_IMAGES = {
  Water: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=300&q=80',
  Road: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
  Pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=300&q=80',
  Streetlight: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
  Garbage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80',
  Sanitation: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80',
  Default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
};

function formatTimeAgo(isoString) {
  if (!isoString) return 'Recent';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function ComplaintItem({
  issue,
  onEdit,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const imageSrc =
    issue.image ||
    CATEGORY_IMAGES[issue.category] ||
    CATEGORY_IMAGES.Default;

  // Status badge styling matching user mockup
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="px-3.5 py-1 text-[11px] sm:text-xs font-semibold rounded-full bg-amber-500 text-white shadow-2xs">
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-3.5 py-1 text-[11px] sm:text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
            Resolved
          </span>
        );
      case 'Reported':
      default:
        return (
          <span className="px-3.5 py-1 text-[11px] sm:text-xs font-semibold rounded-full bg-slate-200/80 text-slate-700">
            Reported
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between gap-4">
      {/* Left: Thumbnail image + Title + Location */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={imageSrc}
          alt={issue.title}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = CATEGORY_IMAGES.Default;
          }}
        />

        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
            {issue.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {issue.location || 'Local area'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 hidden sm:block">
            {issue.description}
          </p>
        </div>
      </div>

      {/* Right: Status badge + Relative time + 3-dots action menu */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <div className="flex flex-col items-end">
          {renderStatusBadge(issue.status)}
          <span className="text-[11px] text-slate-400 mt-1 font-medium">
            {formatTimeAgo(issue.createdAt || issue.date)}
          </span>
        </div>

        {/* Action Menu (3-dots) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer"
            aria-label="Actions"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-30 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(issue);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(issue._id);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

