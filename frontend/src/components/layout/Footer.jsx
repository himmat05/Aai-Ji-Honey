import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const trustBadges = [
    { icon: '🌿', title: '100% Raw & Pure', desc: 'No added sugar or artificial heating' },
    { icon: '🐝', title: 'Ethical Beekeeping', desc: 'Harming zero bees, preserving flora' },
    { icon: '🔬', title: 'Lab NMR Tested', desc: 'Verified chemical & pesticide free' },
    { icon: '🏺', title: 'Glass Jar Bottled', desc: 'Maintains freshness and enzymes' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-b from-amber-950 via-[#3a1503] to-[#250d02] text-amber-100 border-t-4 border-amber-500 shadow-2xl">
      {/* Decorative Glow Ambient Layer */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Trust Badges Strip */}
      <div className="border-b border-amber-900/60 bg-black/20 backdrop-blur-sm py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3.5 group">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-amber-500/25 transition-all duration-300">
                {badge.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold text-amber-200">{badge.title}</h4>
                <p className="text-xs text-amber-300/70">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Origin Story */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img
                src="/favicon.ico"
                alt="Aai Ji Honey Logo"
                className="w-12 h-12 p-1.5 rounded-full bg-amber-50 border border-amber-400/50 shadow"
              />
              <div>
                <h3 className="text-xl font-black text-amber-300 font-heading">
                  Aai Ji Honey
                </h3>
                <p className="text-xs text-amber-400/80 font-medium">Pure • Raw • Organic</p>
              </div>
            </Link>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Named in honour of the loving warmth of a grandmother (Aai Ji), bringing authentic, raw, unheated honey directly from Rajasthan's natural hives to your family dining table.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-400">
              📍 Marwar Apiary Division, Rajasthan, India
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 pb-1 border-b border-amber-800/80 inline-block font-heading">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs text-amber-200/80">
              <li>
                <Link to="/products" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 no-underline">
                  <span>🍯</span> <span>Raw Honey Collection</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 no-underline">
                  <span>🐝</span> <span>Our Apiculture Story</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 no-underline">
                  <span>👨‍🔬</span> <span>Our Scientists & Founders</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 no-underline">
                  <span>🔐</span> <span>Customer / Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Help */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 pb-1 border-b border-amber-800/80 inline-block font-heading">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-amber-200/80">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:aaijihoney24@gmail.com" className="hover:text-amber-300 transition-colors">
                  aaijihoney24@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>Direct Hive Helpline: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🚚</span>
                <span>Nationwide Express Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💳</span>
                <span>Secure Razorpay & UPI Payments</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Community & Heritage Note */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 pb-1 border-b border-amber-800/80 inline-block font-heading">
              Follow Our Hive
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Watch our live beekeeping videos, harvesting sessions, and nutritional tips.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/share/186fGU4Yb6/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow"
                title="Follow us on Facebook"
              >
                <img
                  src="/vecteezy_facebook-logo-png-facebook-icon-transparent-white-background_41643208.png"
                  alt="Facebook"
                  className="w-5 h-5 object-contain"
                />
              </a>
              <a
                href="https://www.instagram.com/aaijihoney24?utm_source=ig_web_button_share_sheet&igsh=Z25laGJnYmJoaWVq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow"
                title="Follow us on Instagram"
              >
                <img
                  src="/Instagram_icon.png"
                  alt="Instagram"
                  className="w-5 h-5 object-contain"
                />
              </a>
              <a
                href="https://youtu.be/tDlWHE-kL7w?si=rR2utLe3EJ5QQlbN"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-500 hover:scale-110 flex items-center justify-center transition-all duration-300 shadow"
                title="Watch us on YouTube"
              >
                <img
                  src="/vecteezy_youtube-logo-png-youtube-logo-transparent-png-youtube-icon_23986480.png"
                  alt="YouTube"
                  className="w-5 h-5 object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Traditional Hindi Quote Banner */}
        <div className="mt-12 p-4 rounded-2xl bg-amber-900/40 border border-amber-700/50 text-center">
          <p className="text-amber-200 text-sm md:text-base font-semibold tracking-wide">
            "प्राकृतिक मिठास का असली स्वाद – सीधे छत्ते से आपके घर तक। भरोसे और परंपरा का मीठा स्वाद।" 🍯✨
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-amber-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-300/70 gap-4">
          <p>© {currentYear} Aai Ji Honey (Dr. Sitaram Seervi Apiculture Initiatives). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Handcrafted with 🐝 for nature & health</span>
            <span>•</span>
            <span>100% Chemical Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
