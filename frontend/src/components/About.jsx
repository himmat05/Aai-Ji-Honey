import ImageGallery from './ImageGallery'
import HoneyBeeBackground from './HoneyBeeBackground'

const About = () => {
  return (
    <section className="flex px-6 py-10 mt-[-30px] bg-gradient-to-br from-yellow-100 via-white/80 to-orange-200 text-amber-900 items-center justify-center">
      <HoneyBeeBackground/>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          About <span className="text-amber-600">Us</span>
        </h1>

        <div className="flex gap-4 items-center justify-center">

          <div className="md:w-3/4 ml-2">
            <p className="mb-4 text-lg">
              <strong>Aai ji Honey</strong> was founded by <strong>Dr. S.R. Seervi</strong>, a Ph.D. graduate in
              <span className="text-amber-700 font-medium"> Entomology (Apiculture specialized)</span>. With deep scientific knowledge
              of bee behavior and sustainable honey production, Dr.S.R Seervi turned his passion
              into a mission — to bring <strong>pure, natural honey</strong> to every home.
            </p>
            <p className="mb-4 text-lg">
              Backed by years of research and hands-on field experience, our honey is harvested
              using ethical beekeeping practices that protect pollinators and preserve nature's balance.
              We never compromise on quality — no additives, no artificial processing.
            </p>
            <p className="text-lg">
              Each drop of our honey is a reflection of scientific precision, purity, and care.
              Discover the perfect harmony between science and nature — all in a jar of honey.
            </p>
          </div>
        </div>
        <ImageGallery />
        <div className="mt-10 text-center ml-2">
          <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
          <ul className="text-lg space-y-2 text-left md:text-center">
            <li>🌿 100% Pure & Natural Honey</li>
            <li>🧪 Scientifically-Backed Beekeeping</li>
            <li>🐝 Ethical & Sustainable Practices</li>
            <li>🍯 Rich in Taste & Nutritional Value</li>
            <li>📍 Based in Megakheda, Rajsamand</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
