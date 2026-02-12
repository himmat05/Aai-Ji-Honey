// import { Link } from 'react-router-dom'
// import HoneyBeeBackground from './HoneyBeeBackground';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80 mt-[-25px]">
//       <HoneyBeeBackground />
//       <div className="font-sans text-gray-800 mt-[-10px]">
//         <section className="relative flex items-center justify-center text-center">
//           <div className="relative z-10 max-w-2xl p-6">
//             <h1 className=' md:text-5xl text-3xl text-amber-800 font-bold mb-3 mt-2 transition-transform duration-300 ease-in-out hover:scale-110 drop-shadow-amber-50'>Welcome to Aai ji Honey</h1>
//             <h2 className="text-2xl font-bold text-amber-700 mb-4 transition-transform duration-300 ease-in-out hover:scale-110">Nature's Sweetest Gift 🍯</h2>
//             <p className="text-lg text-gray-700 mb-6 transition-transform duration-300 ease-in-out hover:scale-110">100% organic honey straight from the hive to your table.</p>
//             <button className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-8 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl group">
//               <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></span>
//               <Link to="/products" className="relative z-10 font-semibold tracking-wide">
//                 🛍️ Shop Now
//               </Link>
//             </button>

//           </div>
//         </section>

//         <section className='flex justify-center items-center relative'>
//           <div className='relative text-center p-6 w-xl rounded-x'>
//             <img className='w-40 md:w-50 drop-shadow-2xl float-left ' src='vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png' alt="Honey Jar" />
//             <span className="font-serif text-xl text-amber-900 italic shadow-2xl drop-shadow-md">
//               "At Aai Ji Honey, we believe in keeping it raw and real. Our honey is harvested by hand, using bee-friendly practices that preserve flavor, nutrients, and tradition. Straight from our hives in India, every drop is crafted with care — just like our Aai Ji Honey made it."
//             </span>
//           </div>
//         </section>
//         <section className="py-12 px-6 text-center">
//           <h3 className="text-2xl font-bold mb-6 text-amber-800">Why Choose Our Honey?</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
//             <div className="bg-white p-6 rounded-lg shadow-lg ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//               <h4 className="text-xl font-semibold text-amber-700 mb-2">100% Organic</h4>
//               <p className="text-gray-600">Our honey is sourced from organic farms, ensuring no pesticides or chemicals.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-2xl ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//               <h4 className="text-xl font-semibold text-amber-700 mb-2">Hand-Harvested</h4>
//               <p className="text-gray-600">We hand-harvest our honey to maintain its purity and natural goodness.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//               <h4 className="text-xl font-semibold text-amber-700 mb-2">Sustainably Sourced</h4>
//               <p className="text-gray-600">Our practices support bee health and biodiversity, ensuring a sustainable future.</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };
// export default Home;


// import { Link } from 'react-router-dom'
// import HoneyBeeBackground from './HoneyBeeBackground';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
//       <HoneyBeeBackground />
      
//       {/* Hero Section */}
//       <section className="relative pt-16 pb-20 px-6 text-center">
//         <div className="max-w-4xl mx-auto">
//           <div className="inline-block mb-6 px-6 py-2 bg-amber-100 rounded-full border-2 border-amber-300">
//             <span className="text-sm font-semibold text-amber-900">🐝 100% Pure & Organic</span>
//           </div>
          
//           <h1 className='text-5xl md:text-6xl font-bold text-amber-900 mb-4 drop-shadow-lg'>
//             Welcome to Aai Ji Honey
//           </h1>
//           <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-6">
//             Nature's Sweetest Gift 🍯
//           </h2>
//           <p className="text-xl text-amber-800 mb-8 font-medium">
//             100% organic honey straight from the hive to your table, crafted with care and tradition.
//           </p>
          
//           <button className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
//             <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></span>
//             <Link to="/products" className="relative z-10 flex items-center justify-center gap-2">
//               🛒 Shop Now
//             </Link>
//           </button>
//         </div>

//         {/* Decorative Honey Jar */}
//         <div className="mt-12">
//           <img 
//             className='w-48 md:w-56 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300' 
//             src='vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png' 
//             alt="Honey Jar" 
//           />
//         </div>
//       </section>

//       {/* Quote Section */}
//       <section className='py-12 px-6 bg-gradient-to-r from-amber-100 to-yellow-100 relative'>
//         <div className='max-w-3xl mx-auto text-center'>
//           <span className="font-serif text-2xl text-amber-900 italic leading-relaxed">
//             "At Aai Ji Honey, we believe in keeping it raw and real. Our honey is harvested by hand, using bee-friendly practices that preserve flavor, nutrients, and tradition. Straight from our hives in India, every drop is crafted with care – just like our Aai Ji made it."
//           </span>
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <h3 className="text-4xl font-bold text-center text-amber-900 mb-12">Why Choose Our Honey?</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Card 1 */}
//             <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-amber-500">
//               <div className="text-5xl mb-4">🌿</div>
//               <h4 className="text-2xl font-bold text-amber-900 mb-3">100% Organic</h4>
//               <p className="text-gray-700 leading-relaxed">Our honey is sourced from certified organic farms, ensuring no pesticides or harmful chemicals touch your golden treasure.</p>
//             </div>

//             {/* Card 2 */}
//             <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-orange-500">
//               <div className="text-5xl mb-4">✋</div>
//               <h4 className="text-2xl font-bold text-amber-900 mb-3">Hand-Harvested</h4>
//               <p className="text-gray-700 leading-relaxed">We hand-harvest our honey with care and precision, maintaining its purity and preserving all the natural goodness.</p>
//             </div>

//             {/* Card 3 */}
//             <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-yellow-500">
//               <div className="text-5xl mb-4">🌍</div>
//               <h4 className="text-2xl font-bold text-amber-900 mb-3">Sustainably Sourced</h4>
//               <p className="text-gray-700 leading-relaxed">Our practices support bee health and biodiversity, ensuring a sustainable future for generations to come.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Banner */}
//       <section className="py-12 px-6 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             <div>
//               <div className="text-4xl mb-2">🏆</div>
//               <p className="font-bold text-amber-900">Premium Quality</p>
//             </div>
//             <div>
//               <div className="text-4xl mb-2">🚀</div>
//               <p className="font-bold text-amber-900">Fast Delivery</p>
//             </div>
//             <div>
//               <div className="text-4xl mb-2">💚</div>
//               <p className="font-bold text-amber-900">Eco-Friendly</p>
//             </div>
//             <div>
//               <div className="text-4xl mb-2">⭐</div>
//               <p className="font-bold text-amber-900">Trusted Brand</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-6">
//         <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-white text-center shadow-2xl">
//           <h3 className="text-3xl md:text-4xl font-bold mb-4">Taste the Sweet Difference</h3>
//           <p className="text-lg mb-8 opacity-90">Join thousands of honey lovers who have made the switch to pure, authentic Aai Ji Honey.</p>
//           <Link 
//             to="/products" 
//             className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
//           >
//             Explore Collection →
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import HoneyBeeBackground from './HoneyBeeBackground';

const AnimatedBeesAroundJar = () => {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      </div>

      {/* Honey Jar Image */}
      <div className="relative z-10">
        <img 
          className='w-56 md:w-72 drop-shadow-2xl relative z-10 hover:drop-shadow-3xl transition-all duration-300 cursor-pointer animate-[float_3s_ease-in-out_infinite]' 
          src='vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png' 
          alt="Honey Jar with Bees"
        />
      </div>

      {/* Realistic Honey Bee 1 - Top Right */}
      <div 
        className="absolute z-20" 
        style={{
          top: '40px',
          right: '60px',
          animation: 'bee-orbit-1 8s linear infinite'
        }}
      >
        <div className="relative w-12 h-12">
          {/* Bee Body */}
          <div className="absolute w-8 h-10 bg-yellow-300 rounded-full left-2 top-1 shadow-lg">
            {/* Stripes */}
            <div className="absolute w-full h-1.5 bg-gray-800 top-2"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-5"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-8"></div>
          </div>
          
          {/* Head */}
          <div className="absolute w-5 h-5 bg-orange-500 rounded-full left-3.5 top-0 shadow-md">
            {/* Eyes */}
            <div className="absolute w-1 h-1 bg-black rounded-full left-1 top-1.5"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full right-1 top-1.5"></div>
            {/* Antennae */}
            <div className="absolute w-0.5 h-3 bg-black left-2 -top-2 origin-bottom" style={{transform: 'rotate(-20deg)'}}></div>
            <div className="absolute w-0.5 h-3 bg-black right-2 -top-2 origin-bottom" style={{transform: 'rotate(20deg)'}}></div>
          </div>

          {/* Left Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full left-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite'}}
          ></div>

          {/* Right Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full right-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite 0.15s'}}
          ></div>

          {/* Back Legs */}
          <div className="absolute w-1 h-3 bg-gray-800 left-3 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 left-5 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 right-3 bottom-0"></div>
        </div>
      </div>

      {/* Realistic Honey Bee 2 - Left Side */}
      <div 
        className="absolute z-20" 
        style={{
          left: '30px',
          top: '150px',
          animation: 'bee-orbit-2 9s linear infinite'
        }}
      >
        <div className="relative w-12 h-12">
          {/* Bee Body */}
          <div className="absolute w-8 h-10 bg-yellow-300 rounded-full left-2 top-1 shadow-lg">
            {/* Stripes */}
            <div className="absolute w-full h-1.5 bg-gray-800 top-2"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-5"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-8"></div>
          </div>
          
          {/* Head */}
          <div className="absolute w-5 h-5 bg-orange-500 rounded-full left-3.5 top-0 shadow-md">
            {/* Eyes */}
            <div className="absolute w-1 h-1 bg-black rounded-full left-1 top-1.5"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full right-1 top-1.5"></div>
            {/* Antennae */}
            <div className="absolute w-0.5 h-3 bg-black left-2 -top-2 origin-bottom" style={{transform: 'rotate(-20deg)'}}></div>
            <div className="absolute w-0.5 h-3 bg-black right-2 -top-2 origin-bottom" style={{transform: 'rotate(20deg)'}}></div>
          </div>

          {/* Left Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full left-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite'}}
          ></div>

          {/* Right Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full right-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite 0.15s'}}
          ></div>

          {/* Back Legs */}
          <div className="absolute w-1 h-3 bg-gray-800 left-3 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 left-5 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 right-3 bottom-0"></div>
        </div>
      </div>

      {/* Realistic Honey Bee 3 - Bottom Right */}
      <div 
        className="absolute z-20" 
        style={{
          bottom: '50px',
          right: '50px',
          animation: 'bee-orbit-3 8.5s linear infinite'
        }}
      >
        <div className="relative w-12 h-12">
          {/* Bee Body */}
          <div className="absolute w-8 h-10 bg-yellow-300 rounded-full left-2 top-1 shadow-lg">
            {/* Stripes */}
            <div className="absolute w-full h-1.5 bg-gray-800 top-2"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-5"></div>
            <div className="absolute w-full h-1.5 bg-gray-800 top-8"></div>
          </div>
          
          {/* Head */}
          <div className="absolute w-5 h-5 bg-orange-500 rounded-full left-3.5 top-0 shadow-md">
            {/* Eyes */}
            <div className="absolute w-1 h-1 bg-black rounded-full left-1 top-1.5"></div>
            <div className="absolute w-1 h-1 bg-black rounded-full right-1 top-1.5"></div>
            {/* Antennae */}
            <div className="absolute w-0.5 h-3 bg-black left-2 -top-2 origin-bottom" style={{transform: 'rotate(-20deg)'}}></div>
            <div className="absolute w-0.5 h-3 bg-black right-2 -top-2 origin-bottom" style={{transform: 'rotate(20deg)'}}></div>
          </div>

          {/* Left Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full left-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite'}}
          ></div>

          {/* Right Wings */}
          <div 
            className="absolute w-6 h-8 bg-blue-200 opacity-60 rounded-full right-0 top-3 shadow-inner"
            style={{animation: 'wing-flap 0.3s ease-in-out infinite 0.15s'}}
          ></div>

          {/* Back Legs */}
          <div className="absolute w-1 h-3 bg-gray-800 left-3 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 left-5 bottom-0"></div>
          <div className="absolute w-1 h-3 bg-gray-800 right-3 bottom-0"></div>
        </div>
      </div>

      {/* Sparkles */}
      <div className="absolute top-20 right-32 text-2xl animate-bounce">✨</div>
      <div className="absolute bottom-20 left-32 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>✨</div>

      {/* Bee Animations */}
      <style>{`
        @keyframes bee-orbit-1 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(50px, -40px) rotate(10deg);
          }
          50% {
            transform: translate(80px, 30px) rotate(0deg);
          }
          75% {
            transform: translate(40px, 60px) rotate(-10deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes bee-orbit-2 {
          0% {
            transform: translate(0, 0) scaleX(-1);
          }
          25% {
            transform: translate(-60px, 40px) scaleX(-1);
          }
          50% {
            transform: translate(-90px, -30px) scaleX(-1);
          }
          75% {
            transform: translate(-50px, -70px) scaleX(-1);
          }
          100% {
            transform: translate(0, 0) scaleX(-1);
          }
        }

        @keyframes bee-orbit-3 {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(55px, 35px) rotate(8deg);
          }
          50% {
            transform: translate(85px, -25px) rotate(0deg);
          }
          75% {
            transform: translate(45px, -65px) rotate(-8deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes wing-flap {
          0%, 100% {
            opacity: 0.6;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.3;
            transform: scaleY(0.3);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

const Home = () => {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('[data-observe]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 overflow-hidden">
      <style>{`
        /* Scroll Entrance Animations */
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        /* Visibility Classes */
        .observe-slide-left {
          opacity: 0;
          transform: translateX(-60px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .observe-slide-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .observe-slide-right {
          opacity: 0;
          transform: translateX(60px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .observe-slide-right.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .observe-slide-bottom {
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .observe-slide-bottom.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .observe-scale {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .observe-scale.visible {
          opacity: 1;
          transform: scale(1);
        }

        .observe-fade {
          opacity: 0;
          transition: opacity 0.8s ease-out;
        }

        .observe-fade.visible {
          opacity: 1;
        }

        /* Staggered Children */
        .observe-stagger > * {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateY(30px);
        }

        .observe-stagger.visible > * {
          opacity: 1;
          transform: translateY(0);
        }

        .observe-stagger.visible > :nth-child(1) { transition-delay: 0.1s; }
        .observe-stagger.visible > :nth-child(2) { transition-delay: 0.2s; }
        .observe-stagger.visible > :nth-child(3) { transition-delay: 0.3s; }
        .observe-stagger.visible > :nth-child(4) { transition-delay: 0.4s; }

        /* Card Stagger */
        .card-grid > div {
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          opacity: 0;
          transform: translateY(50px);
        }

        .card-grid.visible > div {
          opacity: 1;
          transform: translateY(0);
        }

        .card-grid.visible > div:nth-child(1) { transition-delay: 0.15s; }
        .card-grid.visible > div:nth-child(2) { transition-delay: 0.3s; }
        .card-grid.visible > div:nth-child(3) { transition-delay: 0.45s; }

        .honeycomb-bg {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 60% 70%, rgba(251, 191, 36, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .card-hover:hover {
          transform: translateY(-12px);
        }
      `}</style>

      <HoneyBeeBackground />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 text-center honeycomb-bg">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-10 right-10 w-20 h-20 bg-amber-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-block mb-8 px-8 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border-2 border-amber-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group animate-[fadeIn_0.8s_ease-out]">
            <span className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <span className="text-xl animate-bounce">🍯</span>
              100% Pure, Raw & Organic
              <span className="text-xl animate-bounce" style={{animationDelay: '0.2s'}}>🐝</span>
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className='text-5xl md:text-7xl font-black text-amber-950 mb-4 drop-shadow-2xl leading-tight animate-[slideInFromLeft_0.8s_ease-out_0.1s_both]'>
            Welcome to <span className="gradient-text">Aai Ji Honey</span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-3xl md:text-5xl font-bold text-orange-600 mb-6 drop-shadow-lg animate-[slideInFromRight_0.8s_ease-out_0.2s_both]">
            Nature's Sweetest Gift 🍯
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-amber-900 mb-10 font-medium max-w-3xl mx-auto leading-relaxed opacity-95 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
            🌾 Straight from the pristine hives of India, every drop tells a story of tradition, care, and natural excellence.
          </p>
          
          {/* CTA Button */}
          <button className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-4 border-amber-400 animate-[scaleIn_0.8s_cubic-bezier(0.34,1.56,0.64,1)_0.4s_both]">
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md"></span>
            <span className="absolute inset-0 rounded-full border-2 border-white opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></span>
            <Link to="/products" className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl group-hover:animate-spin">🛒</span>
              Shop Now
            </Link>
          </button>
        </div>

        {/* Honey Jar with Animated Bees */}
        <div className="mt-16 relative z-10">
          <AnimatedBeesAroundJar />
        </div>
      </section>

      {/* Quote Section */}
      <section id="quote-section" data-observe className={`relative py-16 px-6 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 observe-slide-bottom ${visibleSections['quote-section'] ? 'visible' : ''}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <p className="text-5xl mb-6">✨</p>
          <span className="block font-serif text-2xl md:text-3xl text-amber-950 italic leading-relaxed shadow-sm">
            "At Aai Ji Honey, we believe in keeping it <span className="font-black not-italic">raw and real</span>. Our honey is harvested by hand, using bee-friendly practices that preserve flavor, nutrients, and tradition. Straight from our hives in India, every drop is crafted with care — just like our Aai Ji made it."
          </span>
          <p className="mt-6 text-lg text-amber-900 font-semibold">— Straight from our hives, crafted with love</p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-section" data-observe className={`py-20 px-6 relative observe-fade ${visibleSections['why-section'] ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className={`text-center mb-16 observe-slide-bottom ${visibleSections['why-section'] ? 'visible' : ''}`}>
            <p className="text-amber-700 font-bold text-lg mb-3">OUR PROMISE</p>
            <h3 className="text-5xl md:text-6xl font-black text-amber-950 mb-4">Why Choose Our Honey?</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 mx-auto rounded-full"></div>
          </div>
          
          {/* Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 card-grid ${visibleSections['why-section'] ? 'visible' : ''}`}>
            {/* Card 1 - Organic */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform border-t-4 border-amber-400 overflow-hidden card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">🌿</div>
                <h4 className="text-3xl font-black text-amber-950 mb-4">100% Organic</h4>
                <p className="text-gray-700 leading-relaxed text-lg">Sourced from certified organic farms, free from pesticides and harmful chemicals. Pure nature, pure goodness.</p>
                <div className="mt-6 pt-4 border-t-2 border-amber-200">
                  <p className="text-sm font-bold text-amber-600 group-hover:translate-x-2 transition-transform">Learn More →</p>
                </div>
              </div>
            </div>

            {/* Card 2 - Hand-Harvested */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform border-t-4 border-orange-400 overflow-hidden card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">✋</div>
                <h4 className="text-3xl font-black text-amber-950 mb-4">Hand-Harvested</h4>
                <p className="text-gray-700 leading-relaxed text-lg">Carefully harvested by hand with traditional methods, preserving purity and all natural nutrients intact.</p>
                <div className="mt-6 pt-4 border-t-2 border-orange-200">
                  <p className="text-sm font-bold text-orange-600 group-hover:translate-x-2 transition-transform">Learn More →</p>
                </div>
              </div>
            </div>

            {/* Card 3 - Sustainable */}
            <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform border-t-4 border-yellow-400 overflow-hidden card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-300">🌍</div>
                <h4 className="text-3xl font-black text-amber-950 mb-4">Sustainably Sourced</h4>
                <p className="text-gray-700 leading-relaxed text-lg">Supporting bee health and biodiversity with eco-friendly practices for a sustainable future.</p>
                <div className="mt-6 pt-4 border-t-2 border-yellow-200">
                  <p className="text-sm font-bold text-yellow-600 group-hover:translate-x-2 transition-transform">Learn More →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner Section */}
      <section id="features-section" data-observe className={`py-16 px-6 bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-200 relative overflow-hidden observe-slide-bottom ${visibleSections['features-section'] ? 'visible' : ''}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 observe-stagger ${visibleSections['features-section'] ? 'visible' : ''}`}>
            {/* Feature 1 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 transform border-2 border-amber-200 hover:border-amber-400 card-hover">
              <div className="text-6xl mb-3 group-hover:animate-bounce">👑</div>
              <p className="font-black text-amber-950 text-lg">Premium Quality</p>
              <p className="text-sm text-amber-800 mt-2 opacity-75">Grade A Certified</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 transform border-2 border-orange-200 hover:border-orange-400 card-hover">
              <div className="text-6xl mb-3 group-hover:animate-bounce" style={{animationDelay: '0.2s'}}>🚀</div>
              <p className="font-black text-amber-950 text-lg">Fast Delivery</p>
              <p className="text-sm text-amber-800 mt-2 opacity-75">24-48 Hours</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 transform border-2 border-green-200 hover:border-green-400 card-hover">
              <div className="text-6xl mb-3 group-hover:animate-bounce" style={{animationDelay: '0.4s'}}>♻️</div>
              <p className="font-black text-amber-950 text-lg">Eco-Friendly</p>
              <p className="text-sm text-amber-800 mt-2 opacity-75">100% Recyclable</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 transform border-2 border-yellow-200 hover:border-yellow-400 card-hover">
              <div className="text-6xl mb-3 group-hover:animate-bounce" style={{animationDelay: '0.6s'}}>⭐</div>
              <p className="font-black text-amber-950 text-lg">Trusted Brand</p>
              <p className="text-sm text-amber-800 mt-2 opacity-75">5/5 Rated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" data-observe className={`py-16 px-6 observe-fade ${visibleSections['stats-section'] ? 'visible' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-8 text-center observe-stagger ${visibleSections['stats-section'] ? 'visible' : ''}`}>
            <div className="group card-hover">
              <h3 className="text-4xl md:text-5xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">10K+</h3>
              <p className="text-amber-900 font-bold text-lg">Happy Customers</p>
            </div>
            <div className="group card-hover">
              <h3 className="text-4xl md:text-5xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">25+</h3>
              <p className="text-amber-900 font-bold text-lg">Years Tradition</p>
            </div>
            <div className="group card-hover">
              <h3 className="text-4xl md:text-5xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">100%</h3>
              <p className="text-amber-900 font-bold text-lg">Pure & Natural</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta-section" data-observe className={`py-20 px-6 relative overflow-hidden observe-scale ${visibleSections['cta-section'] ? 'visible' : ''}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group border-4 border-amber-400 overflow-hidden card-hover">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
            
            <div className="relative z-10">
              <p className="text-lg font-bold opacity-90 mb-3 tracking-widest">DISCOVER THE DIFFERENCE</p>
              <h3 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-lg">Taste the Golden Sweetness</h3>
              <p className="text-lg mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
                Join thousands of honey enthusiasts who have embraced the pure, authentic taste of Aai Ji Honey. Experience wellness, tradition, and nature in every spoon.
              </p>
              
              <Link 
                to="/products" 
                className="inline-block group/btn px-10 py-4 bg-white text-orange-600 font-black text-lg rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg border-2 border-amber-100"
              >
                <span className="flex items-center justify-center gap-3">
                  <span className="group-hover/btn:animate-spin">🍯</span>
                  Explore Full Collection
                  <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;