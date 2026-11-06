import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import useAuth from '../../auth/hooks/useAuth';
import useIssue from '../../issues/hooks/useIssue';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardTopBar from '../components/DashboardTopBar';
import DashboardOverview from '../components/DashboardOverview';
import MyComplaintsView from '../components/MyComplaintsView';
import ReportIssueView from '../components/ReportIssueView';
import ProfileView from '../components/ProfileView';
import IssueModal from '../../issues/components/IssueModal';

// Sample fallback complaints matching the user's design image if newly registered user has no issues yet
const SAMPLE_COMPLAINTS = [
  {
    _id: 'sample-1',
    title: 'Water leakage near park',
    location: 'Ballabgarh, Ward 12',
    category: 'Water',
    status: 'In Progress',
    priority: 'High',
    description: 'Clean drinking water pipe burst causing water logging on sidewalk.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'sample-2',
    title: 'Broken street light',
    location: 'Sector 23',
    category: 'Streetlight',
    status: 'Reported',
    priority: 'Medium',
    description: 'Streetlight has been flickering for 4 days, making the road unsafe at night.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'sample-3',
    title: 'Road pothole',
    location: 'Main Market',
    category: 'Pothole',
    status: 'Resolved',
    priority: 'High',
    description: 'Deep road cavity causing severe traffic slowdown and vehicle tire damage.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const {
    issues,
    isLoading: isIssuesLoading,
    fetchMyIssues,
    createIssue,
    updateExistingIssue,
    removeIssue,
  } = useIssue();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Edit Modal State
  const [editingIssue, setEditingIssue] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Road',
    location: '',
    priority: 'Medium',
    status: 'Reported',
    description: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Toast Banner State
  const [toastMessage, setToastMessage] = useState('');

  // 1. Guard: Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 2. Fetch issues from backend for current user
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyIssues()
        .finally(() => {
          setIsDataLoaded(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Compute active complaints list (uses Redux issues, or samples if empty)
  const userComplaints = useMemo(() => {
    if (Array.isArray(issues) && issues.length > 0) {
      return issues;
    }
    return SAMPLE_COMPLAINTS;
  }, [issues]);

  // Calculate statistics dynamically
  const stats = useMemo(() => {
    const list = userComplaints || [];
    return {
      total: list.length,
      inProgress: list.filter((i) => i.status === 'In Progress').length,
      resolved: list.filter((i) => i.status === 'Resolved').length,
      reported: list.filter((i) => i.status === 'Reported').length,
    };
  }, [userComplaints]);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Handlers
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  };

  const handleCreateIssue = async (formData) => {
    setIsSubmitting(true);
    try {
      await createIssue(formData);
      showToast('Complaint reported successfully! Municipal team notified.');
      setActiveTab('dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (issue) => {
    setEditingIssue(issue);
    setEditFormData({
      title: issue.title || '',
      category: issue.category || 'Road',
      location: issue.location || '',
      priority: issue.priority || 'Medium',
      status: issue.status || 'Reported',
      description: issue.description || '',
      image: null,
    });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingIssue) return;
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      if (!editingIssue._id.startsWith('sample-')) {
        await updateExistingIssue(editingIssue._id, editFormData);
      }

      setSubmitSuccess('Changes saved successfully!');
      setTimeout(() => {
        setEditingIssue(null);
        setSubmitSuccess('');
        showToast('Complaint updated successfully.');
      }, 900);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to update issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      if (!id.startsWith('sample-')) {
        await removeIssue(id);
      }
      showToast('Complaint deleted.');
    } catch (err) {
      alert(err?.message || 'Failed to delete complaint.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardTopBar
          user={user}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          unreadCount={1}
        />

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mx-4 sm:mx-8 mt-4 p-3.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
            <span>✓ {toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage('')}
              className="font-bold opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              user={user}
              stats={stats}
              recentComplaints={userComplaints.slice(0, 5)}
              isLoading={isIssuesLoading && !isDataLoaded}
              onViewAll={() => setActiveTab('complaints')}
              onOpenReport={() => setActiveTab('report')}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteIssue}
            />
          )}

          {activeTab === 'report' && (
            <ReportIssueView
              onSubmit={handleCreateIssue}
              isLoading={isSubmitting}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'complaints' && (
            <MyComplaintsView
              complaints={userComplaints}
              isLoading={isIssuesLoading && !isDataLoaded}
              onOpenReport={() => setActiveTab('report')}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteIssue}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView user={user} stats={stats} />
          )}
        </main>
      </div>

      {/* Edit Issue Modal */}
      {editingIssue && (
        <IssueModal
          isOpen={Boolean(editingIssue)}
          editingIssue={editingIssue}
          formData={editFormData}
          onFormChange={setEditFormData}
          onSubmit={handleSaveEdit}
          onClose={() => setEditingIssue(null)}
          isLoading={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
}
