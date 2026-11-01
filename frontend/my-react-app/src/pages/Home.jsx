import { useState } from 'react';
import Navbar from '../component/Navbar';
import { Link } from 'react-router';
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

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { createIssue } = useIssue();

  const [issuesList, setIssuesList] = useState(INITIAL_ISSUES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');

  // Form state for reporting issue
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road',
    location: '',
    description: '',
    priority: 'Medium'
  });

  const categories = ['All', 'Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];

  const handleUpvote = (id) => {
    setIssuesList((prev) =>
      prev.map((iss) => (iss._id === id ? { ...iss, upvotes: iss.upvotes + 1 } : iss))
    );
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

  const filteredIssues =
    selectedCategory === 'All'
      ? issuesList
      : issuesList.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-sky-50/70 via-sky-50/20 to-white overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-sky-100/80 text-sky-600 border border-sky-200/60 shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                Cleaner Cities, Better Communities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-5">
                Report Local Issues, <br className="hidden sm:inline" />
                <span className="text-slate-900">Make a Real Change</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                FixNear helps citizens report and track civic issues like potholes, water leakage, streetlight problems and more. Together we can build a better, cleaner and safer community.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Report an issue
                </button>

                <Link
                  to="/issues"
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-blue-600 bg-white hover:bg-blue-50/60 active:scale-98 border border-blue-200 hover:border-blue-300 rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Issues
                </Link>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern clean city with greenery and blue sky"
                  className="w-full h-72 sm:h-96 lg:h-[400px] object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">1,420+ Issues Fixed</p>
                    <p className="text-[11px] text-slate-500">Across 85+ Neighborhoods</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 4 Feature Highlights */}
          <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-sky-300 text-sky-500 bg-sky-50/50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="14" height="16" rx="2" strokeWidth="2" />
                  <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9" y1="13" x2="15" y2="13" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">Easy Reporting</h3>
                <p className="text-xs sm:text-sm text-slate-500">Submit issues in minutes</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-amber-300 text-amber-500 bg-amber-50/50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <polyline points="12 7 12 12 15 15" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">Track Progress</h3>
                <p className="text-xs sm:text-sm text-slate-500">Stay updated in real-time</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-sky-300 text-sky-500 bg-sky-50/50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">Transparent Process</h3>
                <p className="text-xs sm:text-sm text-slate-500">See how issues are resolved</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-amber-300 text-amber-500 bg-amber-50/50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">Stronger Communities</h3>
                <p className="text-xs sm:text-sm text-slate-500">Be part of the change</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Issues Explorer Section */}
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
                    onClick={() => setSelectedCategory(cat)}
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
            {filteredIssues.map((issue) => (
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
                    {issue.location} • <span className="text-slate-400">{issue.date}</span>
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
                    onClick={() => handleUpvote(issue._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition font-medium cursor-pointer"
                    title="Upvote to raise awareness"
                  >
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Upvote ({issue.upvotes})
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center flex items-center justify-center gap-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
            >
              Report an Issue
            </button>
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition shadow-2xs"
            >
              Browse All Issues Tracker &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
              How FixNear Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              From report to resolution, we keep you informed every step of the way with total transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Spot & Submit</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Notice a broken streetlight or open pothole? Submit a quick report with the location and description.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified & Dispatched</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The issue is automatically routed and verified with local municipal teams and maintenance crews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fixed & Documented</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive live status updates until the problem is marked resolved with before-and-after proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-5 leading-tight">
                Empowering Citizens to Build Cleaner, Smarter Cities
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6">
                FixNear is a civic-tech initiative dedicated to modernizing municipal accountability. By giving residents a direct, transparent channel to highlight civic infrastructure problems, we turn frustration into measurable community progress.
              </p>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-3xl font-extrabold text-emerald-400">94%</p>
                  <p className="text-xs text-slate-400 mt-1">Resolution Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-sky-400">48 hrs</p>
                  <p className="text-xs text-slate-400 mt-1">Avg Response</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-amber-400">85+</p>
                  <p className="text-xs text-slate-400 mt-1">Neighborhoods</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-xl">
              <h3 className="text-xl font-bold mb-3">Join Your Local Action Network</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Connect with neighbors, upvote urgent civic needs, and follow municipal progress reports right from your phone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 text-center text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 text-center text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-4">
            Need Support or Municipal Partnership?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Are you a city official, ward representative, or active community volunteer? Reach out to collaborate with FixNear.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-2xl text-left max-w-xl mx-auto shadow-xs">
            <form onSubmit={handleContactSubmit}>
              <div className="space-y-4">
                {contactError && (
                  <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {contactError}
                  </p>
                )}
                {contactSuccess && (
                  <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {contactSuccess}
                  </p>
                )}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    maxLength={254}
                    placeholder="jane@example.com"
                    value={contactForm.email}
                    onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows="3"
                    id="contact-message"
                    name="message"
                    required
                    maxLength={5000}
                    placeholder="How can FixNear help your ward or neighborhood?"
                    value={contactForm.message}
                    onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactLoading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              FN
            </div>
            <span className="text-lg font-bold text-white">Fix<span className="text-emerald-400">Near</span></span>
            <span className="text-xs text-slate-500 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <a href="#home" className="hover:text-white transition">Home</a>
            <Link to="/issues" className="hover:text-white transition">Issues</Link>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#how-it-works" className="hover:text-white transition">How it works</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
            <Link to="/login" className="hover:text-white transition">Sign In</Link>
          </div>
        </div>
      </footer>

      {/* Interactive Report Issue Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative">
            
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {reportSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Issue Reported!</h3>
                <p className="text-slate-600 text-sm">
                  Thank you! Your civic report has been submitted and added to the community queue.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    New Civic Report
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">Report an Issue</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Provide details below to help dispatch municipal assistance quickly.
                  </p>
                </div>

                {reportError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {reportError}
                  </div>
                )}

                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title (max 50 chars)</label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      placeholder="e.g. Broken streetlight near park entrance"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5th Cross, Main Market Road"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description (max 500 chars)</label>
                    <textarea
                      rows="3"
                      required
                      maxLength={500}
                      placeholder="Give additional context (e.g. size, duration of issue, hazard to traffic)..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                    >
                      Submit Report
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

export default Home;
