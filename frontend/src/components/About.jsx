// import ImageGallery from './ImageGallery'
// import HoneyBeeBackground from './HoneyBeeBackground'
// import { Link } from 'react-router-dom'

// const About = () => {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-white/80 to-orange-200 px-6 py-12 mt-[-30px] lg:py-20">
//       <HoneyBeeBackground />
//       <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
//         The name <strong className="text-amber-700">Aai Ji Honey</strong> is a tribute
//         to family — the warmth and care of a grandmother who nurtures the home and
//         preserves recipes and traditions. Combining that cultural warmth with modern
//         scientific practice, Dr. Seervi set out to create a brand that stands for
//         purity, farmer empowerment, and sustainability.
//       </p>


//       <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
//         Today, Aai Ji Honey is more than a product. It’s a movement: a
//         promise to deliver chemical-free honey, a platform to train and
//         support local farmers in beekeeping, and a commitment to protect
//         pollinators and biodiversity. Each jar carries a story — of the
//         land, the bees, and the hands that carefully tended them.
//       </p>

//       <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
//         Dr. Sitaram Seervi vision continues to inspire the team: to expand
//         farmer-friendly beekeeping practices, raise awareness about the
//         role of bees in food security, and ensure every household has
//         access to natural, wholesome honey. From humble beginnings to a
//         trusted name, Aai Ji Honey remains rooted in tradition while
//         guided by science — keeping the future sweet for generations to
//         come.
//       </p>

//       {/* Closing CTA */}
//       <section className="mt-12 bg-amber-600 text-white rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-4">
//         <div className='items-center'>
//           <h4 className="text-lg font-semibold">Taste the tradition</h4>
//           <p className="mt-1 text-sm opacity-90">Order a jar of Aai Ji Honey today.</p>
//         </div>
//         <div>
//           <Link to="/products" 
//             className="inline-block px-5 py-3 bg-white text-orange-700 rounded-full font-semibold shadow-sm hover:bg-orange-50"
//           >
//             Shop Honey
//           </Link>
//         </div>
//       </section>
//       <ImageGallery />
//     </main>
//   )
// }

// export default About


// import ImageGallery from './ImageGallery'
// import HoneyBeeBackground from './HoneyBeeBackground'
// import { Link } from 'react-router-dom'

// const About = () => {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
//       <HoneyBeeBackground />
      
//       {/* Header Section */}
//       <section className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
//         <h1 className="text-5xl font-bold text-amber-900 mb-4">Our Story</h1>
//         <p className="text-xl text-amber-700">From tradition to your table</p>
//         <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
//       </section>

//       {/* Story Cards */}
//       <section className="py-12 px-6">
//         <div className="max-w-5xl mx-auto space-y-8">
          
//           {/* Card 1 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-start gap-4">
//               <div className="text-5xl">👨‍👩‍👧‍👦</div>
//               <div>
//                 <h3 className="text-2xl font-bold text-amber-900 mb-3">A Tribute to Family</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   The name <strong className="text-amber-700">Aai Ji Honey</strong> is a tribute to family – the warmth and care of a grandmother who nurtures the home and preserves recipes and traditions. Combining that cultural warmth with modern scientific practice, Dr. Seervi set out to create a brand that stands for purity, farmer empowerment, and sustainability.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-start gap-4">
//               <div className="text-5xl">🐝</div>
//               <div>
//                 <h3 className="text-2xl font-bold text-amber-900 mb-3">More Than a Product</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   Today, Aai Ji Honey is more than a product. It's a movement: a promise to deliver chemical-free honey, a platform to train and support local farmers in beekeeping, and a commitment to protect pollinators and biodiversity. Each jar carries a story – of the land, the bees, and the hands that carefully tended them.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
//             <div className="flex items-start gap-4">
//               <div className="text-5xl">🌍</div>
//               <div>
//                 <h3 className="text-2xl font-bold text-amber-900 mb-3">Our Vision</h3>
//                 <p className="text-gray-700 leading-relaxed">
//                   Dr. Sitaram Seervi's vision continues to inspire the team: to expand farmer-friendly beekeeping practices, raise awareness about the role of bees in food security, and ensure every household has access to natural, wholesome honey. From humble beginnings to a trusted name, Aai Ji Honey remains rooted in tradition while guided by science – keeping the future sweet for generations to come.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 px-6 bg-gradient-to-r from-amber-100 to-yellow-100">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Our Impact</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             <div className="bg-white rounded-xl p-6 shadow-lg">
//               <p className="text-4xl font-bold text-amber-600">100%</p>
//               <p className="text-amber-900 font-semibold mt-2">Organic</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg">
//               <p className="text-4xl font-bold text-amber-600">500+</p>
//               <p className="text-amber-900 font-semibold mt-2">Farmers</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg">
//               <p className="text-4xl font-bold text-amber-600">0%</p>
//               <p className="text-amber-900 font-semibold mt-2">Chemicals</p>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-lg">
//               <p className="text-4xl font-bold text-amber-600">∞</p>
//               <p className="text-amber-900 font-semibold mt-2">Sustainability</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Gallery Section */}
//       <section className="py-12 px-6">
//         <ImageGallery />
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-6 pb-20">
//         <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-12 text-white text-center shadow-2xl">
//           <h3 className="text-3xl md:text-4xl font-bold mb-4">Taste the Tradition</h3>
//           <p className="text-lg mb-8 opacity-90">
//             Experience the pure goodness of Aai Ji Honey. Each jar tells a story of care, tradition, and sustainability.
//           </p>
//           <Link 
//             to="/products" 
//             className="inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg text-lg"
//           >
//             🛍️ Shop Honey
//           </Link>
//         </div>
//       </section>
//     </main>
//   )
// }

// export default About
import React, { useState, useEffect } from 'react'
import ImageGallery from './ImageGallery'
import HoneyBeeBackground from './HoneyBeeBackground'
import { Link } from 'react-router-dom'

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storyCards = [
    {
      id: 1,
      emoji: '👨‍👩‍👧‍👦',
      title: 'A Tribute to Family',
      description: 'The name Aai Ji Honey is a tribute to family – the warmth and care of a grandmother who nurtures the home and preserves recipes and traditions. Combining that cultural warmth with modern scientific practice, Dr. Seervi set out to create a brand that stands for purity, farmer empowerment, and sustainability.',
      borderColor: 'border-amber-500',
      bgGradient: 'from-amber-500 to-orange-400',
      icon: '❤️'
    },
    {
      id: 2,
      emoji: '🐝',
      title: 'More Than a Product',
      description: 'Today, Aai Ji Honey is more than a product. It\'s a movement: a promise to deliver chemical-free honey, a platform to train and support local farmers in beekeeping, and a commitment to protect pollinators and biodiversity. Each jar carries a story – of the land, the bees, and the hands that carefully tended them.',
      borderColor: 'border-orange-500',
      bgGradient: 'from-orange-500 to-yellow-400',
      icon: '🌟'
    },
    {
      id: 3,
      emoji: '🌍',
      title: 'Our Vision',
      description: 'Dr. Sitaram Seervi\'s vision continues to inspire the team: to expand farmer-friendly beekeeping practices, raise awareness about the role of bees in food security, and ensure every household has access to natural, wholesome honey. From humble beginnings to a trusted name, Aai Ji Honey remains rooted in tradition while guided by science – keeping the future sweet for generations to come.',
      borderColor: 'border-yellow-500',
      bgGradient: 'from-yellow-500 to-amber-400',
      icon: '🚀'
    }
  ];

  const impactStats = [
    { value: '100%', label: 'Organic', icon: '🌱', color: 'text-green-600' },
    { value: '500+', label: 'Farmers', icon: '👨‍🌾', color: 'text-amber-600' },
    { value: '0%', label: 'Chemicals', icon: '✅', color: 'text-blue-600' },
    { value: '∞', label: 'Sustainability', icon: '🌿', color: 'text-emerald-600' }
  ];

  const StoryCard = ({ card, index }) => {
    const isHovered = hoveredCard === card.id;
    const animationDelay = index * 150;

    return (
      <div
        className={`
          relative group bg-white rounded-3xl shadow-lg overflow-hidden
          border-l-4 ${card.borderColor}
          transition-all duration-500 ease-out
          ${isHovered ? 'shadow-2xl scale-105 -translate-y-3 translate-x-0' : 'hover:shadow-xl'}
          ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : 'opacity-0 translate-y-10'}
          transform backdrop-blur-sm
        `}
        style={{
          transitionDelay: isVisible ? `${animationDelay}ms` : '0ms'
        }}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Animated gradient bar */}
        <div className={`
          absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.bgGradient}
          transition-all duration-500
          ${isHovered ? 'h-2' : 'h-1'}
        `}></div>

        <div className="p-8 relative z-10">
          {/* Icon Container with animation */}
          <div className="flex items-center justify-between mb-6">
            <div className={`
              relative inline-flex items-center justify-center
              transition-all duration-500
              ${isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}
            `}>
              <div className={`
                absolute inset-0 rounded-full bg-gradient-to-r ${card.bgGradient}
                opacity-0 blur-lg transition-all duration-500
                ${isHovered ? 'opacity-40 scale-150' : 'opacity-0 scale-100'}
              `}></div>
              <span className="text-6xl relative z-10">{card.emoji}</span>
            </div>

            {/* Floating icon */}
            <div className={`
              text-3xl transition-all duration-500
              ${isHovered ? 'scale-110 animate-bounce' : 'scale-100'}
            `}>
              {card.icon}
            </div>
          </div>

          {/* Title with gradient */}
          <h3 className={`
            text-2xl md:text-3xl font-bold mb-4 transition-all duration-500
            ${isHovered 
              ? `text-transparent bg-clip-text bg-gradient-to-r ${card.bgGradient}` 
              : 'text-amber-900'
            }
          `}>
            {card.title}
          </h3>

          {/* Animated divider */}
          <div className={`
            h-0.5 bg-gradient-to-r ${card.bgGradient} rounded-full mb-4
            transition-all duration-500
            ${isHovered ? 'h-1 w-16 shadow-lg' : 'h-0.5 w-12'}
          `}></div>

          {/* Description */}
          <p className={`
            text-gray-700 leading-relaxed transition-all duration-500
            ${isHovered ? 'text-gray-900' : ''}
          `}>
            {card.description}
          </p>

          {/* Decorative corners */}
          <div className={`
            absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 rounded-tr-xl
            transition-all duration-500 opacity-0
            ${isHovered ? `opacity-100 border-amber-500` : 'opacity-0'}
          `}></div>
          <div className={`
            absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 rounded-bl-xl
            transition-all duration-500 opacity-0
            ${isHovered ? `opacity-100 border-amber-500` : 'opacity-0'}
          `}></div>
        </div>

        {/* Bottom glow */}
        <div className={`
          absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.bgGradient}
          transition-all duration-500
          ${isHovered ? 'h-2 shadow-lg' : 'h-1'}
        `}></div>
      </div>
    );
  };

  const ImpactCard = ({ stat, index }) => {
    const animationDelay = index * 100;

    return (
      <div
        className={`
          group relative bg-white rounded-2xl p-8 shadow-lg
          transition-all duration-500 ease-out
          hover:shadow-2xl hover:scale-110 hover:-translate-y-3
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          transform
        `}
        style={{
          transitionDelay: isVisible ? `${600 + animationDelay}ms` : '0ms'
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className={`
            text-6xl mb-3 transition-all duration-500
            ${stat.color} group-hover:scale-125
          `}>
            {stat.icon}
          </div>
          <p className={`
            text-4xl md:text-5xl font-bold transition-all duration-500
            ${stat.color} group-hover:drop-shadow-lg
          `}>
            {stat.value}
          </p>
          <p className="text-amber-900 font-semibold mt-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-500 transition-all duration-500">
            {stat.label}
          </p>
        </div>

        {/* Decorative ring on hover */}
        <div className={`
          absolute inset-0 rounded-2xl border-2 transition-all duration-500 opacity-0
          group-hover:opacity-100 border-${stat.color}
        `}></div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-br from-yellow-50 via-white to-orange-50 relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className={`
        fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
        z-50 transition-all duration-300
      `}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-10 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <HoneyBeeBackground />

      {/* Header Section */}
      <section className="relative z-10 pt-16 pb-12 px-6">
        <div className={`
          max-w-4xl mx-auto text-center transition-all duration-1000
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <div className="mb-6">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-800 font-semibold text-sm">
              ✨ Our Journey
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 mb-4 leading-tight">
            Our Story
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            From tradition to your table
          </p>

          {/* Animated divider */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></div>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full animate-pulse"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
          </div>

          <p className="text-gray-600 text-lg">
            Discover the heritage and values that drive our mission
          </p>
        </div>
      </section>

      {/* Story Cards Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {storyCards.map((card, idx) => (
              <StoryCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with enhanced styling */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className={`
            text-center mb-16 transition-all duration-1000
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
            style={{ transitionDelay: '400ms' }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 mb-4">
              Our Impact
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Making a difference in agriculture, sustainability, and livelihoods
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
              <ImpactCard key={idx} stat={stat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative z-10 py-20 px-6">
        <div className={`
          transition-all duration-1000
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
          style={{ transitionDelay: '1200ms' }}
        >
          <ImageGallery />
        </div>
      </section>

      {/* CTA Section with enhanced styling */}
      <section className={`
        relative z-10 py-20 px-6 pb-24 transition-all duration-1000
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
        style={{ transitionDelay: '1400ms' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className={`
            group relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600
            rounded-3xl p-12 md:p-16 text-white text-center
            shadow-2xl overflow-hidden
            transition-all duration-500 hover:shadow-3xl hover:-translate-y-3
          `}>
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Animated glow elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-6 text-5xl md:text-6xl animate-bounce transition-all duration-500 group-hover:scale-125">
                🍯
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Taste the Tradition
              </h3>

              <p className="text-lg md:text-xl mb-10 opacity-95 max-w-2xl mx-auto">
                Experience the pure goodness of Aai Ji Honey. Each jar tells a story of care, tradition, and sustainability.
              </p>

              <Link
                to="/products"
                className={`
                  inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-full
                  shadow-lg transition-all duration-500
                  hover:scale-110 hover:shadow-2xl active:scale-95
                  relative overflow-hidden group/btn
                  text-lg md:text-xl
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  🛍️ Shop Honey
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 skew-x-12"></div>
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-bounce" style={{ animationDelay: '0.2s' }}>🐝</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-bounce" style={{ animationDelay: '0.4s' }}>🌻</div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d97706, #f97316);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b45309, #ea580c);
        }
      `}</style>
    </div>
  )
}

export default About