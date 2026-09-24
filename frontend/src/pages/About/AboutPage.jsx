import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from '../Home/components/ImageGallery';

const ERAS = [
  {
    id: 'era-1980',
    year: '1980',
    badge: 'HERITAGE & SACRED ROOTS',
    title: "Grandmother Aai Ji's Kitchen",
    subtitle: 'The timeless Ayurvedic wisdom of pure food as medicine',
    story:
      'In a quiet village of Pali, Rajasthan, our family matriarch — affectionately called "Aai Ji" — preserved ancient Ayurvedic traditions. She maintained that real honey is not a sweetener, but a living elixir. In her earthen kitchen, honey was stored in brass and clay jars, never exposed to fire, and blended with desert neem, tulsi, and black pepper to cure seasonal ailments. Aai Ji taught us that food in its purest, untouched state carries the natural vitality (Prana) of the earth.',
    quote: '"Nature has already perfected every remedy. When human hands interfere with fire and chemicals, we destroy the blessing."',
    author: '— Aai Ji (Family Matriarch & Inspiration)',
    image: '/Aai-ji-Honey-BeeKeeping2.jpg',
    tags: ['Clay Pot Storage', 'Zero Heating', 'Traditional Ayurveda'],
    stat: { value: '40+ Yrs', label: 'Living Heritage' },
    accent: 'from-amber-600 to-orange-500',
  },
  {
    id: 'era-2023',
    year: '2023',
    badge: 'ENTOMOLOGY RESEARCH',
    title: 'The Scientific Awakening',
    subtitle: 'Doctoral research uncovering the destruction of commercial honey',
    story:
      'Pursuing his passion for natural sciences, Dr. Sitaram Seervi completed his Ph.D. in Entomology, specializing in the behavioral ecology and nectar-foraging patterns of Indian honeybees (Apis dorsata and Apis florea). His laboratory research revealed a shocking truth: commercial brands heat honey to 75°C and micro-filter it to prevent crystallization, permanently killing live diastase enzymes, destroying pollen, and degrading beneficial bio-flavonoids. Dr. Seervi resolved to build an apiary where science protects nature, never exploits it.',
    quote: '"Heating honey to make it look clear is like boiling fresh fruit juice until every vitamin is destroyed. Real honey must remain alive."',
    author: '— Dr. Sitaram Seervi (Ph.D. Entomology, Founder)',
    image: '/honey_founder_on work.jpeg',
    tags: ['Ph.D. Field Research', 'Living Enzymes', 'Apis Ecology'],
    stat: { value: 'Ph.D. Lab', label: 'Entomology Research' },
    accent: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'era-2024',
    year: '2024',
    badge: 'RURAL EMPOWERMENT',
    title: 'Protecting Rajasthan Pollinators',
    subtitle: 'Transforming tribal honey hunters into ethical bee guardians',
    story:
      'For decades, traditional honey collection in Rajasthan involved burning wild hives with fire torches — killing millions of bees and destroying fragile desert ecosystems. Dr. Seervi launched a grassroots movement across Marwar and Mewar, providing free wooden Langstroth hive boxes and scientific training to over 500 rural and tribal farmers. Today, our beekeepers harvest only surplus honey using gentle, smoke-free techniques while protecting queens and developing healthy brood cycles.',
    quote: '"When a farmer protects the honeybee, crop yields double through pollination, and the desert blooms with life."',
    author: '— Aai Ji Honey Farmer Cooperative Network',
    image: '/Aai-ji-Honey-Beefarm.jpg',
    tags: ['500+ Beekeepers', 'Zero Bee Harm', 'Cross-Pollination'],
    stat: { value: '500+', label: 'Tribal Guardians' },
    accent: 'from-orange-500 to-amber-600',
  },
  {
    id: 'era-today',
    year: 'Today',
    badge: 'PURITY REDEFINED',
    title: 'From Desert Blossom to Your Dining Table',
    subtitle: 'Single-origin, cold-extracted living honey in UV glass jars',
    story:
      'Today, Aai Ji Honey stands as India’s benchmark for uncompromising raw honey. We never blend harvests from different regions, never feed bees artificial sugar syrups, and test every batch using Nuclear Magnetic Resonance (NMR) spectroscopy for zero adulteration. Each jar arrives at your doorstep exactly as the bees created it: rich with aromatic pollen, active enzymes, and the authentic taste of Rajasthan flora.',
    quote: '"You are not just buying honey; you are tasting the pure nectar of Rajasthan wild blossoms and preserving an ethical ecosystem."',
    author: '— The Aai Ji Honey Promise',
    image: '/honey_box2.jpeg',
    tags: ['NMR Certified', 'Unfiltered Pollen', 'Single Origin'],
    stat: { value: '10K+', label: 'Families Nourished' },
    accent: 'from-amber-600 to-emerald-600',
  },
];

const SCIENCE_PILLARS = [
  {
    id: 'enzymes',
    icon: '⚡',
    title: 'Active Diastase & Invertase',
    headline: 'Living enzymes that aid digestion and gut health',
    detail:
      'When bees transform flower nectar into honey, they add salivary enzymes including Diastase, Invertase, and Glucose Oxidase. These enzymes actively convert complex sugars into easily digestible monosaccharides and release gentle hydrogen peroxide, providing powerful natural antibacterial defenses. Heating honey above 40°C permanently denatures these delicate enzymes.',
    labMetric: 'Diastase Activity: > 12 DN (Well above international standards)',
  },
  {
    id: 'pollen',
    icon: '🌾',
    title: 'Intact Micro-Nutrient Pollen',
    headline: 'Nature’s multivitamin preserved without fine filtration',
    detail:
      'Commercial brands use ultra-fine diatomaceous earth filters to remove bee pollen so the honey appears unnaturally transparent and never crystallizes. Aai Ji Honey uses only coarse gravity cloth settling, retaining thousands of microscopic golden pollen grains loaded with B-complex vitamins, amino acids, and immune-building plant bioflavonoids.',
    labMetric: 'Pollen Density: > 25,000 grains per gram of raw honey',
  },
  {
    id: 'propolis',
    icon: '🛡️',
    title: 'Bee Propolis & Bio-Flavonoids',
    headline: 'Antimicrobial resin collected from desert herbs',
    detail:
      'Worker bees collect aromatic resins from wild acacia, ber, and neem buds to create propolis — the sterile sealant of the hive. Micro-traces of propolis infuse our raw honey with potent polyphenol antioxidants that soothe sore throats, protect mucosal linings, and scavenge free radicals.',
    labMetric: 'Total Phenolic Content: > 85 mg GAE/100g',
  },
  {
    id: 'moisture',
    icon: '💧',
    title: 'Sub-18% Natural Moisture',
    headline: 'Naturally evaporated by bee wing fanning, never boiled',
    detail:
      'Immature honey has high water content and ferments quickly. Commercial operators harvest early and boil off water in vacuum evaporators. Aai Ji Honey waits patiently until the bees fan their wings over the combs for days, naturally dropping moisture below 18%, before sealing the cells with pure beeswax.',
    labMetric: 'Natural Hive Moisture: 16.5% – 17.8% (Naturally shelf-stable for years)',
  },
];

const COMPARISON_DATA = [
  {
    feature: 'Heat Treatment',
    commercial: 'Pasteurized at 70°C – 80°C to prolong liquid state',
    aaiji: '100% Cold-Extracted at natural hive temperature (<35°C)',
    isGoodAaiji: true,
  },
  {
    feature: 'Live Enzymes',
    commercial: 'Dead / Denatured due to high-temperature thermal shock',
    aaiji: 'Active Diastase, Invertase & Glucose Oxidase fully preserved',
    isGoodAaiji: true,
  },
  {
    feature: 'Natural Bee Pollen',
    commercial: 'Stripped away via ultra-fine diatomaceous filtration',
    aaiji: 'Retained intact with rich floral pollen and bio-flavonoids',
    isGoodAaiji: true,
  },
  {
    feature: 'Adulterants / Syrups',
    commercial: 'Frequently stretched with C3/C4 corn, rice, or invert syrups',
    aaiji: '0% Added Sugar, 0% Syrups — Certified NMR Lab Pure',
    isGoodAaiji: true,
  },
  {
    feature: 'Natural Crystallization',
    commercial: 'Prevented artificially (a sign of dead, processed syrup)',
    aaiji: 'Crystallizes naturally into rich, creamy spread (proof of raw purity)',
    isGoodAaiji: true,
  },
  {
    feature: 'Traceability & Origin',
    commercial: 'Blended from anonymous global factory bulk drums',
    aaiji: '100% Single-Origin harvested from Rajasthan desert flora',
    isGoodAaiji: true,
  },
  {
    feature: 'Packaging Material',
    commercial: 'Low-cost PET plastic bottles (leaches microplastics)',
    aaiji: 'Heavy, lead-free UV-protective food-grade glass jars',
    isGoodAaiji: true,
  },
];

const RAJASTHAN_FLORA = [
  {
    id: 'mustard',
    name: 'Mustard Blossom',
    hindi: 'सरसों का शहद',
    season: 'Winter (Dec – Feb)',
    region: 'Alwar, Bharatpur & Marwar Plains',
    color: 'Bright Golden to Pale Cream',
    taste: 'Delicate floral sweetness, rapid velvety crystallization',
    benefits: 'High natural glucose for instant stamina, soothing for winter colds',
    icon: '🌼',
  },
  {
    id: 'babul',
    name: 'Desert Babul / Acacia',
    hindi: 'बबूल शहद',
    season: 'Late Spring (March – May)',
    region: 'Thar Desert Fringe & Pali Woodlands',
    color: 'Luminous Clear Amber',
    taste: 'Gentle, woody-sweet aroma with subtle herbal undertones',
    benefits: 'Low glycemic index, gentle on sensitive digestive tracts',
    icon: '🌳',
  },
  {
    id: 'ajwain',
    name: 'Ajwain & Fennel Blossom',
    hindi: 'अजवाइन व सौंफ शहद',
    season: 'Autumn (Sept – Nov)',
    region: 'Nagaur & Ajmer Cultivated Belts',
    color: 'Deep Amber with Reddish Glow',
    taste: 'Bold, spicy-sweet herbal punch with lingering warmth',
    benefits: 'Loaded with thymol; legendary Ayurvedic digestive and cough relief',
    icon: '🌿',
  },
  {
    id: 'wildforest',
    name: 'Wild Desert Polyflora',
    hindi: 'वन शहद',
    season: 'Monsoon Wild Harvest (July – Sept)',
    region: 'Aravalli Hills & Desert Shrubland',
    color: 'Dark Mahogany Honey',
    taste: 'Complex, molasses-like profile with earthy wildflower layers',
    benefits: 'Highest antioxidant score; deep cellular rejuvenation',
    icon: '🌺',
  },
];

const HARVEST_STEPS = [
  {
    step: '01',
    title: '100% Comb Ripening',
    subtitle: 'Waiting for the Bees to Seal with Wax',
    desc: 'Unlike commercial harvesters who strip unripe honey early, we wait until worker bees fan their wings for days and cap 100% of the honeycomb with pure white beeswax. This guarantees optimal enzymatic maturity.',
    icon: '🐝',
  },
  {
    step: '02',
    title: 'Calm, Smoke-Free Harvest',
    subtitle: 'Zero Harm to Colony Life',
    desc: 'We never use fire torches. Using gentle botanical cool smoke and soft bee-brushes, our trained beekeepers gently urge the bees aside, leaving all queen chambers, pollen reserves, and brood combs untouched.',
    icon: '🌿',
  },
  {
    step: '03',
    title: 'Cold Centrifugal Extraction',
    subtitle: 'Never Heated Above Hive Temperature',
    desc: 'The capped wax is gently uncapped with a cold knife and placed into manual stainless-steel centrifuges. The honey spins out naturally at ambient desert room temperature (never exceeding 35°C).',
    icon: '❄️',
  },
  {
    step: '04',
    title: 'Gravity Settling & Coarse Filter',
    subtitle: 'Keeping the Pollen Alive',
    desc: 'We pass the golden nectar only through food-grade mesh to catch stray wax particles. No micro-filters, no diatomaceous earth, no pressurized stripping. All bio-nutrients and pollen stay inside.',
    icon: '🍯',
  },
  {
    step: '05',
    title: 'NMR Certified Glass Bottling',
    subtitle: 'Sealed in UV-Shielded Glass',
    desc: 'Every batch undergoes rigorous lab testing for purity and moisture. The finished raw honey is hand-poured into heavy, non-reactive glass jars to preserve the delicate aromas and living enzymes forever.',
    icon: '🏺',
  },
];

const AboutPage = () => {
  const [selectedEraIndex, setSelectedEraIndex] = useState(0);
  const [activeScienceId, setActiveScienceId] = useState('enzymes');
  const [selectedFloraId, setSelectedFloraId] = useState('mustard');

  const selectedEra = ERAS[selectedEraIndex];
  const activeScience = SCIENCE_PILLARS.find((p) => p.id === activeScienceId) || SCIENCE_PILLARS[0];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden pb-24 pt-6 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Honey Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-200/40 via-yellow-100/30 to-orange-100/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1600px] right-0 w-[500px] h-[500px] bg-amber-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-20 sm:space-y-24">

        {/* ========================================================= */}
        {/* HERO SECTION: CINEMATIC STORYTELLING HOOK */}
        {/* ========================================================= */}
        <section className="text-center max-w-4xl mx-auto pt-6 sm:pt-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full honey-glass border border-amber-300/80 shadow-sm animate-[fadeIn_0.6s_ease-out]">
            <span className="text-sm">✨</span>
            <span className="text-xs font-black text-amber-950 uppercase tracking-widest">
              The Living Tale of Rajasthan Wild Hives
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-950 tracking-tight font-heading leading-[1.08]">
            Born from Grandmother’s Love. <br />
            <span className="honey-gradient-text">Perfected by Entomology Science.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-amber-950 max-w-3xl mx-auto leading-relaxed font-semibold">
            Step behind the jar into the golden Thar desert — where three generations of Ayurvedic reverence meet the doctoral honeybee research of Dr. Sitaram Seervi to deliver untouched, living honey.
          </p>

          {/* Quick Chapter Navigation Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => scrollToSection('chapter-saga')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>📜</span> <span>1. Origin Saga</span>
            </button>
            <button
              onClick={() => scrollToSection('chapter-science')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔬</span> <span>2. Living Enzymes</span>
            </button>
            <button
              onClick={() => scrollToSection('chapter-truth')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚖️</span> <span>3. Raw vs Commercial</span>
            </button>
            <button
              onClick={() => scrollToSection('chapter-terroir')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🌸</span> <span>4. Desert Terroir</span>
            </button>
            <button
              onClick={() => scrollToSection('chapter-harvest')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🍯</span> <span>5. The 5-Stage Harvest</span>
            </button>
            <button
              onClick={() => scrollToSection('chapter-founder')}
              className="px-4 py-2 rounded-full honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>👨‍🔬</span> <span>6. Founder Letter</span>
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 1: THE ORIGIN SAGA (INTERACTIVE TIMELINE JOURNEY) */}
        {/* ========================================================= */}
        <section id="chapter-saga" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300/80">
              Chapter 01 • The Origin Saga
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
              Four Milestones of Our Living Journey
            </h2>
            <p className="text-sm sm:text-base text-amber-950 font-medium">
              Click through each era to experience how a grandmother’s household remedy blossomed into Rajasthan’s leading ethical apiculture movement.
            </p>
          </div>

          {/* Interactive Timeline Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
            {ERAS.map((era, idx) => (
              <button
                key={era.id}
                onClick={() => setSelectedEraIndex(idx)}
                className={`px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap shadow-sm cursor-pointer ${
                  selectedEraIndex === idx
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105 ring-2 ring-amber-400/50'
                    : 'honey-glass text-amber-950 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <span className="text-base sm:text-lg">
                  {idx === 0 ? '👵' : idx === 1 ? '🔬' : idx === 2 ? '🐝' : '🍯'}
                </span>
                <span>{era.year}</span>
                <span className="hidden md:inline font-bold opacity-80 text-xs">
                  • {era.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Active Era Story Showcase Card */}
          <div className="honey-glass rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-amber-300/80 shadow-2xl relative overflow-hidden transition-all duration-500">
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${selectedEra.accent}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo & Quick Stat Column */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-100 aspect-4/3 sm:aspect-16/10 lg:aspect-square group">
                  <img
                    src={selectedEra.image}
                    alt={selectedEra.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent" />
                  
                  {/* Floating Stat Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-amber-300/80 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
                        Milestone Proof
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-amber-950 font-heading">
                        {selectedEra.stat.value}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
                      {selectedEra.stat.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Narrative Column */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider border border-amber-300">
                    {selectedEra.year} Era
                  </span>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-950 font-extrabold text-[11px] uppercase tracking-wider border border-orange-300">
                    {selectedEra.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 font-heading">
                    {selectedEra.title}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-amber-700 mt-1">
                    {selectedEra.subtitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  {selectedEra.story}
                </p>

                {/* Highlight Quote Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-l-4 border-amber-500 shadow-inner space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-amber-950 italic leading-relaxed">
                    {selectedEra.quote}
                  </p>
                  <p className="text-[11px] font-black text-amber-800 text-right">
                    {selectedEra.author}
                  </p>
                </div>

                {/* Tags & Timeline Navigation Arrows */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-amber-200/80">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEra.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-xl border border-amber-200"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedEraIndex((prev) => Math.max(0, prev - 1))}
                      disabled={selectedEraIndex === 0}
                      className="px-3 py-1.5 rounded-xl honey-glass border border-amber-300 font-bold text-xs text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-100 transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>❮ Previous Era</span>
                    </button>
                    <button
                      onClick={() => setSelectedEraIndex((prev) => Math.min(ERAS.length - 1, prev + 1))}
                      disabled={selectedEraIndex === ERAS.length - 1}
                      className="px-3 py-1.5 rounded-xl honey-glass border border-amber-300 font-bold text-xs text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-100 transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next Era ❯</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 2: THE SCIENCE OF LIVING HONEY */}
        {/* ========================================================= */}
        <section id="chapter-science" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300/80">
              Chapter 02 • Entomology & Biochemistry
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
              Why Raw Honey Must Be "Alive"
            </h2>
            <p className="text-sm sm:text-base text-amber-950 font-medium">
              Honey is not merely liquid sugar; it is a bio-active cocktail of live enzymes, raw pollen, and plant propolis. Explore the scientific pillars that commercial processing strips away.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Pillar Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {SCIENCE_PILLARS.map((pillar) => {
                const isActive = activeScienceId === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActiveScienceId(pillar.id)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-start gap-4 shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl scale-[1.02] border-amber-600'
                        : 'honey-glass hover:bg-amber-100/70 border-amber-200/80 text-amber-950'
                    }`}
                  >
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/20 shadow-inner flex-shrink-0">
                      {pillar.icon}
                    </span>
                    <div>
                      <h4 className="text-base sm:text-lg font-black font-heading leading-tight">
                        {pillar.title}
                      </h4>
                      <p className={`text-xs mt-1 font-medium ${isActive ? 'text-amber-100' : 'text-amber-800/80'}`}>
                        {pillar.headline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deep-Dive Scientific Metric Card */}
            <div className="lg:col-span-7 honey-glass rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-200/80">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeScience.icon}</span>
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">
                      Laboratory Parameter
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
                      {activeScience.title}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 flex items-center gap-1 shadow-xs">
                  <span>🔬</span> Tested Pure
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-amber-900 font-heading">
                  {activeScience.headline}
                </h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  {activeScience.detail}
                </p>
              </div>

              {/* Lab Test Verified Badge */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300/80 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
                    Aai Ji Honey NMR Lab Standard
                  </span>
                  <p className="text-sm sm:text-base font-black text-amber-950 mt-0.5">
                    {activeScience.labMetric}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span>✓</span>
                  <span>100% Retained</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 3: RAW VS COMMERCIAL INTERACTIVE COMPARISON */}
        {/* ========================================================= */}
        <section id="chapter-truth" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300/80">
              Chapter 03 • Consumer Awareness
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
              The Truth: Raw Honey vs. Supermarket Honey
            </h2>
            <p className="text-sm sm:text-base text-amber-950 font-medium">
              Most store-bought honey is commercially pasteurized and ultra-filtered into plain liquid sugar. See the clear scientific contrast.
            </p>
          </div>

          {/* Comparison Table / Cards */}
          <div className="honey-glass rounded-3xl border border-amber-200 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-amber-100/80 p-4 sm:p-5 border-b border-amber-200 font-black text-xs sm:text-sm uppercase tracking-wider text-amber-950">
              <div className="md:col-span-4 flex items-center gap-2">
                <span>🔍 Quality Factor</span>
              </div>
              <div className="md:col-span-4 text-red-800 flex items-center gap-1.5">
                <span>❌ Commercial Supermarket Honey</span>
              </div>
              <div className="md:col-span-4 text-emerald-800 flex items-center gap-1.5">
                <span>🍯 Aai Ji 100% Raw Living Honey</span>
              </div>
            </div>

            <div className="divide-y divide-amber-200/60">
              {COMPARISON_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-3 sm:gap-4 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="md:col-span-4">
                    <span className="font-black text-sm sm:text-base text-amber-950 block font-heading">
                      {item.feature}
                    </span>
                  </div>
                  <div className="md:col-span-4 bg-red-50/60 rounded-xl p-3 border border-red-200/70 text-xs sm:text-sm text-red-900">
                    <span className="font-bold block text-red-700 text-[10px] uppercase tracking-wider">Industrial Process</span>
                    {item.commercial}
                  </div>
                  <div className="md:col-span-4 bg-emerald-50/70 rounded-xl p-3 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-semibold shadow-xs">
                    <span className="font-black block text-emerald-700 text-[10px] uppercase tracking-wider">Aai Ji Standard</span>
                    {item.aaiji}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 4: RAJASTHAN BOTANICAL TERROIR */}
        {/* ========================================================= */}
        <section id="chapter-terroir" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300/80">
              Chapter 04 • Botanical Terroir
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
              Shaped by the Blossoms of Rajasthan
            </h2>
            <p className="text-sm sm:text-base text-amber-950 font-medium">
              Just like fine grapes yield distinct wines, each seasonal flower imparts unique color, aroma, and medicinal enzymes to our honey.
            </p>
          </div>

          {/* Flora Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RAJASTHAN_FLORA.map((flora) => {
              const isSelected = selectedFloraId === flora.id;
              return (
                <div
                  key={flora.id}
                  onClick={() => setSelectedFloraId(flora.id)}
                  className={`honey-glass rounded-3xl p-6 border transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between ${
                    isSelected
                      ? 'ring-4 ring-amber-400 border-amber-500 bg-amber-50/90 shadow-2xl scale-[1.03]'
                      : 'border-amber-200/80 hover:border-amber-400 hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{flora.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                        {flora.season}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-amber-950 font-heading">
                        {flora.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-700">{flora.hindi}</p>
                    </div>

                    <div className="space-y-2 text-xs text-gray-700 pt-2 border-t border-amber-200/70">
                      <p>
                        <strong className="text-amber-950">📍 Region:</strong> {flora.region}
                      </p>
                      <p>
                        <strong className="text-amber-950">🍯 Tone:</strong> {flora.color}
                      </p>
                      <p>
                        <strong className="text-amber-950">👃 Palate:</strong> {flora.taste}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-200/70 bg-amber-100/60 rounded-2xl p-2.5 text-[11px] text-amber-950 font-bold">
                    🌿 {flora.benefits}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 5: THE 5-STAGE ARTISANAL HARVEST */}
        {/* ========================================================= */}
        <section id="chapter-harvest" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300/80">
              Chapter 05 • The Sacred Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
              From Desert Bloom to Your Spoon
            </h2>
            <p className="text-sm sm:text-base text-amber-950 font-medium">
              A gentle, non-violent harvesting cycle that protects bee colonies, preserves live enzymes, and ensures zero processing shortcuts.
            </p>
          </div>

          {/* Sequential Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {HARVEST_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="honey-glass honey-glass-hover rounded-3xl p-5 border border-amber-200 shadow-md flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-xs font-black text-amber-500 font-heading">
                      STEP {step.step}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-amber-950 font-heading leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] font-bold text-amber-700">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-amber-200/70 flex items-center justify-between text-[10px] font-bold text-amber-800">
                  <span>Ethical Protocol</span>
                  <span>✓ 100% Certified</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 6: FOUNDER VISION & SCIENTIFIC COMMITMENT */}
        {/* ========================================================= */}
        <section id="chapter-founder" className="scroll-mt-24">
          <div className="honey-glass rounded-3xl p-8 sm:p-12 md:p-14 border-2 border-amber-300/90 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Founder Portrait Column */}
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-2xl">
                  <img
                    src="/Aai-ji-Honey-Founder.jpg"
                    alt="Dr. Sitaram Seervi"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/honey_founder_on work.jpeg';
                    }}
                    className="w-full h-full object-cover object-top rounded-full bg-amber-50 border-4 border-white shadow-md"
                  />
                  <span className="absolute bottom-2 right-4 text-3xl bg-white rounded-full p-1.5 shadow-md">
                    🎓
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-amber-950 font-heading">
                    Dr. Sitaram Seervi
                  </h3>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-0.5">
                    Ph.D. in Entomology • Founder & Apiculture Scientist
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-black text-amber-900">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                    Ph.D. Honeybee Ecology
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                    12+ Yrs Field Research
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300">
                    500+ Beekeepers Trained
                  </span>
                </div>
              </div>

              {/* Personal Letter Column */}
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  A Personal Note from the Founder
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 font-heading">
                  "When you preserve the life of the bee, nature returns the favor tenfold."
                </h3>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  Dear Reader,
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  Growing up in Rajasthan, honey was never something that came out of a plastic bottle. It was a holy household medicine nurtured by my grandmother, Aai Ji. When I earned my doctorate studying honeybee communication and pollination, I was heartbroken to witness the mass commercialization of honey across India — where high-heat pasteurization and imported corn syrups wiped out the medicinal heart of the hive.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  I created Aai Ji Honey with a singular pledge: <strong>No shortcuts. No heat. No syrups. Ever.</strong> Every jar is extracted with love, scientifically verified, and supports the livelihoods of hardworking rural beekeepers. When you taste our honey, you taste the true, living desert blossom.
                </p>

                <div className="pt-4 border-t border-amber-200/80 flex items-center justify-between">
                  <div>
                    <p className="font-heading font-black text-lg text-amber-950">Dr. Sitaram Seervi</p>
                    <p className="text-xs text-amber-800 font-semibold">Founder & Head Entomologist, Aai Ji Honey</p>
                  </div>
                  <span className="text-2xl">🍯✨</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CHAPTER 7: LIVING PROOF PHOTO REEL & GALLERY */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Live Apiary Glimpse
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
              Witness the Apiary with Your Own Eyes
            </h2>
            <p className="text-sm text-amber-950 font-medium">
              Explore authentic photographs captured straight from our ethical desert apiaries, wooden hive boxes, and seasonal blossom harvesting.
            </p>
          </div>

          <ImageGallery />
        </section>

        {/* ========================================================= */}
        {/* FINAL GOLDEN INVITATION CTA BANNER */}
        {/* ========================================================= */}
        <section className="max-w-5xl mx-auto pt-6">
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white text-center shadow-2xl relative overflow-hidden space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black uppercase tracking-widest">
              <span>🍯</span> <span>Fresh Rajasthan Harvest</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading leading-tight max-w-2xl mx-auto">
              Ready to Taste the Difference of True Living Honey?
            </h3>

            <p className="text-sm sm:text-base md:text-lg text-amber-100 max-w-xl mx-auto leading-relaxed font-medium">
              Order your jar of cold-extracted, unheated, single-origin raw honey today and bring authentic Rajasthan purity into your daily wellness ritual.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-950 font-black rounded-full shadow-2xl hover:shadow-amber-900/40 hover:bg-amber-50 transition-all duration-300 no-underline text-base transform hover:scale-105"
              >
                <span>🛒</span>
                <span>Explore Honey Products</span>
                <span>→</span>
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 bg-amber-900/40 hover:bg-amber-900/60 backdrop-blur-md text-white font-bold rounded-full border border-white/30 transition-all duration-300 no-underline text-sm"
              >
                <span>💬</span>
                <span>Speak to Our Apiary Team</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
