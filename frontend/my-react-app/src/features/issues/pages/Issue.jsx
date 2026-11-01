import { useState, useEffect, useMemo } from 'react';
import Navbar from '../../../component/Navbar';
import useIssue from '../hooks/useIssue';
import useAuth from '../../auth/hooks/useAuth';
import { Link } from 'react-router';

const CATEGORIES = ['All', 'Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
const STATUSES = ['All', 'Reported', 'In Progress', 'Resolved'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

const Issue = () => {
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

      {/* Main Container */}
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

        {/* Global Error Banner if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-xs font-semibold text-rose-800 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Issues</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">New Reports</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{stats.reported}</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{stats.inProgress}</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs mb-8 space-y-4">
          
          {/* Top Row: Tabs + Search input */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Community Issues
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please sign in to view your reported issues.');
                    return;
                  }
                  setActiveTab('my');
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
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
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {STATUSES.map((s) => (
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
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button */}
            {(selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSelectedPriority('All');
                  setSearchQuery('');
                }}
                className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

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
              onClick={handleOpenCreateModal}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
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
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Category & Status Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {item.category}
                      </span>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{item.location}</span>
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-400">
                        Priority:{' '}
                        <span
                          className={`font-semibold ${
                            item.priority === 'High'
                              ? 'text-rose-600'
                              : item.priority === 'Medium'
                              ? 'text-amber-600'
                              : 'text-slate-600'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </span>

                      {item.createdBy?.name && (
                        <span className="text-slate-400 truncate max-w-[130px]">
                          By {item.createdBy.name}
                        </span>
                      )}
                    </div>

                    {/* Interactive controls */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                      {/* Status toggle selector */}
                      <select
                        value={item.status}
                        onChange={(e) => handleQuickStatusChange(item._id, e.target.value)}
                        className="text-[11px] font-medium py-1 px-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:border-emerald-500"
                        title="Update Status"
                      >
                        <option value="Reported">Reported</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      {/* Owner actions (Edit / Delete) */}
                      {isOwner && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                            title="Edit Issue"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDeleteIssue(item._id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Delete Issue"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Modal: Create or Edit Issue */}
      {(isCreateModalOpen || editingIssue) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setEditingIssue(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Check if user is authenticated for reporting */}
            {!isAuthenticated ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h3>
                <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
                  To report and track issues with your verified citizen profile, please log in or create an account.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            ) : submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{submitSuccess}</h3>
                <p className="text-slate-500 text-xs">Synchronized with MongoDB database.</p>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {editingIssue ? 'Update Report' : 'Civic Dispatch'}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    {editingIssue ? 'Edit Issue Details' : 'Report an Issue'}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    Directly synced with your municipal database
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Issue Title (max 50 chars)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="e.g. Open Pothole near Central Market"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="Road">Road</option>
                        <option value="Water">Water</option>
                        <option value="Streetlight">Streetlight</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Pothole">Pothole</option>
                        <option value="Sanitation">Sanitation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / Street Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4th Cross Road, Ward 12"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description (max 500 chars)
                    </label>
                    <textarea
                      rows="3"
                      required
                      maxLength={500}
                      placeholder="Describe the issue, size, potential hazard or duration..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setEditingIssue(null);
                      }}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? 'Saving...' : editingIssue ? 'Save Changes' : 'Submit Issue'}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Issue;
