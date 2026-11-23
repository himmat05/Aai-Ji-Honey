import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { careerApi } from '../../../api/careerApi';
import { formatDate } from '../../../utils/formatters';

const CareerManagementSection = ({ onApplicationsUpdated }) => {
  // Sub-tab: 'applications' or 'jobs'
  const [subTab, setSubTab] = useState('applications');

  // Resume Preview modal state: { app, url }
  const [previewResume, setPreviewResume] = useState(null);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appFilter, setAppFilter] = useState('all'); // 'all', 'new', 'shortlisted', 'interviewing', 'rejected', 'hired'
  const [appSearch, setAppSearch] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Job postings state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Apiculture & Field Operations',
    location: 'Rajasthan, India',
    employmentType: 'Full-Time',
    experienceRequired: '1-2 Years',
    salaryRange: 'Competitive',
    description: '',
    requirements: '',
  });

  // Editing notes state per application: { [appId]: notes }
  const [activeNotes, setActiveNotes] = useState({});

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const data = await careerApi.getApplications(appFilter, appSearch);
      if (data?.applications) {
        setApplications(data.applications);
        setUnreadCount(data.unreadCount || 0);
        if (onApplicationsUpdated) {
          onApplicationsUpdated(data.applications.length, data.unreadCount || 0);
        }
      }
    } catch (err) {
      console.error('Failed to load job applications:', err);
      toast.error('Could not load job applications from server');
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await careerApi.getAdminJobs();
      if (Array.isArray(data)) {
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, [appFilter]);

  // Debounced or direct search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(timer);
  }, [appSearch]);

  // Update Status handler with instant optimistic update
  const handleUpdateStatus = async (id, newStatus) => {
    const previous = applications;
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: newStatus, isReadByAdmin: true } : app))
    );
    toast.success(`Candidate marked as "${newStatus}"`);

    try {
      await careerApi.updateApplicationStatus(id, newStatus);
    } catch (err) {
      console.error('Status sync error:', err);
      toast.error('Failed to sync status update with server');
      setApplications(previous);
    }
  };

  // Save admin notes handler
  const handleSaveNotes = async (id) => {
    const notes = activeNotes[id];
    if (notes === undefined) return;

    try {
      await careerApi.updateApplicationStatus(id, undefined, notes);
      toast.success('📝 Interview notes saved');
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, adminNotes: notes } : app))
      );
    } catch (err) {
      console.error('Notes save error:', err);
      toast.error('Failed to save notes');
    }
  };

  // Delete application handler
  const handleDeleteApplication = async (id, applicantName) => {
    if (!window.confirm(`Are you sure you want to delete application from "${applicantName}"?`)) {
      return;
    }

    setApplications((prev) => prev.filter((app) => app._id !== id));
    toast.success(`Application from ${applicantName} deleted`);

    try {
      await careerApi.deleteApplication(id);
    } catch (err) {
      console.error('Delete application failed:', err);
      toast.error('Failed to delete application from server');
      fetchApplications();
    }
  };

  // Toggle job active status
  const handleToggleJob = async (id) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, isActive: !j.isActive } : j))
    );
    toast.info('Job status updated');

    try {
      await careerApi.toggleJobStatus(id);
    } catch (err) {
      console.error('Job toggle error:', err);
      toast.error('Failed to update job status on server');
      fetchJobs();
    }
  };

  // Delete job opening
  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete job posting "${title}"?`)) {
      return;
    }

    setJobs((prev) => prev.filter((j) => j._id !== id));
    toast.success(`Job "${title}" deleted`);

    try {
      await careerApi.deleteJob(id);
    } catch (err) {
      console.error('Job delete error:', err);
      toast.error('Failed to delete job from server');
      fetchJobs();
    }
  };

  // Create job opening
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      toast.error('Job Title and Description are required');
      return;
    }

    try {
      setIsCreatingJob(true);
      const res = await careerApi.createJob(jobForm);
      if (res?.job) {
        toast.success(`🎉 Job opening "${res.job.title}" created successfully!`);
        setJobs((prev) => [res.job, ...prev]);
        setJobForm({
          title: '',
          department: 'Apiculture & Field Operations',
          location: 'Rajasthan, India',
          employmentType: 'Full-Time',
          experienceRequired: '1-2 Years',
          salaryRange: 'Competitive',
          description: '',
          requirements: '',
        });
      }
    } catch (err) {
      console.error('Error creating job opening:', err);
      toast.error('Failed to create job opening');
    } finally {
      setIsCreatingJob(false);
    }
  };

  // Filtered applications summary
  const summary = useMemo(() => {
    return {
      total: applications.length,
      newCount: applications.filter((a) => a.status === 'new').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
      interviewing: applications.filter((a) => a.status === 'interviewing').length,
    };
  }, [applications]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Top Header & Sub-Tab Bar */}
      <div className="honey-glass rounded-3xl p-6 border border-amber-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
            Apiculture Talent & Recruitment Management
          </span>
          <h2 className="text-2xl font-black text-amber-950 font-heading">
            💼 Careers, Candidates & Job Postings
          </h2>
          <p className="text-xs text-amber-900/80 mt-0.5">
            Overseen by Dr. Neha Tomar (HR & Outreach) & Dr. Sitaram Seervi.
          </p>
        </div>

        {/* Sub-Tab Switcher */}
        <div className="flex items-center gap-2 bg-amber-100/70 p-1.5 rounded-2xl border border-amber-300/80 self-start md:self-auto">
          <button
            onClick={() => setSubTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'applications'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            <span>📑 Candidate Applications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              subTab === 'jobs'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-200/50'
            }`}
          >
            <span>📢 Manage Job Postings</span>
            <span className="bg-amber-200 text-amber-950 text-[10px] px-2 py-0.5 rounded-full font-black">
              {jobs.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: CANDIDATE APPLICATIONS */}
      {/* ========================================================= */}
      {subTab === 'applications' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Total Applicants
              </span>
              <p className="text-2xl font-black text-amber-950 mt-1 font-heading">{summary.total}</p>
            </div>
            <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
                New / Unreviewed
              </span>
              <p className="text-2xl font-black text-orange-800 mt-1 font-heading">{summary.newCount}</p>
            </div>
            <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Shortlisted
              </span>
              <p className="text-2xl font-black text-emerald-800 mt-1 font-heading">{summary.shortlisted}</p>
            </div>
            <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                Interviewing
              </span>
              <p className="text-2xl font-black text-blue-800 mt-1 font-heading">{summary.interviewing}</p>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {['all', 'new', 'shortlisted', 'interviewing', 'rejected', 'hired'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                    appFilter === st
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search name, email, phone, role..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Applications List */}
          {loadingApps ? (
            <div className="text-center py-12 honey-glass rounded-3xl border border-amber-200">
              <span className="text-3xl animate-spin block mb-2">⏳</span>
              <p className="text-xs font-bold text-amber-900">Loading candidate applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 honey-glass rounded-3xl border border-amber-200">
              <span className="text-4xl block mb-2">📭</span>
              <h3 className="text-base font-bold text-amber-950">No Applications Found</h3>
              <p className="text-xs text-amber-800 mt-1">
                {appFilter !== 'all' ? `No applications currently in "${appFilter}" status.` : 'No candidates have applied yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isNew = app.status === 'new' || !app.isReadByAdmin;
                const notesVal =
                  activeNotes[app._id] !== undefined ? activeNotes[app._id] : app.adminNotes || '';

                return (
                  <div
                    key={app._id}
                    className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 border shadow-md flex flex-col justify-between ${
                      isNew
                        ? 'bg-amber-50/95 border-amber-400 shadow-amber-200/50 ring-2 ring-amber-400/30'
                        : 'honey-glass border-amber-200/90'
                    }`}
                  >
                    <div>
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-amber-200/70">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-amber-950 font-heading">
                              {app.name}
                            </h3>
                            {isNew && (
                              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-800 font-semibold mt-0.5">
                            📧 {app.email} • 📱 {app.mobile} {app.city && `• 📍 ${app.city}`}
                          </p>
                        </div>

                        {/* Status & Date */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1.5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black capitalize shadow-xs inline-flex items-center gap-1 ${
                              app.status === 'shortlisted'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : app.status === 'interviewing'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : app.status === 'rejected'
                                ? 'bg-gray-100 text-gray-700 border border-gray-300'
                                : app.status === 'hired'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-orange-100 text-orange-900 border border-orange-300'
                            }`}
                          >
                            ● {app.status}
                          </span>
                          <span className="text-[11px] text-gray-500 font-medium">
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Position Details & Experience */}
                      <div className="my-3 flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-amber-200/80 text-amber-950 text-xs font-extrabold uppercase tracking-wider">
                          🎯 {app.jobTitle}
                        </span>
                        {app.experience && (
                          <span className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 text-xs font-semibold">
                            ⏳ {app.experience}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 ml-auto font-mono">
                          ID: {app._id}
                        </span>
                      </div>

                      {/* Cover Statement */}
                      {app.coverNote && (
                        <div className="p-3.5 rounded-2xl bg-white/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed mb-3">
                          <strong className="text-amber-900 block mb-1">Candidate Statement:</strong>
                          "{app.coverNote}"
                        </div>
                      )}

                      {/* LinkedIn / Portfolio */}
                      {app.linkedinUrl && (
                        <div className="mb-3 text-xs">
                          <strong className="text-amber-900">Portfolio / LinkedIn: </strong>
                          <a
                            href={app.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 underline font-semibold hover:text-amber-900"
                          >
                            {app.linkedinUrl}
                          </a>
                        </div>
                      )}

                      {/* Interview Remarks / Notes Box */}
                      <div className="mt-3 p-3 rounded-2xl bg-amber-100/50 border border-amber-200">
                        <label className="block text-[11px] font-black text-amber-900 uppercase tracking-wider mb-1">
                          HR & Technical Interview Notes:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add evaluation remarks, interview schedule, candidate score..."
                            value={notesVal}
                            onChange={(e) =>
                              setActiveNotes({ ...activeNotes, [app._id]: e.target.value })
                            }
                            className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(app._id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-3">
                      {/* View & Preview Resume Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const url = careerApi.getResumeViewUrl(app._id, app.resumeUrl);
                            setPreviewResume({ app, url });
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>👁️</span>
                          <span>Preview Resume</span>
                        </button>

                        <a
                          href={careerApi.getResumeViewUrl(app._id, app.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1 no-underline"
                          title="Open resume in full new window or download"
                        >
                          <span>↗️</span>
                          <span>Open in Tab</span>
                        </a>

                        <a
                          href={`mailto:${app.email}?subject=Aai%20Ji%20Honey%20Career%20Application%20-%20${encodeURIComponent(
                            app.jobTitle
                          )}`}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1 no-underline"
                        >
                          <span>✉️</span>
                          <span>Email</span>
                        </a>
                      </div>

                      {/* Status Update Quick Select & Delete */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900">Change Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs text-amber-950 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="rejected">Rejected</option>
                          <option value="hired">Hired</option>
                        </select>

                        <button
                          onClick={() => handleDeleteApplication(app._id, app.name)}
                          className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                          title="Delete application permanently"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: MANAGE JOB POSTINGS */}
      {/* ========================================================= */}
      {subTab === 'jobs' && (
        <div className="space-y-6">
          {/* Create Job Form */}
          <div className="honey-glass rounded-3xl p-6 border border-amber-300 shadow-md">
            <h3 className="text-lg font-black text-amber-950 font-heading mb-4">
              ➕ Post a New Job Opening
            </h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apiary Health Inspector"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Apiculture & Field Operations">Apiculture & Field Operations</option>
                    <option value="Research & Quality Assurance">Research & Quality Assurance</option>
                    <option value="Supply Chain & Operations">Supply Chain & Operations</option>
                    <option value="Marketing & Outreach">Marketing & Outreach</option>
                    <option value="Finance & Administration">Finance & Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mewar Apiary Station, Rajasthan"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Employment Type
                  </label>
                  <select
                    value={jobForm.employmentType}
                    onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract / Seasonal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Experience Required
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-2 Years / Fresh Graduate"
                    value={jobForm.experienceRequired}
                    onChange={(e) => setJobForm({ ...jobForm, experienceRequired: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Salary / Compensation Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 - ₹35,000 / month"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="Detail daily responsibilities, apiculture duties, or marketing scope..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                  Requirements & Qualifications
                </label>
                <textarea
                  rows="2"
                  placeholder="Degrees, licenses, technical skills, languages required..."
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingJob}
                  className="btn-honey-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isCreatingJob ? 'Publishing...' : 'Publish Job Opening 🚀'}
                </button>
              </div>
            </form>
          </div>

          {/* List of Existing Job Postings */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-amber-950 font-heading">
              Active & Published Openings ({jobs.length})
            </h3>

            {loadingJobs ? (
              <div className="text-center py-8">
                <span className="text-2xl animate-spin block mb-1">⏳</span>
                <p className="text-xs text-amber-800">Loading job postings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No job postings exist yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className={`honey-glass rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
                      job.isActive ? 'border-amber-300' : 'border-gray-300 opacity-60 bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                          {job.department}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            job.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-amber-950 font-heading">{job.title}</h4>
                      <p className="text-xs text-amber-800 mt-0.5 font-medium">
                        📍 {job.location} • ⏳ {job.experienceRequired}
                      </p>
                      <p className="text-xs text-amber-900/80 mt-2 line-clamp-2">{job.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleJob(job._id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                          job.isActive
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {job.isActive ? 'Deactivate Role' : 'Activate Role'}
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id, job.title)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Delete opening permanently"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. RESUME PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="text-base font-black font-heading">
                    Resume: {previewResume.app.name}
                  </h3>
                  <p className="text-xs text-amber-100">
                    Applying for: {previewResume.app.jobTitle} • {previewResume.app.experience || 'Experience not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewResume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 no-underline transition-colors"
                >
                  <span>↗️</span>
                  <span>Open in Full Window</span>
                </a>
                <button
                  onClick={() => setPreviewResume(null)}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-base transition-colors cursor-pointer"
                  aria-label="Close resume preview"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-amber-50/40 p-2 sm:p-4 overflow-hidden flex flex-col">
              {previewResume.app.resumeUrl?.toLowerCase().includes('.doc') ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <span className="text-5xl">📝</span>
                  <h4 className="text-lg font-black text-amber-950 font-heading">
                    Microsoft Word Document (.docx / .doc)
                  </h4>
                  <p className="text-xs text-amber-900/80 max-w-md">
                    Web browsers cannot directly render Microsoft Word documents inline. Click below to download and view the candidate's resume in Word or Google Docs.
                  </p>
                  <a
                    href={previewResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-honey-primary px-6 py-3 text-xs font-bold uppercase tracking-wider no-underline"
                  >
                    Download Resume Document ⬇️
                  </a>
                </div>
              ) : (
                <iframe
                  src={previewResume.url}
                  className="w-full h-full rounded-2xl border border-amber-200 bg-white"
                  title={`Resume - ${previewResume.app.name}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerManagementSection;
