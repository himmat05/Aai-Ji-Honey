import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from '../Home/components/ImageGallery';

const AboutPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const storyCards = [
    {
      id: 1,
      emoji: '👵',
      tag: 'HERITAGE & LOVE',
      title: 'A Tribute to Aai Ji',
      description:
        'The name "Aai Ji Honey" is an affectionate tribute to our grandmother (Aai Ji) — the bedrock of our home who preserved traditional Ayurvedic wisdom, medicinal herbs, and pure, unprocessed kitchen recipes. We carry forward her sacred belief that food in its purest state is the greatest medicine.',
      icon: '💛',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      id: 2,
      emoji: '👨‍🔬',
      tag: 'ENTOMOLOGY & SCIENCE',
      title: 'Apiculture Guided by Science',
      description:
        'Founded by Dr. Sitaram Seervi (Ph.D. in Entomology, specializing in honeybees and pollination ecology), our apiary practices blend centuries-old desert apiculture with modern scientific rigor. Every honeycomb is monitored for natural maturity, ensuring our harvest retains vital enzymes, diastase, and beneficial flavonoids.',
      icon: '🔬',
      gradient: 'from-amber-600 to-yellow-500',
    },
    {
      id: 3,
      emoji: '🌾',
      tag: 'FARMER EMPOWERMENT',
      title: 'Protecting Rajasthan Pollinators',
      description:
        'Aai Ji Honey is more than a wellness product — it is an ecological movement. We train and support over 500 rural Rajasthani farmers in ethical, non-destructive beekeeping. By placing hives across mustard, ajwain, and wild acacia fields, we enhance crop yields through pollination while protecting endangered bee colonies.',
      icon: '🐝',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  const impactStats = [
    { value: '100%', label: 'Raw & Natural', icon: '🌿', desc: 'No artificial heating or syrups' },
    { value: '500+', label: 'Tribal Beekeepers', icon: '👨‍🌾', desc: 'Empowered across Rajasthan' },
    { value: '10K+', label: 'Happy Families', icon: '✨', desc: 'Savoring authentic purity' },
    { value: '0%', label: 'Pesticides', icon: '🛡️', desc: 'NMR lab verified chemical-free' },
  ];

  return (
    <div className="relative overflow-hidden pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full honey-glass border border-amber-300 shadow-sm">
            <span className="text-sm">✨</span>
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Our Heritage & Apiculture Roots
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight font-heading">
            Rooted in Tradition, <br />
            <span className="honey-gradient-text">Guided by Science.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-amber-900/80 leading-relaxed font-medium">
            Discover the story of love, grandmother's care, and entomological research behind every drop of Aai Ji Honey.
          </p>
        </div>

        {/* Story Cards Section */}
        <div className="max-w-5xl mx-auto space-y-8">
          {storyCards.map((card) => {
            const isHovered = hoveredCard === card.id;
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="honey-glass honey-glass-hover rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-xl relative overflow-hidden transition-all duration-300"
              >
                {/* Accent Top Border */}
                <div
                  className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${card.gradient}`}
                ></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-2 flex justify-center md:justify-start">
                    <span className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-300/80 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                      {card.emoji}
                    </span>
                  </div>

                  <div className="md:col-span-10 space-y-2">
                    <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest">
                      {card.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
                      {card.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Stats */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="px-4 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider inline-block mb-2">
              Measurable Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
              Our Commitment in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className="honey-glass honey-glass-hover rounded-3xl p-6 text-center border border-amber-200 shadow-md"
              >
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
                  {stat.value}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider mt-1">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-gray-600 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="max-w-7xl mx-auto">
          <ImageGallery />
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white text-center shadow-2xl space-y-6">
            <span className="text-4xl block">🍯</span>
            <h3 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
              Taste the True Rajasthan Harvest
            </h3>
            <p className="text-sm sm:text-base text-amber-100 max-w-xl mx-auto leading-relaxed">
              Order a jar of our living, raw honey today and bring authentic wellness and purity to your home.
            </p>
            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-amber-950 font-black rounded-full shadow-lg hover:shadow-2xl hover:bg-amber-50 transition-all duration-300 no-underline text-base"
              >
                <span>🛒</span>
                <span>Explore Products</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
