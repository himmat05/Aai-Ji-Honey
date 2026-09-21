import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const galleryItems = [
  {
    src: '/honey_founder_on work.jpeg',
    title: 'Dr. Sitaram Seervi in the Field',
    tag: 'FOUNDER & ENTOMOLOGIST',
    desc: 'Inspecting honey supers and ensuring colonies maintain optimal natural health.',
  },
  {
    src: '/Aai-ji-Honey-BeeKeeping.jpg',
    title: 'Sustainable Desert Apiculture',
    tag: 'HIVE MANAGEMENT',
    desc: 'Traditional Rajasthan desert apiaries situated amidst seasonal flora.',
  },
  {
    src: '/Aai-ji-Honey-Beefarm.jpg',
    title: 'Pristine Apiary Landscape',
    tag: 'NATURAL ENVIRONMENT',
    desc: 'Chemical-free rural environments far away from industrial pollution.',
  },
  {
    src: '/honey_box_board.jpeg',
    title: 'Handcrafted Wooden Hive Boxes',
    tag: 'ETHICAL HOUSING',
    desc: 'Eco-friendly, chemical-free wooden hives designed for bee welfare.',
  },
  {
    src: '/honey_box.jpeg',
    title: 'Bee Hive Super Frames',
    tag: 'COLONY CARE',
    desc: 'Carefully aligned comb frames where worker bees build natural wax hexagonal cells.',
  },
  {
    src: '/honey_box2.jpeg',
    title: 'Golden Honeycomb Ripening',
    tag: 'NATURAL HARVEST',
    desc: 'Bees fan their wings to reduce nectar moisture naturally below 18%.',
  },
  {
    src: '/honey_box3.jpeg',
    title: 'Capped Raw Honeycombs',
    tag: 'READY HARVEST',
    desc: '100% sealed honey cells ready for cold centrifugal gentle extraction.',
  },
  {
    src: '/Aai-ji-Honey-BeeKeeping2.jpg',
    title: 'Traditional Hive Handling',
    tag: 'BEEKEEPING HERITAGE',
    desc: 'Harm-free, calm smoke harvesting respecting the life of every single bee.',
  },
  {
    src: '/Aai-ji-Honey-Beefarm-Founder.jpg',
    title: 'Farmer Training Program',
    tag: 'COMMUNITY EMPOWERMENT',
    desc: 'Training local Rajasthani tribal farmers in modern apiculture and sustainability.',
  },
  {
    src: '/Aai-ji-Honey-Gallery1.jpg',
    title: 'Raw Nectar Flow',
    tag: 'COLD EXTRACTION',
    desc: 'Unheated, unfiltered golden honey flowing straight from centrifuge to glass jars.',
  },
  {
    src: '/Aai-ji-Honey-Gallery2.jpg',
    title: 'Fresh Comb Inspection',
    tag: 'QUALITY ASSURANCE',
    desc: 'Checking pollen density, color hue, and natural organic purity.',
  },
  {
    src: '/Aai-ji-Honey-Gallery3.jpg',
    title: 'Rajasthan Flora Pollination',
    tag: 'BIODIVERSITY',
    desc: 'Bees pollinating mustard, ber, and desert wildflowers across rural Rajasthan.',
  },
  {
    src: '/Aai-ji-Honey-Gallery4.jpg',
    title: 'UV-Shielded Glass Jar Bottling',
    tag: 'HYGIENIC PACKAGING',
    desc: 'Sealed raw without pasteurization to retain all living enzymes and antioxidants.',
  },
  {
    src: '/Aai-ji-honey-Poster.JPG',
    title: 'Aai Ji Honey Brand Heritage',
    tag: 'PURITY PROMISE',
    desc: 'Rooted in grandmother tradition and certified with rigorous laboratory testing.',
  },
];

const ImageGallery = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const thumbnailContainerRef = useRef(null);

  // Auto-scroll thumbnail strip horizontally to center active thumb (WITHOUT scrolling the entire page)
  useEffect(() => {
    if (thumbnailContainerRef.current && activeIndex > 0) {
      const container = thumbnailContainerRef.current;
      const activeThumb = container.children[activeIndex];
      if (activeThumb) {
        const targetScrollLeft =
          activeThumb.offsetLeft - container.clientWidth / 2 + activeThumb.clientWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex]);

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowRight' && swiperInstance) swiperInstance.slideNext();
      if (e.key === 'ArrowLeft' && swiperInstance) swiperInstance.slidePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [swiperInstance]);

  return (
    <div className="w-full max-w-full overflow-hidden box-border">
      
      {/* Gallery Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <span>📸</span> Apiary Gallery
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading tracking-tight">
          Our Beekeeping Journey
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-amber-900/80 font-medium">
          A visual story of desert apiculture, ethical harvesting, and sustainable honeycraft.
        </p>
      </div>

      {/* Main Gallery Stage Container */}
      <div className="honey-glass rounded-3xl p-3 sm:p-5 border border-amber-200/80 shadow-2xl relative w-full max-w-5xl mx-auto overflow-hidden">
        
        {/* Main Swiper Display */}
        <div className="relative rounded-2xl overflow-hidden bg-amber-950/90 h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            speed={600}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {galleryItems.map((item, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full select-none">
                
                {/* Ambient Blurred Background (Solves resolution/orientation differences smoothly) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover filter blur-2xl opacity-35 scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30"></div>
                </div>

                {/* Foreground Contained Image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-8">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain rounded-xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] cursor-zoom-in hover:scale-102 transition-transform duration-300"
                    onClick={() => setLightboxImage(item)}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Top Badge: Category & Counter */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shadow">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setLightboxImage(item)}
                    className="w-8 h-8 rounded-full bg-black/50 hover:bg-amber-500 text-white flex items-center justify-center text-xs backdrop-blur-md transition-colors shadow"
                    title="View Full Resolution"
                  >
                    🔍
                  </button>
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-200 font-bold text-xs shadow">
                    {idx + 1} / {galleryItems.length}
                  </span>
                </div>

                {/* Bottom Overlay Title & Description */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
                  <div className="max-w-2xl">
                    <h3 className="text-base sm:text-xl md:text-2xl font-black font-heading tracking-tight drop-shadow">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-200/90 line-clamp-2 mt-1 drop-shadow font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>

              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls (Positioned cleanly inside bounds) */}
          <button
            onClick={() => swiperInstance && swiperInstance.slidePrev()}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 active:scale-95"
            aria-label="Previous photo"
          >
            <span className="text-base sm:text-lg font-bold">❮</span>
          </button>

          <button
            onClick={() => swiperInstance && swiperInstance.slideNext()}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 active:scale-95"
            aria-label="Next photo"
          >
            <span className="text-base sm:text-lg font-bold">❯</span>
          </button>

        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="mt-4 pt-3 border-t border-amber-200/80">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Photo Reel ({galleryItems.length} photos)
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              Click photo or thumbnail to jump
            </span>
          </div>

          <div
            ref={thumbnailContainerRef}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-400 no-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {galleryItems.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => swiperInstance && swiperInstance.slideToLoop(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                    isActive
                      ? 'border-amber-500 ring-2 ring-amber-400/80 scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-amber-300'
                  }`}
                  aria-label={`Jump to ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-amber-500/10 pointer-events-none"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Info Pills Below Gallery */}
      <div className="mt-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
        <div className="honey-glass rounded-2xl p-4 text-center border border-amber-200/70 shadow-sm flex items-center justify-center gap-3">
          <span className="text-2xl">🐝</span>
          <div className="text-left">
            <h4 className="text-xs font-bold text-amber-950">Ethical Apiculture</h4>
            <p className="text-[11px] text-amber-700">Zero bee colony disruption</p>
          </div>
        </div>
        <div className="honey-glass rounded-2xl p-4 text-center border border-amber-200/70 shadow-sm flex items-center justify-center gap-3">
          <span className="text-2xl">🌻</span>
          <div className="text-left">
            <h4 className="text-xs font-bold text-amber-950">Wildflower Foraging</h4>
            <p className="text-[11px] text-amber-700">Mustard, Ajwain & Desert flora</p>
          </div>
        </div>
        <div className="honey-glass rounded-2xl p-4 text-center border border-amber-200/70 shadow-sm flex items-center justify-center gap-3">
          <span className="text-2xl">🏺</span>
          <div className="text-left">
            <h4 className="text-xs font-bold text-amber-950">Unheated Bottling</h4>
            <p className="text-[11px] text-amber-700">Retaining live raw enzymes</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 sm:right-2 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* High Res Image */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-amber-500/40 shadow-2xl max-h-[75vh] flex items-center justify-center">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>

            {/* Lightbox Caption */}
            <div className="mt-4 text-center text-white space-y-1 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-[10px] font-black uppercase tracking-wider inline-block">
                {lightboxImage.tag}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-heading">
                {lightboxImage.title}
              </h3>
              <p className="text-xs text-amber-200/80">
                {lightboxImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageGallery;
