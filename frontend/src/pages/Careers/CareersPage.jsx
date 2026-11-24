import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { careerApi } from '../../api/careerApi';

const CULTURE_PILLARS = [
  {
    icon: '🐝',
    title: 'Ethical Apiculture Mission',
    desc: 'We never harm bees or use smoke burning. Our team champions sustainable Langstroth hive preservation across Rajasthan.',
  },
  {
    icon: '🔬',
    title: 'Entomology & Research-Driven',
    desc: 'Founded by Ph.D. entomologists, our field practices, pollination studies, and NMR purity benchmarks set national standards.',
  },
  {
    icon: '🌾',
    title: '500+ Tribal Farmer Impact',
    desc: 'Work directly on grassroots empowerment, training rural and tribal communities with living wages and seasonal honey support.',
  },
  {
    icon: '🍯',
    title: 'Natural Perks & Living Culture',
    desc: 'Enjoy authentic raw honey allowances, outdoor field research experiences, flexible work culture, and rapid startup growth.',
  },
];

const DEFAULT_JOBS = [
  {
    _id: 'default-job-1',
    title: 'Apiculture Field Specialist & Colony Inspector',
    department: 'Apiculture & Field Operations',
    location: 'Pali / Mewar Apiary Division, Rajasthan',
    employmentType: 'Full-Time',
    experienceRequired: '1-3 Years',
    salaryRange: '₹25,000 - ₹38,000 / month',
    description:
      'Work alongside Dr. Sitaram Seervi to oversee colony health across Rajasthan desert flora, conduct disease surveillance, and assist with seasonal migrations and ethical queen-rearing.',
    requirements:
      'B.Sc. in Agriculture, Zoology, Entomology, or hands-on experience in beekeeping. Passion for bee welfare, willingness to travel across field stations, valid two-wheeler license.',
    orderNum: 1,
    isActive: true,
  },
  {
    _id: 'default-job-2',
    title: 'Honey Quality & NMR Testing Lab Analyst',
    department: 'Research & Quality Assurance',
    location: 'Central Testing Hub, Udaipur, Rajasthan',
    employmentType: 'Full-Time',
    experienceRequired: '1-2 Years',
    salaryRange: '₹28,000 - ₹42,000 / month',
    description:
      'Perform rigorous moisture analysis, pollen density counts, and HMF/diastase enzyme testing to ensure every single batch meets NMR-grade pure honey standards without any adulteration.',
    requirements:
      'B.Sc. / M.Sc. in Food Technology, Biochemistry, or Chemistry. Familiarity with refractometers, spectrophotometers, and FSSAI honey testing protocols.',
    orderNum: 2,
    isActive: true,
  },
  {
    _id: 'default-job-3',
    title: 'E-Commerce Logistics & Cold-Chain Executive',
    department: 'Supply Chain & Operations',
    location: 'Udaipur Fulfillment Center, Rajasthan',
    employmentType: 'Full-Time',
    experienceRequired: '0-2 Years',
    salaryRange: '₹20,000 - ₹30,000 / month',
    description:
      'Coordinate delicate UV-glass jar packaging, cold storage temperature maintenance, inventory reconciliation, and courier dispatch partner management across nationwide delivery routes.',
    requirements:
      'Graduate in any discipline. Experience with e-commerce shipping platforms (Shiprocket, Bluedart, Delhivery), warehouse stock auditing, and meticulous fragile packaging standards.',
    orderNum: 3,
    isActive: true,
  },
  {
    _id: 'default-job-4',
    title: 'Brand Storyteller & Apiculture Content Creator',
    department: 'Marketing & Outreach',
    location: 'Hybrid / Rajasthan (Udaipur or Jodhpur)',
    employmentType: 'Full-Time / Part-Time',
    experienceRequired: '1+ Years',
    salaryRange: '₹22,000 - ₹35,000 / month',
    description:
      'Capture real hive harvesting sessions, create informative reels on Ayurvedic honey benefits, and document our tribal farmer empowerment initiatives across Instagram and YouTube.',
    requirements:
      'Demonstrated portfolio in short-form video creation (Reels, Shorts), mobile videography, basic Hindi/English copywriting. Genuine enthusiasm for rural heritage and organic food.',
    orderNum: 4,
    isActive: true,
  },
];

const CareersPage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');

  // Application Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    experience: '1-2 Years',
    linkedinUrl: '',
    coverNote: '',
    website_url: '', // Honeypot anti-bot field
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState('');

  // Fetch jobs on mount
  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const data = await careerApi.getActiveJobs();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setJobs(data);
          } else {
            setJobs(DEFAULT_JOBS);
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not load remote jobs, using authentic fallback openings:', err.message);
        if (isMounted) setJobs(DEFAULT_JOBS);
      } finally {
        if (isMounted) setLoadingJobs(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autofill if customer is authenticated
  useEffect(() => {
    if (user) {
      const rawUserMobile = user.mobile || user.phone || '';
      const cleanUserMobile = rawUserMobile.replace(/\D/g, '').slice(-10);
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || cleanUserMobile,
        city: prev.city || user.location || user.city || '',
      }));
    }
  }, [user]);

  // Extract unique departments for filter
  const departments = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);
    return ['All', ...list];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (selectedDept === 'All') return jobs;
    return jobs.filter((j) => j.department === selectedDept);
  }, [jobs, selectedDept]);

  // Open apply modal for a specific job or general application
  const handleOpenApplyModal = (job = null) => {
    setSelectedJob(job);
    setFileError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setResumeFile(null);
    setFileError('');
    setSubmittedApplication(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate size (< 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('File size exceeds 5MB. Please upload a smaller PDF or DOCX file.');
      setResumeFile(null);
      return;
    }

    // Validate extension
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setFileError('Invalid file type. Please upload a PDF or Microsoft Word (.docx, .doc) resume.');
      setResumeFile(null);
      return;
    }

    setFileError('');
    setResumeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    const cleanMobile = formData.mobile.replace(/\D/g, '');

    if (!formData.name.trim() || !formData.email.trim() || !cleanMobile) {
      toast.error('Please fill in your name, email, and mobile number.');
      return;
    }

    if (cleanMobile.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits (e.g. 9876543210).');
      return;
    }

    if (!resumeFile) {
      setFileError('Please attach your Resume / CV file (PDF or DOCX).');
      toast.error('Resume / CV file is required.');
      return;
    }

    try {
      setSubmitting(true);
      const postData = new FormData();
      postData.append('name', formData.name.trim());
      postData.append('email', formData.email.trim());
      postData.append('mobile', cleanMobile);
      postData.append('city', formData.city.trim());
      postData.append('experience', formData.experience);
      postData.append('linkedinUrl', formData.linkedinUrl.trim());
      postData.append('coverNote', formData.coverNote.trim());
      postData.append('jobTitle', selectedJob ? selectedJob.title : 'General / Open Application');
      if (selectedJob?._id) {
        postData.append('jobId', selectedJob._id);
      }
      postData.append('resume', resumeFile);

      // Honeypot field
      if (formData.website_url) {
        postData.append('website_url', formData.website_url);
      }

      const res = await careerApi.applyForJob(postData);
      toast.success('🎉 Application submitted successfully!');
      setSubmittedApplication({
        trackingId: res.trackingId || 'AJH-APP-CONFIRMED',
        name: formData.name,
        jobTitle: selectedJob ? selectedJob.title : 'General / Open Application',
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to submit application. Please try again.';
      toast.error(`❌ ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative text-center py-12 sm:py-16 overflow-hidden rounded-3xl honey-glass border border-amber-300/80 shadow-xl mb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-400/25 via-orange-400/20 to-yellow-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-bold text-xs uppercase tracking-wider mb-5">
            <span>🐝</span>
            <span>Aai Ji Honey Careers & Apiary Initiatives</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-950 font-heading tracking-tight leading-tight">
            Join Our Hive: Build India’s Most Authentic{' '}
            <span className="honey-gradient-text">Pure Honey</span> Movement
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-amber-900/80 max-w-2xl mx-auto leading-relaxed">
            Work alongside entomologists, food scientists, and 500+ rural Rajasthani beekeepers.
            Help us protect native pollinators while delivering untouched, NMR-tested raw honey to thousands of families.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xl">🌿</span>
              <h4 className="text-base font-black text-amber-950 mt-1">100% Ethical</h4>
              <p className="text-[11px] text-amber-800/80">Harm-free beekeeping</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xl">👨‍🌾</span>
              <h4 className="text-base font-black text-amber-950 mt-1">500+ Farmers</h4>
              <p className="text-[11px] text-amber-800/80">Tribal livelihood support</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xl">🔬</span>
              <h4 className="text-base font-black text-amber-950 mt-1">Ph.D. Founded</h4>
              <p className="text-[11px] text-amber-800/80">Entomology science base</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xl">🏺</span>
              <h4 className="text-base font-black text-amber-950 mt-1">Fast Growth</h4>
              <p className="text-[11px] text-amber-800/80">D2C direct farm-to-jar</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#openings"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 no-underline"
            >
              Explore Open Roles ↓
            </a>
            <button
              onClick={() => handleOpenApplyModal(null)}
              className="px-6 py-3 rounded-full bg-white/90 hover:bg-amber-100 text-amber-950 font-bold text-xs uppercase tracking-wider border border-amber-300 shadow-sm transition-all"
            >
              Submit Open CV / Resume
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. WHY WORK WITH AAI JI HONEY? (CULTURE & IMPACT) */}
      {/* ========================================================= */}
      <section className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
            Why Build Your Career in Our Hive?
          </h2>
          <p className="text-xs sm:text-sm text-amber-900/80 mt-2">
            We are not an ordinary corporation. We are an apiculture movement deeply rooted in Rajasthani soil, scientific rigor, and farmer dignity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CULTURE_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="honey-glass rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
            >
              <span className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {pillar.icon}
              </span>
              <h3 className="text-base font-bold text-amber-950 mt-4 font-heading">
                {pillar.title}
              </h3>
              <p className="text-xs text-amber-900/75 mt-2 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. OPEN POSITIONS & DEPARTMENT FILTER */}
      {/* ========================================================= */}
      <section id="openings" className="mb-16 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span>💼</span> Current Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
              Find Your Calling at Aai Ji Honey
            </h2>
            <p className="text-xs sm:text-sm text-amber-900/80 mt-1">
              Select a department below to view active career opportunities.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 flex-nowrap sm:flex-wrap">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 border border-amber-300/60'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="honey-glass rounded-3xl p-6 border border-amber-200 animate-pulse h-64">
                <div className="h-6 bg-amber-200/60 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-amber-200/40 rounded-md w-1/2 mb-6"></div>
                <div className="h-20 bg-amber-200/30 rounded-xl mb-4"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="honey-glass rounded-3xl p-10 text-center border border-amber-200/80 max-w-xl mx-auto">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-amber-950 mt-3 font-heading">
              No Openings in this Department Right Now
            </h3>
            <p className="text-xs text-amber-900/80 mt-1 mb-5">
              We frequently add seasonal apiary and marketing positions. Submit an open application and we will reach out when a role opens.
            </p>
            <button
              onClick={() => handleOpenApplyModal(null)}
              className="btn-honey-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Submit Open Application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="honey-glass rounded-3xl p-6 border border-amber-300/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-amber-400"
              >
                <div>
                  {/* Job Badges Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 text-[10px] font-black uppercase tracking-wider">
                      {job.employmentType || 'Full-Time'}
                    </span>
                    {job.salaryRange && (
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-950 text-[10px] font-black">
                        💰 {job.salaryRange}
                      </span>
                    )}
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-lg sm:text-xl font-black text-amber-950 font-heading group-hover:text-amber-800 transition-colors">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-amber-800/80 font-medium mt-1 mb-4">
                    <span className="flex items-center gap-1">
                      <span>📍</span> {job.location}
                    </span>
                    {job.experienceRequired && (
                      <span className="flex items-center gap-1">
                        <span>⏳</span> {job.experienceRequired} Exp.
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-amber-900/85 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  {/* Requirements Snippet */}
                  {job.requirements && (
                    <div className="p-3 rounded-xl bg-amber-100/50 border border-amber-200/60 text-[11px] text-amber-950 leading-relaxed mb-4">
                      <strong className="text-amber-900 block mb-1">Key Requirements:</strong>
                      {job.requirements}
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Reviewed by Dr. Neha Tomar (HR)
                  </span>
                  <button
                    onClick={() => handleOpenApplyModal(job)}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Application Banner */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-900 via-[#3a1503] to-[#250d02] text-amber-100 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              🌿 Passionate About Apiculture & Health?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-200 font-heading">
              Don't See Your Exact Role? Send an Open Application
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl">
              We are constantly expanding our Rajasthan apiaries, lab research, and D2C marketing operations. If you share our love for pure food and ethical apiculture, we would love to hear from you.
            </p>
          </div>
          <button
            onClick={() => handleOpenApplyModal(null)}
            className="px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/30 transition-all shrink-0 cursor-pointer"
          >
            Submit General Resume
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. APPLICATION MODAL / DRAWER */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-300 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-100 block">
                  Aai Ji Honey • Recruitment Application
                </span>
                <h3 className="text-lg font-black font-heading">
                  {selectedJob ? selectedJob.title : 'General / Open Career Application'}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
                aria-label="Close application modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {submittedApplication ? (
                /* Success Screen */
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto shadow-md">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-amber-950 font-heading">
                    Application Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/80 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{submittedApplication.name}</strong>. Your resume for{' '}
                    <strong>{submittedApplication.jobTitle}</strong> has been transmitted to Dr. Neha Tomar & our Apiculture Recruitment Team.
                  </p>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 max-w-sm mx-auto">
                    <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                      Application Tracking Code
                    </span>
                    <span className="text-base font-black text-amber-950 tracking-wider">
                      {submittedApplication.trackingId}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-700">
                    📧 An acknowledgment email has been sent to your inbox.
                  </p>

                  <div className="pt-4">
                    <button
                      onClick={handleCloseModal}
                      className="btn-honey-primary px-8 py-3 text-xs font-bold uppercase tracking-wider"
                    >
                      Close & Return to Website
                    </button>
                  </div>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Honeypot hidden input for anti-bot trap */}
                  <input
                    type="text"
                    name="website_url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                      Applying For Position <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedJob?._id || 'general'}
                      onChange={(e) => {
                        const j = jobs.find((item) => item._id === e.target.value);
                        setSelectedJob(j || null);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-xs text-amber-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="general">General / Open Application (All Departments)</option>
                      {jobs.map((j) => (
                        <option key={j._id} value={j._id}>
                          {j.title} ({j.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Mr. / Ms. Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                          Mobile / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-[11px] font-bold ${formData.mobile.replace(/\D/g, '').length === 10 ? 'text-emerald-700' : 'text-amber-800/70'}`}>
                          {formData.mobile.replace(/\D/g, '').length}/10 digits
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-800/80 pointer-events-none select-none">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          placeholder="9876543210"
                          value={formData.mobile}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({ ...formData, mobile: val });
                          }}
                          className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        Current City & State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Udaipur, Pali, Jaipur"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        Relevant Experience
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Fresh Graduate / Student">Fresh Graduate / Student</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                        LinkedIn / Portfolio URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Why Aai Ji Honey Statement */}
                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                      Why are you excited to join Aai Ji Honey?
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Briefly tell us about your background, passion for beekeeping/agriculture, or skills..."
                      value={formData.coverNote}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  {/* File Upload Box (Resume) */}
                  <div>
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                      Attach Resume / CV <span className="text-red-500">* (PDF or DOCX, max 5MB)</span>
                    </label>

                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                        resumeFile
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : fileError
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/50'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                        className="hidden"
                      />

                      {resumeFile ? (
                        <div className="flex items-center justify-between px-3">
                          <div className="flex items-center gap-2 text-left">
                            <span className="text-2xl">📄</span>
                            <div>
                              <p className="text-xs font-bold text-emerald-900 truncate max-w-[220px] sm:max-w-xs">
                                {resumeFile.name}
                              </p>
                              <p className="text-[10px] text-emerald-700">
                                {(resumeFile.size / 1024).toFixed(1)} KB • Ready to submit
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-white rounded-lg border border-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-3xl block mb-1">📎</span>
                          <p className="text-xs font-bold text-amber-950">
                            Click to upload or drag & drop your resume here
                          </p>
                          <p className="text-[11px] text-amber-700/80 mt-0.5">
                            Supported: PDF, DOCX, DOC (Up to 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    {fileError && <p className="text-[11px] text-red-600 font-bold mt-1">{fileError}</p>}
                  </div>

                  {/* Submission Notice */}
                  <div className="p-3 rounded-xl bg-amber-100/50 border border-amber-200 text-[11px] text-amber-900">
                    🔒 <strong>Privacy Assurance:</strong> Your contact details and resume are stored securely and reviewed exclusively by Dr. Neha Tomar and our hiring panel. We never share applicant data with third parties.
                  </div>

                  {/* Modal Footer Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="animate-spin text-sm">⏳</span>
                          <span>Uploading & Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <span>🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
