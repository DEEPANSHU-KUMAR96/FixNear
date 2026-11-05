import { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import HeroSection from '../component/HeroSection';
import IssuesDemoSection from '../component/IssuesDemoSection';
import HowItWorksSection from '../component/HowItWorksSection';
import AboutSection from '../component/AboutSection';
import ContactSection from '../component/ContactSection';
import FooterSection from '../component/FooterSection';
import ReportIssueModal from '../component/ReportIssueModal';
import { useDispatch } from 'react-redux';
import { createIssueSuccess } from '../features/issues/state/issueSlice';
import useAuth from '../features/auth/hooks/useAuth';
import useIssue from '../features/issues/hooks/useIssue';
import { createContact } from '../features/contact/services/contact.service';

const INITIAL_ISSUES = [
  {
    _id: 'iss-1',
    title: 'Deep Pothole on Oakwood Avenue',
    category: 'Road',
    location: 'Oakwood Ave & 4th Street',
    status: 'In Progress',
    priority: 'High',
    upvotes: 34,
    date: '2 hours ago',
    description: 'Hazardous pothole right near the pedestrian crossing causing vehicle damage.'
  },
  {
    _id: 'iss-2',
    title: 'Continuous Water Pipe Leakage',
    category: 'Water',
    location: 'Sector 8 Market Square',
    status: 'Reported',
    priority: 'High',
    upvotes: 52,
    date: '5 hours ago',
    description: 'Clean drinking water pipe burst causing water logging on sidewalk.'
  },
  {
    _id: 'iss-3',
    title: 'Flickering Streetlight on Green Park',
    category: 'Streetlight',
    location: 'Green Park Lane, Block C',
    status: 'Resolved',
    priority: 'Medium',
    upvotes: 19,
    date: '1 day ago',
    description: 'Streetlight has been flickering for 4 days, making the road unsafe at night.'
  },
  {
    _id: 'iss-4',
    title: 'Overfilled Community Waste Bin',
    category: 'Garbage',
    location: 'Pine Crest Garden Entrance',
    status: 'In Progress',
    priority: 'Medium',
    upvotes: 27,
    date: '1 day ago',
    description: 'Waste bin has not been cleared for over 48 hours and is overflowing.'
  }
];

const CATEGORIES = ['All', 'Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { createIssue, fetchAllIssues, upvoteIssue } = useIssue();

  const [issuesList, setIssuesList] = useState(INITIAL_ISSUES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  // Fetch real issues from backend on load
  useEffect(() => {
    fetchAllIssues()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIssuesList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Form state for reporting issue
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road',
    location: '',
    description: '',
    priority: 'Medium'
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  const handleUpvote = async (id) => {
    if (!isAuthenticated) {
      // Local optimistic increment for non-logged in users
      setIssuesList((prev) =>
        prev.map((iss) => {
          if (iss._id === id) {
            const count = typeof iss.upvotesCount === 'number'
              ? iss.upvotesCount
              : (Array.isArray(iss.upvotes) ? iss.upvotes.length : (iss.upvotes || 0));
            return {
              ...iss,
              upvotesCount: count + 1,
              upvotes: count + 1,
            };
          }
          return iss;
        })
      );
      return;
    }

    try {
      const res = await upvoteIssue(id);
      const updated = res?.issue;
      if (updated) {
        setIssuesList((prev) =>
          prev.map((iss) => (iss._id === id ? { ...iss, ...updated } : iss))
        );
      }
    } catch (err) {
      console.error('Failed to upvote on backend:', err);
      // Fallback optimistic update
      setIssuesList((prev) =>
        prev.map((iss) => {
          if (iss._id === id) {
            const count = typeof iss.upvotesCount === 'number'
              ? iss.upvotesCount
              : (Array.isArray(iss.upvotes) ? iss.upvotes.length : (iss.upvotes || 0));
            return {
              ...iss,
              upvotesCount: count + 1,
              upvotes: count + 1,
            };
          }
          return iss;
        })
      );
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError('');

    if (!formData.title || !formData.location || !formData.description) {
      setReportError('Please fill in title, location and description.');
      return;
    }

    // If authenticated, persist directly to backend
    if (isAuthenticated) {
      try {
        await createIssue(formData);
      } catch (err) {
        setReportError(err?.message || 'Failed to submit issue to backend.');
        return;
      }
    }

    const newIssue = {
      _id: `iss-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      location: formData.location,
      status: 'Reported',
      priority: formData.priority,
      upvotes: 1,
      date: 'Just now',
      description: formData.description
    };

    dispatch(createIssueSuccess(newIssue));
    setIssuesList((prev) => [newIssue, ...prev]);
    setReportSuccess(true);

    setTimeout(() => {
      setReportSuccess(false);
      setIsReportModalOpen(false);
      setFormData({
        title: '',
        category: 'Road',
        location: '',
        description: '',
        priority: 'Medium'
      });
      const issuesSection = document.getElementById('issues');
      if (issuesSection) {
        issuesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess('');
    setContactLoading(true);

    try {
      const response = await createContact(contactForm);
      setContactSuccess(response.message || 'Your inquiry has been sent.');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setContactError(error.message || 'Failed to send your inquiry. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar />

      <HeroSection onOpenReportModal={() => setIsReportModalOpen(true)} />

      <IssuesDemoSection
        issuesList={issuesList}
        selectedCategory={selectedCategory}
        categories={CATEGORIES}
        onCategoryChange={setSelectedCategory}
        onUpvote={handleUpvote}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        currentUserId={user?.id || user?._id}
      />

      <HowItWorksSection />

      <AboutSection onOpenReportModal={() => setIsReportModalOpen(true)} />

      <ContactSection
        contactForm={contactForm}
        onFormChange={setContactForm}
        onSubmit={handleContactSubmit}
        loading={contactLoading}
        error={contactError}
        success={contactSuccess}
      />

      <FooterSection />

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportSuccess={reportSuccess}
        reportError={reportError}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Home;
