import ImageGallery from './ImageGallery'
import HoneyBeeBackground from './HoneyBeeBackground'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-white/80 to-orange-200 px-6 py-12 mt-[-30px] lg:py-20">
      <HoneyBeeBackground />
      <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
        The name <strong className="text-amber-700">Aai Ji Honey</strong> is a tribute
        to family — the warmth and care of a grandmother who nurtures the home and
        preserves recipes and traditions. Combining that cultural warmth with modern
        scientific practice, Dr. Seervi set out to create a brand that stands for
        purity, farmer empowerment, and sustainability.
      </p>


      <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
        Today, Aai Ji Honey is more than a product. It’s a movement: a
        promise to deliver chemical-free honey, a platform to train and
        support local farmers in beekeeping, and a commitment to protect
        pollinators and biodiversity. Each jar carries a story — of the
        land, the bees, and the hands that carefully tended them.
      </p>

      <p className="mx-auto max-w-2xl text-center p-4 rounded-2xl shadow-md">
        Dr. Sitaram Seervi vision continues to inspire the team: to expand
        farmer-friendly beekeeping practices, raise awareness about the
        role of bees in food security, and ensure every household has
        access to natural, wholesome honey. From humble beginnings to a
        trusted name, Aai Ji Honey remains rooted in tradition while
        guided by science — keeping the future sweet for generations to
        come.
      </p>

      {/* Closing CTA */}
      <section className="mt-12 bg-amber-600 text-white rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className='items-center'>
          <h4 className="text-lg font-semibold">Taste the tradition</h4>
          <p className="mt-1 text-sm opacity-90">Order a jar of Aai Ji Honey today.</p>
        </div>
        <div>
          <Link to="/products" 
            className="inline-block px-5 py-3 bg-white text-orange-700 rounded-full font-semibold shadow-sm hover:bg-orange-50"
          >
            Shop Honey
          </Link>
        </div>
      </section>
      <ImageGallery />
    </main>
  )
}

export default About
