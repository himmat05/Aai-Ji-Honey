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


import { Link } from 'react-router-dom'
import HoneyBeeBackground from './HoneyBeeBackground';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <HoneyBeeBackground />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 bg-amber-100 rounded-full border-2 border-amber-300">
            <span className="text-sm font-semibold text-amber-900">🐝 100% Pure & Organic</span>
          </div>
          
          <h1 className='text-5xl md:text-6xl font-bold text-amber-900 mb-4 drop-shadow-lg'>
            Welcome to Aai Ji Honey
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-6">
            Nature's Sweetest Gift 🍯
          </h2>
          <p className="text-xl text-amber-800 mb-8 font-medium">
            100% organic honey straight from the hive to your table, crafted with care and tradition.
          </p>
          
          <button className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></span>
            <Link to="/products" className="relative z-10 flex items-center justify-center gap-2">
              🛒 Shop Now
            </Link>
          </button>
        </div>

        {/* Decorative Honey Jar */}
        <div className="mt-12">
          <img 
            className='w-48 md:w-56 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300' 
            src='vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png' 
            alt="Honey Jar" 
          />
        </div>
      </section>

      {/* Quote Section */}
      <section className='py-12 px-6 bg-gradient-to-r from-amber-100 to-yellow-100 relative'>
        <div className='max-w-3xl mx-auto text-center'>
          <span className="font-serif text-2xl text-amber-900 italic leading-relaxed">
            "At Aai Ji Honey, we believe in keeping it raw and real. Our honey is harvested by hand, using bee-friendly practices that preserve flavor, nutrients, and tradition. Straight from our hives in India, every drop is crafted with care – just like our Aai Ji made it."
          </span>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-amber-900 mb-12">Why Choose Our Honey?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-amber-500">
              <div className="text-5xl mb-4">🌿</div>
              <h4 className="text-2xl font-bold text-amber-900 mb-3">100% Organic</h4>
              <p className="text-gray-700 leading-relaxed">Our honey is sourced from certified organic farms, ensuring no pesticides or harmful chemicals touch your golden treasure.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-orange-500">
              <div className="text-5xl mb-4">✋</div>
              <h4 className="text-2xl font-bold text-amber-900 mb-3">Hand-Harvested</h4>
              <p className="text-gray-700 leading-relaxed">We hand-harvest our honey with care and precision, maintaining its purity and preserving all the natural goodness.</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-l-4 border-yellow-500">
              <div className="text-5xl mb-4">🌍</div>
              <h4 className="text-2xl font-bold text-amber-900 mb-3">Sustainably Sourced</h4>
              <p className="text-gray-700 leading-relaxed">Our practices support bee health and biodiversity, ensuring a sustainable future for generations to come.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 px-6 bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-bold text-amber-900">Premium Quality</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🚀</div>
              <p className="font-bold text-amber-900">Fast Delivery</p>
            </div>
            <div>
              <div className="text-4xl mb-2">💚</div>
              <p className="font-bold text-amber-900">Eco-Friendly</p>
            </div>
            <div>
              <div className="text-4xl mb-2">⭐</div>
              <p className="font-bold text-amber-900">Trusted Brand</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Taste the Sweet Difference</h3>
          <p className="text-lg mb-8 opacity-90">Join thousands of honey lovers who have made the switch to pure, authentic Aai Ji Honey.</p>
          <Link 
            to="/products" 
            className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            Explore Collection →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;