import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from './components/ImageGallery';

const AnimatedBeesAroundJar = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-[380px] sm:h-[440px] flex items-center justify-center">
      {/* Radiant Honey Glow Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-amber-400/30 via-orange-400/25 to-yellow-300/35 rounded-full blur-3xl animate-nectar-glow"></div>
      </div>

      {/* Floating Honey Jar (LCP Element: Optimized with high fetchpriority and explicit aspect ratio) */}
      <div className="relative z-10 animate-honey-float">
        <img
          className="w-64 sm:w-80 md:w-96 drop-shadow-[0_25px_35px_rgba(180,83,9,0.3)] hover:scale-105 transition-transform duration-500 cursor-pointer object-contain aspect-square"
          src="/vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png"
          alt="Aai Ji Artisanal Raw Honey Jar"
          width="384"
          height="384"
          fetchpriority="high"
          decoding="async"
        />
      </div>

      {/* Flying Bee 1 - Orbiting Top-Right */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          top: '25px',
          right: '40px',
          animation: 'bee-orbit-1 7.5s linear infinite',
        }}
      >
        <img
          src="/vecteezy_bee-side-view-with_24589176.png"
          alt="Worker Bee"
          className="w-10 h-10 drop-shadow-md opacity-90"
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Flying Bee 2 - Orbiting Left */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          left: '20px',
          top: '160px',
          animation: 'bee-orbit-2 8.5s linear infinite',
        }}
      >
        <img
          src="/vecteezy_bee-side-view-with_24589176.png"
          alt="Worker Bee"
          className="w-11 h-11 drop-shadow-md opacity-90 scale-x-[-1]"
          width="44"
          height="44"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Flying Bee 3 - Orbiting Bottom-Right */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          bottom: '30px',
          right: '50px',
          animation: 'bee-orbit-3 8s linear infinite',
        }}
      >
        <img
          src="/vecteezy_bee-side-view-with_24589176.png"
          alt="Worker Bee"
          className="w-10 h-10 drop-shadow-md opacity-90"
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { value: '10,000+', label: 'Happy Families', icon: '💛' },
    { value: '500+', label: 'Tribal Beekeepers', icon: '👨‍🌾' },
    { value: '100%', label: 'Raw & NMR Tested', icon: '🔬' },
    { value: '0%', label: 'Added Sugars', icon: '🚫' },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Wild Native Flora',
      desc: 'Bees forage across Rajasthan mustard fields, desert wildwoods, and ajwain blooms.',
      icon: '🌸',
      tag: 'Pollination',
    },
    {
      num: '02',
      title: 'Hive Capping',
      desc: 'Bees naturally seal honeycombs with pure wax once moisture levels fall below 18%.',
      icon: '🐝',
      tag: 'Ripening',
    },
    {
      num: '03',
      title: 'Cold Centrifuge Extraction',
      desc: 'Gently spun without boiling or pasteurization, preserving natural pollen and enzymes.',
      icon: '🏺',
      tag: 'Preservation',
    },
    {
      num: '04',
      title: 'Glass Jar Bottling',
      desc: 'Hand-poured into UV-shielded food grade glass jars and delivered straight to your door.',
      icon: '📦',
      tag: 'Fresh Purity',
    },
  ];

  const comparison = [
    {
      feature: 'Processing Method',
      aaiJi: 'Raw, unheated, cold-extracted by hand',
      commercial: 'Ultra-heated to 70°C+ destroying live enzymes',
    },
    {
      feature: 'Bee Pollen Content',
      aaiJi: 'Retained 100% natural beneficial pollen',
      commercial: 'Micro-filtered to remove traces and origin markers',
    },
    {
      feature: 'Sweeteners / Syrups',
      aaiJi: 'Zero adulteration (100% pure flower nectar)',
      commercial: 'Often diluted with C3/C4 inverted rice/sugar syrups',
    },
    {
      feature: 'Aroma & Taste',
      aaiJi: 'Distinct seasonal floral bouquet and rich mouthfeel',
      commercial: 'Uniform flat sugary taste with added aromas',
    },
    {
      feature: 'Crystallization',
      aaiJi: 'Naturally crystallizes over time (hallmark of raw honey)',
      commercial: 'Chemically prevented from crystallizing',
    },
  ];

  const reviews = [
    {
      name: 'Pooja Rathore',
      location: 'Jaipur, Rajasthan',
      text: 'The floral aroma upon opening the jar is unlike any supermarket honey. Thick, raw, and my kids love it in their morning warm milk!',
      rating: 5,
      product: 'Mustard Blossom Raw Honey',
    },
    {
      name: 'Vikramaditya Singh',
      location: 'New Delhi',
      text: 'Knowing this is directly supported by entomology researcher Dr. Seervi gives me 100% confidence in its purity. Real raw honey is irreplaceable.',
      rating: 5,
      product: 'Wild Flora Multi-Flora Honey',
    },
    {
      name: 'Ananya Sharma',
      location: 'Udaipur',
      text: 'Fast express delivery and beautifully packed in sustainable glass jars. The mild crystallization proves its genuine raw harvest!',
      rating: 5,
      product: 'Ajwain Herbal Honey',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes bee-orbit-1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -20px) rotate(15deg); }
          50% { transform: translate(-10px, -35px) rotate(-10deg); }
          75% { transform: translate(-25px, -10px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes bee-orbit-2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-20px, 25px) rotate(-15deg); }
          60% { transform: translate(25px, 15px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes bee-orbit-3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          40% { transform: translate(20px, -25px) rotate(20deg); }
          70% { transform: translate(-15px, 10px) rotate(-10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>

      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Purity Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full honey-glass border border-amber-300 shadow-sm">
                <span className="text-base animate-pulse">🍯</span>
                <span className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wide">
                  100% Pure • Raw • Rajasthan Hives
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-amber-950 leading-[1.08] tracking-tight">
                Nature's Golden Nectar, <br className="hidden sm:inline" />
                <span className="honey-gradient-text">Pure & Unfiltered.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg md:text-xl text-amber-900/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Harvested by hand using ethical, bee-friendly apiculture in the pristine landscapes of Rajasthan. No boiling, no adulteration — just wholesome, unpasteurized honey full of natural enzymes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="btn-honey-primary w-full sm:w-auto px-8 py-4 text-base font-extrabold flex items-center justify-center gap-2.5 shadow-xl shadow-amber-600/25 no-underline"
                >
                  <span>🛍️</span>
                  <span>Explore Fresh Harvest</span>
                  <span>→</span>
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto px-7 py-4 rounded-full honey-glass hover:bg-white text-amber-950 font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 border border-amber-300/80 shadow-md no-underline"
                >
                  <span>🐝</span>
                  <span>Our Beekeeping Story</span>
                </Link>
              </div>

              {/* Quick Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-amber-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 text-sm">✓</span> NMR Purity Tested
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 text-sm">✓</span> Zero Sugar Syrups
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-600 text-sm">✓</span> Free Express Shipping
                </div>
              </div>
            </div>

            {/* Right Visual Column: Floating Jar */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <AnimatedBeesAroundJar />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. STATS BANNER */}
      {/* ========================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xl shadow-amber-900/5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-2xl block mb-1">{stat.icon}</span>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-950 font-heading">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-amber-700 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FROM BLOSSOM TO BOTTLE (THE PROCESS) */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold uppercase tracking-widest inline-block">
              Artisanal Method
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight">
              From Desert Flora to Your Table
            </h2>
            <p className="text-amber-900/80 text-sm sm:text-base leading-relaxed">
              We reject industrial high-heat pasteurization and micro-filtration. Here is how our honey arrives at your table exactly as the bees prepared it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="honey-glass honey-glass-hover rounded-3xl p-7 relative flex flex-col justify-between overflow-hidden group"
              >
                <div className="absolute top-4 right-4 text-3xl font-black text-amber-200/60 group-hover:text-amber-300/80 transition-colors">
                  {step.num}
                </div>

                <div className="space-y-4">
                  <span className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-orange-400/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                      {step.tag}
                    </span>
                    <h3 className="text-xl font-bold text-amber-950 font-heading">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Traditional Integrity</span>
                  <span>🌿</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. REAL HONEY VS COMMERCIAL HONEY COMPARISON */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-amber-50/50">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-4 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold uppercase tracking-wider inline-block">
              Know Your Food
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight">
              Why Raw Honey Matters
            </h2>
            <p className="text-amber-900/80 text-sm">
              See the stark difference between genuine unheated apiculture honey and factory-processed honey syrups.
            </p>
          </div>

          <div className="honey-glass rounded-3xl overflow-hidden shadow-2xl border border-amber-200/80">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-amber-200/80">
              
              {/* Feature Labels & Aai Ji Honey (Left) */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6 bg-white/60">
                <div className="flex items-center gap-3 pb-4 border-b border-amber-200/80">
                  <span className="text-3xl">🍯</span>
                  <div>
                    <h3 className="text-xl font-black text-amber-950 font-heading">
                      Aai Ji Raw Honey
                    </h3>
                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wide">
                      100% Native Rajasthan Apiaries
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {comparison.map((row, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60">
                      <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
                        {row.feature}
                      </div>
                      <div className="text-sm font-semibold text-amber-950 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{row.aaiJi}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Processed Honey (Right) */}
              <div className="md:col-span-5 p-6 sm:p-8 space-y-6 bg-gray-50/60">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <span className="text-3xl">🏭</span>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 font-heading">
                      Industrial Honey
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                      High-heat processed factory syrups
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {comparison.map((row, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        {row.feature}
                      </div>
                      <div className="text-xs font-medium text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 font-bold">✗</span>
                        <span>{row.commercial}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. PHOTO GALLERY OF RAJASTHAN APIARIES */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ImageGallery />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. REAL CUSTOMER REVIEWS */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/60 to-orange-50/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold uppercase tracking-widest inline-block">
              Loved by Honey Lovers
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 tracking-tight">
              Words From Our Community
            </h2>
            <p className="text-amber-900/80 text-sm">
              Discover what families across India have to say about the pure taste of Aai Ji Honey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="honey-glass honey-glass-hover rounded-3xl p-8 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 text-lg">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="text-sm text-amber-950 font-medium leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">{rev.name}</h4>
                    <p className="text-xs text-amber-700">{rev.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[10px] font-bold text-amber-800">
                    Verified Buyer ✓
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. BOTTOM INVITATION BANNER */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 p-8 sm:p-12 md:p-16 text-white text-center shadow-2xl shadow-orange-900/20">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="text-4xl block animate-bounce">🍯</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight">
                Experience Pure, Living Honey Today.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-amber-100 font-medium leading-relaxed">
                Directly from the hives in Rajasthan to your doorstep. Unheated, raw, and bottled with the love of our Aai Ji.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-amber-50 text-amber-950 font-black rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 no-underline flex items-center justify-center gap-2 text-base"
                >
                  <span>🛒</span>
                  <span>Order Raw Honey Now</span>
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-7 py-4 bg-black/20 hover:bg-black/30 border border-white/40 text-white font-bold rounded-full transition-all duration-300 no-underline text-base"
                >
                  Contact Our Apiary Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
