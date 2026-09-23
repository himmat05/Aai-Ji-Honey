import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { teamApi } from '../../../api/teamApi';
import { compressImage } from '../../../utils/imageCompressor';

const PRESET_BADGES = [
  'ENTOMOLOGIST',
  'APICULTURE SPECIALIST',
  'AGRI-BUSINESS',
  'SUPPLY CHAIN',
  'FINANCE & AUDIT',
  'QUALITY ASSURANCE',
  'FIELD RESEARCHER',
];

const TeamManagementSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [badge, setBadge] = useState('');
  const [customBadge, setCustomBadge] = useState('');
  const [expertise, setExpertise] = useState('');
  const [email, setEmail] = useState('');
  const [orderNum, setOrderNum] = useState(0);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(false);

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getTeamMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to load team members:', err);
      toast.error('Could not load scientists & team from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Portrait image size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setBadge('');
    setCustomBadge('');
    setExpertise('');
    setEmail('');
    setOrderNum(members.length + 1);
    setImageFile(null);
    setImagePreview('');
    setDirectUrl('');
    setUseUrlInput(false);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (member) => {
    setEditId(member._id);
    setName(member.name || '');
    setRole(member.role || '');
    setExpertise(member.expertise || '');
    setEmail(member.email || '');
    setOrderNum(member.orderNum !== undefined ? member.orderNum : (member.order_num || 0));

    const itemBadge = member.badge || '';
    if (PRESET_BADGES.includes(itemBadge)) {
      setBadge(itemBadge);
      setCustomBadge('');
    } else if (itemBadge) {
      setBadge('Other');
      setCustomBadge(itemBadge);
    } else {
      setBadge('');
      setCustomBadge('');
    }

    setImageFile(null);
    setImagePreview(member.image || '');
    setDirectUrl(member.image || '');
    setUseUrlInput(false);

    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id, memberName) => {
    if (!window.confirm(`Are you sure you want to remove "${memberName || 'this team member'}" from the team?`)) {
      return;
    }

    try {
      await teamApi.deleteTeamMember(id);
      toast.success('Team member removed successfully');
      setMembers((prev) => prev.filter((m) => m._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.error || 'Failed to remove team member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter the team member name.');
      return;
    }
    if (!role.trim()) {
      toast.error('Please enter the role/designation.');
      return;
    }
    if (!expertise.trim()) {
      toast.error('Please enter the research focus or expertise details.');
      return;
    }

    const resolvedBadge = badge === 'Other' ? customBadge.trim() : (badge || customBadge.trim() || 'TEAM');
    const resolvedImage = useUrlInput ? directUrl.trim() : null;

    if (!editId && !imageFile && !resolvedImage) {
      toast.error('Please select a portrait image from your device or provide an image URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('role', role.trim());
      formData.append('badge', resolvedBadge);
      formData.append('expertise', expertise.trim());
      formData.append('email', email.trim());
      formData.append('orderNum', orderNum);

      if (imageFile) {
        const compressed = await compressImage(imageFile, 1200, 0.82);
        formData.append('image', compressed);
      } else if (resolvedImage) {
        formData.append('image', resolvedImage);
      }

      if (editId) {
        const updated = await teamApi.updateTeamMember(editId, formData);
        setMembers((prev) => prev.map((m) => (m._id === editId ? updated : m)));
        toast.success('✅ Scientist / Team member updated successfully!');
      } else {
        const created = await teamApi.addTeamMember(formData);
        setMembers((prev) => [created, ...prev]);
        toast.success('✅ Scientist / Team member added successfully!');
      }

      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.error || 'Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Header Info */}
      <div ref={formTopRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <span>👥</span> Scientists & Team Manager
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
            {editId ? '✏️ Edit Scientist / Team Member' : '👥 Add New Scientist / Team Member'}
          </h2>
          <p className="text-amber-800 text-xs sm:text-sm mt-1">
            Manage the leadership and entomologists displayed on the Contact page. Upload portraits from your device.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="honey-glass px-4 py-2 rounded-2xl border border-amber-300 text-xs font-black text-amber-950">
            {members.length} Scientists & Team Members
          </span>
          {editId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Portrait Upload & Preview Box */}
            <div className="lg:col-span-1 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-amber-950 text-center sm:text-left">
                Portrait Photo *
              </label>

              {/* Circular preview box matching contact page aesthetic */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center min-h-[220px]">
                {imagePreview ? (
                  <div className="text-center space-y-3">
                    <div className="relative w-28 h-28 mx-auto">
                      <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-full blur opacity-50"></div>
                      <img
                        src={imagePreview}
                        alt="Portrait Preview"
                        className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow transition"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setDirectUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-1 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold shadow transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-center p-4 hover:scale-102 transition"
                  >
                    <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center mx-auto mb-2 text-2xl">
                      👤
                    </div>
                    <p className="text-xs font-bold text-amber-950">Click to upload portrait</p>
                    <p className="text-[11px] text-amber-700/80 mt-0.5">JPEG, PNG, WebP up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Toggle direct URL input */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  Choose Local File
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrlInput(!useUrlInput)}
                  className="text-amber-700 hover:text-amber-900 font-medium"
                >
                  {useUrlInput ? 'Hide URL input' : 'Or paste Portrait URL'}
                </button>
              </div>

              {useUrlInput && (
                <input
                  type="text"
                  placeholder="https://... or /image.jpg"
                  value={directUrl}
                  onChange={(e) => {
                    setDirectUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-950"
                />
              )}
            </div>

            {/* Right: Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Full Name & Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Sitaram Seervi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-amber-950 placeholder-amber-700/40"
                    required
                  />
                </div>

                {/* Role / Designation */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Founder & Head of Apiculture"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-amber-950 placeholder-amber-700/40"
                    required
                  />
                </div>
              </div>

              {/* Department / Badge Tag & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Department / Specialty Badge *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950"
                    >
                      <option value="">-- Select Badge --</option>
                      {PRESET_BADGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="Other">Custom Badge...</option>
                    </select>

                    {badge === 'Other' ? (
                      <input
                        type="text"
                        placeholder="e.g., BIO-CHEMIST"
                        value={customBadge}
                        onChange={(e) => setCustomBadge(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950 uppercase"
                      />
                    ) : (
                      <div className="flex items-center px-3 py-2 rounded-2xl bg-amber-100/70 border border-amber-200 text-[11px] font-black text-amber-900">
                        Badge: {badge || 'Select from dropdown'}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1, 2, 3..."
                    value={orderNum}
                    onChange={(e) => setOrderNum(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g., aaijihoney24@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold text-amber-950 placeholder-amber-700/40"
                />
              </div>

              {/* Research Focus / Expertise */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                  Research Focus / Expertise Details *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g., Ph.D. in Entomology, Apiculture & Pollination Ecology Expert..."
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-amber-950 placeholder-amber-700/40"
                  required
                ></textarea>
              </div>

              {/* Submit / Reset Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? '⏳ Saving...' : editId ? '💾 Update Member' : '👥 Add Team Member'}</span>
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Existing Team Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-amber-950 font-heading">
            Current Scientists & Leadership Team ({members.length})
          </h3>
          <button
            onClick={fetchMembers}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
          >
            <span>🔄</span> Refresh List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 honey-glass rounded-3xl border border-amber-200">
            <span className="text-3xl block animate-bounce mb-2">👥</span>
            <p className="text-sm font-bold text-amber-950">Loading team members from database...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 honey-glass rounded-3xl border border-amber-200">
            <span className="text-3xl block mb-2">🧑‍🔬</span>
            <p className="text-sm font-bold text-amber-950">No scientists or team members found.</p>
            <p className="text-xs text-amber-700 mt-1">Use the form above to add your first team member!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member._id}
                className="honey-glass rounded-3xl p-6 border border-amber-200/80 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                {/* Admin Quick Action Floating Buttons */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs shadow transition-transform hover:scale-105"
                    title="Edit Member"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(member._id, member.name)}
                    className="p-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs shadow transition-transform hover:scale-105"
                    title="Remove Member"
                  >
                    🗑️
                  </button>
                </div>

                <div className="space-y-4 text-center pt-2">
                  {/* Portrait with Golden Border Glow */}
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-full blur opacity-40 group-hover:opacity-75 transition"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                    />
                  </div>

                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[10px] font-black text-amber-800 uppercase tracking-widest inline-block mb-1.5 border border-amber-300/60">
                      {member.badge || 'LEADERSHIP'}
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

                {/* Reachout email & Order info */}
                <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-600 transition-colors truncate max-w-[200px]"
                    >
                      <span>✉️</span>
                      <span className="truncate">{member.email}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-amber-600">No email listed</span>
                  )}

                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Order #{member.orderNum !== undefined ? member.orderNum : (member.order_num || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagementSection;
