import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { messageApi } from '../../api/messageApi';
import { teamApi } from '../../api/teamApi';

const DEFAULT_TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Dr. Sitaram Seervi',
    role: 'Founder & Head of Apiculture',
    badge: 'ENTOMOLOGIST',
    image: '/Aai-ji-Honey-Founder.jpg',
    expertise: 'Ph.D. in Entomology, Apiculture & Pollination Ecology Expert',
    email: 'aaijihoney24@gmail.com',
  },
  {
    id: 2,
    name: 'Dr. Naveen Jangir',
    role: 'Chief Executive Officer (CEO)',
    badge: 'APICULTURE SPECIALIST',
    image: '/Aai-ji-Honey-CEO.jpg',
    expertise: 'Ph.D. in Entomology, Apiculture Specialist with 6+ Years Experience',
    email: 'jangir000naveen@gmail.com',
  },
  {
    id: 3,
    name: 'Dr. Neha Tomar',
    role: 'Director - Human Resources & Outreach',
    badge: 'AGRI-BUSINESS',
    image: '/Aai-ji-Honey-HR.jpg',
    expertise: 'Agriculture Business Management (ABM) & Tribal Community Training',
    email: 'nehatomar5557@gmail.com',
  },
  {
    id: 4,
    name: 'Mr. Bhanwar Lal Bhayal',
    role: 'General Manager (Operations)',
    badge: 'SUPPLY CHAIN',
    image: '/Aai-ji-Honey-General-manager.jpg',
    expertise: 'M.Com, Cold Supply Chain & Hive Quality Logistics',
    email: 'pipliahiran@gmail.com',
  },
  {
    id: 5,
    name: 'Mr. Sobha Lal',
    role: 'Head of Accounts & Finance',
    badge: 'FINANCE & AUDIT',
    image: '/Aai-ji-Honey-Account.jpg',
    expertise: 'Accounting & Tax Consultant, Financial Compliance & Sustainability',
    email: 'truebaladvisors@gmail.com',
  },
];

const ContactPage = () => {
  const { user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [teamMembers, setTeamMembers] = useState(DEFAULT_TEAM_MEMBERS);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || '',
    subject: 'Raw Honey Inquiry',
    message: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    teamApi
      .getTeamMembers()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTeamMembers(data);
        }
      })
      .catch((err) => {
        console.warn('⚠️ Could not load remote team members, using defaults:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.mobile || '',
      }));
    }
  }, [user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please complete your name, email, and inquiry message.');
      return;
    }

    try {
      setSending(true);
      const res = await messageApi.sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.phone.trim(),
        subject: form.subject || 'Raw Honey Inquiry',
        message: form.message.trim(),
      });

      toast.success(res.message || '🎉 Thank you! Your message has been sent to our Apiary Team.');
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        subject: 'Raw Honey Inquiry',
        message: '',
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full honey-glass border border-amber-300 shadow-sm">
            <span className="text-sm">📍</span>
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Rajasthan Apiculture Division
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight font-heading">
            Connect With Our <br />
            <span className="honey-gradient-text">Beekeepers & Scientists</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-amber-900/80 leading-relaxed font-medium">
            Have questions about our raw honey harvest, bulk requirements, or wish to visit our desert hives? Our entomology & apiary team is here to assist.
          </p>
        </div>

        {/* Quick Contact Info Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="honey-glass honey-glass-hover rounded-3xl p-6 text-center border border-amber-200/80 shadow-md">
            <span className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-4">
              📞
            </span>
            <h3 className="text-base font-bold text-amber-950 font-heading">Helpline / WhatsApp</h3>
            <p className="text-xs text-amber-700 mt-1 mb-2 font-medium">Direct Apiary Assistance</p>
            <a
              href="tel:+919876543210"
              className="text-sm font-black text-amber-900 hover:text-amber-600 transition-colors"
            >
              +91 98765 43210
            </a>
          </div>

          <div className="honey-glass honey-glass-hover rounded-3xl p-6 text-center border border-amber-200/80 shadow-md">
            <span className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-4">
              ✉️
            </span>
            <h3 className="text-base font-bold text-amber-950 font-heading">Official Email</h3>
            <p className="text-xs text-amber-700 mt-1 mb-2 font-medium">Orders & Quality Research</p>
            <a
              href="mailto:aaijihoney24@gmail.com"
              className="text-sm font-black text-amber-900 hover:text-amber-600 transition-colors"
            >
              aaijihoney24@gmail.com
            </a>
          </div>

          <div className="honey-glass honey-glass-hover rounded-3xl p-6 text-center border border-amber-200/80 shadow-md">
            <span className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-4">
              📍
            </span>
            <h3 className="text-base font-bold text-amber-950 font-heading">Apiary Headquarters</h3>
            <p className="text-xs text-amber-700 mt-1 mb-2 font-medium">Marwar Apiary Division</p>
            <span className="text-xs font-bold text-amber-950">
              Pali / Jodhpur, Rajasthan, India
            </span>
          </div>
        </div>

        {/* Team Leadership Grid */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold uppercase tracking-wider inline-block">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
              Our Scientists & Team
            </h2>
            <p className="text-sm text-amber-900/80">
              Dedicated professionals committed to chemical-free apiculture and farmer empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => {
              const memberId = member._id || member.id;
              const isHovered = hoveredCard === memberId;
              return (
                <div
                  key={memberId}
                  onMouseEnter={() => setHoveredCard(memberId)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="honey-glass honey-glass-hover rounded-3xl p-6 border border-amber-200/80 shadow-lg flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-4 text-center">
                    {/* Portrait Image with Golden Border */}
                    <div className="relative w-28 h-28 mx-auto">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-full blur opacity-40 group-hover:opacity-75 transition"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                      />
                    </div>

                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[10px] font-black text-amber-800 uppercase tracking-widest inline-block mb-1.5">
                        {member.badge}
                      </span>
                      <h3 className="text-xl font-black text-amber-950 font-heading">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-700 mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-left">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <strong className="text-amber-950 font-bold block mb-1">
                          Research Focus:
                        </strong>
                        {member.expertise}
                      </p>
                    </div>
                  </div>

                  {/* Reachout link */}
                  <div className="mt-5 pt-3 border-t border-amber-100 text-center">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-600 transition-colors"
                    >
                      <span>✉️</span>
                      <span>{member.email}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Contact & Inquiry Form */}
        <div className="max-w-3xl mx-auto">
          <div className="honey-glass rounded-3xl p-8 sm:p-12 border border-amber-200 shadow-2xl relative">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="text-3xl block">💌</span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
                Send Us a Direct Message
              </h2>
              <p className="text-xs sm:text-sm text-amber-900/80">
                Inquire about bulk orders, bee farm training, or honey testing reports.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                  >
                    <option value="Raw Honey Inquiry">Raw Honey Inquiry</option>
                    <option value="Bulk / Wholesale Order">Bulk / Wholesale Order</option>
                    <option value="Beekeeping Farm Visit">Beekeeping Farm Visit</option>
                    <option value="Farmer Training Initiative">Farmer Training Initiative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Message / Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with our natural honey harvest?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-honey-primary w-full py-3.5 text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  '📤 Send Inquiry to Apiary'
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
