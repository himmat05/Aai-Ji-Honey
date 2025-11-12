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


import ImageGallery from './ImageGallery'
import HoneyBeeBackground from './HoneyBeeBackground'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <HoneyBeeBackground />
      
      {/* Header Section */}
      <section className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-amber-900 mb-4">Our Story</h1>
        <p className="text-xl text-amber-700">From tradition to your table</p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
      </section>

      {/* Story Cards */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="text-5xl">👨‍👩‍👧‍👦</div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">A Tribute to Family</h3>
                <p className="text-gray-700 leading-relaxed">
                  The name <strong className="text-amber-700">Aai Ji Honey</strong> is a tribute to family – the warmth and care of a grandmother who nurtures the home and preserves recipes and traditions. Combining that cultural warmth with modern scientific practice, Dr. Seervi set out to create a brand that stands for purity, farmer empowerment, and sustainability.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🐝</div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">More Than a Product</h3>
                <p className="text-gray-700 leading-relaxed">
                  Today, Aai Ji Honey is more than a product. It's a movement: a promise to deliver chemical-free honey, a platform to train and support local farmers in beekeeping, and a commitment to protect pollinators and biodiversity. Each jar carries a story – of the land, the bees, and the hands that carefully tended them.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🌍</div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  Dr. Sitaram Seervi's vision continues to inspire the team: to expand farmer-friendly beekeeping practices, raise awareness about the role of bees in food security, and ensure every household has access to natural, wholesome honey. From humble beginnings to a trusted name, Aai Ji Honey remains rooted in tradition while guided by science – keeping the future sweet for generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-amber-100 to-yellow-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-900 mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-4xl font-bold text-amber-600">100%</p>
              <p className="text-amber-900 font-semibold mt-2">Organic</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-4xl font-bold text-amber-600">500+</p>
              <p className="text-amber-900 font-semibold mt-2">Farmers</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-4xl font-bold text-amber-600">0%</p>
              <p className="text-amber-900 font-semibold mt-2">Chemicals</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-4xl font-bold text-amber-600">∞</p>
              <p className="text-amber-900 font-semibold mt-2">Sustainability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-6">
        <ImageGallery />
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Taste the Tradition</h3>
          <p className="text-lg mb-8 opacity-90">
            Experience the pure goodness of Aai Ji Honey. Each jar tells a story of care, tradition, and sustainability.
          </p>
          <Link 
            to="/products" 
            className="inline-block px-10 py-4 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform shadow-lg text-lg"
          >
            🛍️ Shop Honey
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About