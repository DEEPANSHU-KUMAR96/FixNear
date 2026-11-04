import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../../component/Navbar';
import useIssue from '../hooks/useIssue';
import useAuth from '../../auth/hooks/useAuth';
import IssueStatsBar from '../components/IssueStatsBar';
import IssueFilters from '../components/IssueFilters';
import IssueCard from '../components/IssueCard';
import IssueModal from '../components/IssueModal';

const CATEGORIES = ['All', 'Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
const STATUSES = ['All', 'Reported', 'In Progress', 'Resolved'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

const Issue = () => {
  const navigate = useNavigate();
  const {
    issues,
    isLoading,
    error,
    createIssue,
    fetchAllIssues,
    fetchMyIssues,
    updateExistingIssue,
    updateStatus,
    removeIssue,
    upvoteIssue,
    clearError
  } = useIssue();

  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road',
    location: '',
    priority: 'Medium',
    status: 'Reported',
    description: ''
  });

  // Load issues on initial mount and when tab changes
  useEffect(() => {
    if (activeTab === 'my' && isAuthenticated) {
      fetchMyIssues().catch(() => {});
    } else {
      fetchAllIssues().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]);

  const handleOpenCreateModal = () => {
    setSubmitError('');
    setSubmitSuccess('');
    setFormData({
      title: '',
      category: 'Road',
      location: '',
      priority: 'Medium',
      status: 'Reported',
      description: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (issue) => {
    setSubmitError('');
    setSubmitSuccess('');
    setEditingIssue(issue);
    setFormData({
      title: issue.title || '',
      category: issue.category || 'Road',
      location: issue.location || '',
      priority: issue.priority || 'Medium',
      status: issue.status || 'Reported',
      description: issue.description || ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setSubmitError('Please fill in title, location, and description.');
      return;
    }

    try {
      if (editingIssue) {
        await updateExistingIssue(editingIssue._id, formData);
        setSubmitSuccess('Issue updated successfully!');
        setTimeout(() => {
          setEditingIssue(null);
          setSubmitSuccess('');
        }, 1000);
      } else {
        await createIssue(formData);
        setSubmitSuccess('Issue reported successfully!');
        setTimeout(() => {
          setIsCreateModalOpen(false);
          setSubmitSuccess('');
        }, 1200);
      }
    } catch (err) {
      setSubmitError(err?.message || (typeof err === 'string' ? err : 'Operation failed.'));
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await removeIssue(id);
    } catch (err) {
      alert(err?.message || 'Failed to delete issue');
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
    } catch (err) {
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleUpvoteIssue = async (id) => {
    if (!isAuthenticated) {
      alert('Please log in to upvote issues.');
      navigate('/login');
      return;
    }
    try {
      await upvoteIssue(id);
    } catch (err) {
      alert(err?.message || 'Failed to update upvote');
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSearchQuery('');
  };

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return (issues || []).filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;

      return matchesSearch && matchesCat && matchesStatus && matchesPriority;
    });
  }, [issues, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  // Statistics calculation
  const stats = useMemo(() => {
    const list = issues || [];
    return {
      total: list.length,
      reported: list.filter((i) => i.status === 'Reported').length,
      inProgress: list.filter((i) => i.status === 'In Progress').length,
      resolved: list.filter((i) => i.status === 'Resolved').length
    };
  }, [issues]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Database Connected
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Issues Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time civic reporting and municipal task management for your neighborhood
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Report New Issue
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Dashboard */}
        <IssueStatsBar stats={stats} />

        {/* Filter & Search Bar */}
        <IssueFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isAuthenticated={isAuthenticated}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={CATEGORIES}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          statuses={STATUSES}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          priorities={PRIORITIES}
          onReset={handleResetFilters}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Connecting to backend & fetching civic issues...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredIssues.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Issues Found</h3>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try adjusting your search criteria or resetting filters.'
                : 'There are currently no civic reports in this view. Be the first to report an issue!'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition cursor-pointer"
            >
              + Report an Issue
            </button>
          </div>
        )}

        {/* Issues Grid */}
        {!isLoading && filteredIssues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIssues.map((item) => {
              const isOwner =
                isAuthenticated &&
                user &&
                (item.createdBy === user.id || item.createdBy?._id === user.id);

              return (
                <IssueCard
                  key={item._id}
                  item={item}
                  isOwner={isOwner}
                  currentUserId={user?.id || user?._id}
                  onUpvote={handleUpvoteIssue}
                  onStatusChange={handleQuickStatusChange}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteIssue}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Create or Edit Issue */}
      <IssueModal
        isOpen={isCreateModalOpen}
        editingIssue={editingIssue}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingIssue(null);
        }}
        isLoading={isLoading}
        submitError={submitError}
        submitSuccess={submitSuccess}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default Issue;
