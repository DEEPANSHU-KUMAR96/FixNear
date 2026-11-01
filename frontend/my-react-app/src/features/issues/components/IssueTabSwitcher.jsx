export default function IssueTabSwitcher({ activeTab, onTabChange, isAuthenticated }) {
    return (
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
                type="button"
                onClick={() => onTabChange('all')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    activeTab === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                All Community Issues
            </button>
            <button
                type="button"
                onClick={() => {
                    if (!isAuthenticated) {
                        alert('Please sign in to view your reported issues.');
                        return;
                    }
                    onTabChange('my');
                }}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    activeTab === 'my'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                My Reported Issues {isAuthenticated ? '' : '(Login required)'}
            </button>
        </div>
    );
}

