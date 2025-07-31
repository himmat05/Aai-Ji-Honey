import React from 'react'
import { Link } from 'react-router-dom'
import HoneyBeeBackground from './HoneyBeeBackground';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80 mt-[-25px]">
      <HoneyBeeBackground />
      <div className="font-sans text-gray-800 mt-[-10px]">
        <section className="relative flex items-center justify-center text-center">
          <div className="relative z-10 max-w-2xl p-6">
            <h1 className=' md:text-5xl text-3xl text-amber-800 font-bold mb-3 mt-2 transition-transform duration-300 ease-in-out hover:scale-110 drop-shadow-amber-50'>Welcome to Aai ji Honey</h1>
            <h2 className="text-2xl font-bold text-amber-700 mb-4 transition-transform duration-300 ease-in-out hover:scale-110">Nature's Sweetest Gift 🍯</h2>
            <p className="text-lg text-gray-700 mb-6 transition-transform duration-300 ease-in-out hover:scale-110">100% organic honey straight from the hive to your table.</p>
            <button className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-8 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl group">
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></span>
              <Link to="/products" className="relative z-10 font-semibold tracking-wide">
                🛍️ Shop Now
              </Link>
            </button>

          </div>
        </section>

        <section className='flex justify-center items-center relative'>
          <div className='relative text-center p-6 w-xl rounded-x'>
            <img className='w-40 md:w-50 drop-shadow-2xl float-left ' src='vecteezy_honey-jar-with-bees-and-golden-drips_56472491.png' alt="Honey Jar" />
            <span className="font-serif text-xl text-amber-900 italic shadow-2xl drop-shadow-md">
              "At Aai Ji Honey, we believe in keeping it raw and real. Our honey is harvested by hand, using bee-friendly practices that preserve flavor, nutrients, and tradition. Straight from our hives in India, every drop is crafted with care — just like our Aai Ji Honey made it."
            </span>
          </div>
        </section>
        <section className="py-12 px-6 text-center">
          <h3 className="text-2xl font-bold mb-6 text-amber-800">Why Choose Our Honey?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="bg-white p-6 rounded-lg shadow-lg ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-xl font-semibold text-amber-700 mb-2">100% Organic</h4>
              <p className="text-gray-600">Our honey is sourced from organic farms, ensuring no pesticides or chemicals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-xl font-semibold text-amber-700 mb-2">Hand-Harvested</h4>
              <p className="text-gray-600">We hand-harvest our honey to maintain its purity and natural goodness.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg ease-in-out hover:bg-amber-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-xl font-semibold text-amber-700 mb-2">Sustainably Sourced</h4>
              <p className="text-gray-600">Our practices support bee health and biodiversity, ensuring a sustainable future.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Home;
