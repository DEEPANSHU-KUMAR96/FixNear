import { Link } from 'react-router';

export default function IssuesDemoSection({
  issuesList,
  selectedCategory,
  categories,
  onCategoryChange,
  onUpvote,
  onOpenReportModal,
  currentUserId,
}) {
  const filteredIssues =
    selectedCategory === 'All'
      ? issuesList
      : issuesList.filter((item) => item.category === selectedCategory);

  return (
    <section id="issues" className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
              Live Community Feed
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Recent Reported Issues</h2>
            <p className="text-slate-500 text-sm mt-1">Browse open and resolved civic problems reported by neighbors</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <Link
              to="/issues"
              className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
            >
              Go to Issues Tracker &rarr;
            </Link>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredIssues.map((issue) => {
            const upvotesCount = typeof issue.upvotesCount === 'number'
              ? issue.upvotesCount
              : (Array.isArray(issue.upvotes)
                ? issue.upvotes.length
                : (typeof issue.upvotes === 'number' ? issue.upvotes : 0));

            const isUpvoted = Boolean(
              currentUserId &&
              Array.isArray(issue.upvotes) &&
              issue.upvotes.some((id) => {
                const normalizedId = typeof id === 'string' ? id : id?._id || id?.id || id?.toString();
                return normalizedId === (currentUserId?._id || currentUserId?.id || currentUserId?.toString());
              })
            );

            return (
              <div
                key={issue._id}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {issue.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        issue.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : issue.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{issue.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {issue.location} • <span className="text-slate-400">{issue.date || 'Recently'}</span>
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{issue.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Priority:</span>
                    <span className={`font-semibold ${
                      issue.priority === 'High' ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onUpvote(issue._id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                      isUpvoted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                        : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200'
                    }`}
                    title={isUpvoted ? "Remove upvote" : "Upvote to raise awareness"}
                  >
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Upvote ({upvotesCount})
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Spotted a civic problem in your neighborhood? Report it now and notify local authorities.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              + Report an Issue
            </button>
            <Link
              to="/issues"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition shadow-2xs"
            >
              All Issues &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

