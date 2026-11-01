import IssueTabSwitcher from "./IssueTabSwitcher";

export default function IssueFilters({
    activeTab,
    onTabChange,
    isAuthenticated,
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories,
    selectedStatus,
    onStatusChange,
    statuses,
    selectedPriority,
    onPriorityChange,
    priorities,
    onReset,
}) {
    const hasActiveFilters =
        selectedCategory !== 'All' ||
        selectedStatus !== 'All' ||
        selectedPriority !== 'All' ||
        Boolean(searchQuery);

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs mb-8 space-y-4">
            {/* Top Row: Tabs + Search input */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <IssueTabSwitcher
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    isAuthenticated={isAuthenticated}
                />

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                    <svg
                        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search issues, streets, tags..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                </div>
            </div>

            {/* Bottom Row: Category, Status, and Priority Filters */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="font-semibold text-slate-500">Filter By:</span>

                {/* Category */}
                <div className="flex items-center gap-1.5">
                    <label className="text-slate-400">Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                    <label className="text-slate-400">Status:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-1.5">
                    <label className="text-slate-400">Priority:</label>
                    <select
                        value={selectedPriority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    >
                        {priorities.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Filters button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                        Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
}

