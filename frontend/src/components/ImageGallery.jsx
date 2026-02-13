// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// const ImageGallery = () => {
//   const images = [
//     'Aai-ji-Honey-BeeKeeping.jpg',
//     'Aai-ji-Honey-BeeKeeping2.jpg',
//     'Aai-ji-Honey-Beefarm.jpg',
//     'Aai-ji-honey-Poster.JPG',
//     'Aai-ji-Honey-Beefarm-Founder.jpg',
//     'Aai-ji-Honey-Gallery1.jpg',
//     'Aai-ji-Honey-Gallery2.jpg',
//     'Aai-ji-Honey-Gallery3.jpg',
//     'Aai-ji-Honey-Gallery4.jpg',
//   ]

//   return (
//     <div className="mt-12 px-4 md:px-8 md:max-w-6xl mx-auto w-100">
//       <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-amber-700">
//         Our Beekeeping Journey
//       </h2>
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         spaceBetween={20}
//         loop={true}
//         autoplay={{ delay: 3000 }}
//         navigation
//         pagination={{ clickable: true }}
//         slidesPerView={1}
//         centeredSlides={true}
//         className="max-w-4xl mx-auto rounded-xl overflow-hidden"
//       >
//         {images.map((src, index) => (
//           <SwiperSlide key={index}>
//             <img
//               src={src}
//               alt={`Beekeeping Image ${index + 1}`}
//               className="w-full h-[400px] object-contain drop-shadow-2xl rounded-xl"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//     </div>
//   )
// }

// export default ImageGallery


// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Pagination, Autoplay } from 'swiper/modules'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

// const ImageGallery = () => {
//   const images = [
//     'Aai-ji-Honey-BeeKeeping.jpg',
//     'Aai-ji-Honey-BeeKeeping2.jpg',
//     'Aai-ji-Honey-Beefarm.jpg',
//     'Aai-ji-honey-Poster.JPG',
//     'Aai-ji-Honey-Beefarm-Founder.jpg',
//     'Aai-ji-Honey-Gallery1.jpg',
//     'Aai-ji-Honey-Gallery2.jpg',
//     'Aai-ji-Honey-Gallery3.jpg',
//     'Aai-ji-Honey-Gallery4.jpg',
//   ]

//   return (
//     <div className="mt-12 px-4 md:px-8 md:max-w-6xl mx-auto w-100">
//       <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-amber-700">
//         Our Beekeeping Journey
//       </h2>
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         spaceBetween={20}
//         loop={true}
//         autoplay={{ delay: 3000 }}
//         navigation
//         pagination={{ clickable: true }}
//         slidesPerView={1}
//         centeredSlides={true}
//         className="max-w-4xl mx-auto rounded-xl overflow-hidden"
//       >
//         {images.map((src, index) => (
//           <SwiperSlide key={index}>
//             <img
//               src={src}
//               alt={`Beekeeping Image ${index + 1}`}
//               className="w-full h-[400px] object-contain drop-shadow-2xl rounded-xl"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>

//     </div>
//   )
// }

// export default ImageGallery
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const ImageGallery = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredSlide, setHoveredSlide] = useState(false);

  const images = [
    'Aai-ji-Honey-BeeKeeping.jpg',
    'Aai-ji-Honey-BeeKeeping2.jpg',
    'Aai-ji-Honey-Beefarm.jpg',
    'Aai-ji-honey-Poster.JPG',
    'Aai-ji-Honey-Beefarm-Founder.jpg',
    'Aai-ji-Honey-Gallery1.jpg',
    'Aai-ji-Honey-Gallery2.jpg',
    'Aai-ji-Honey-Gallery3.jpg',
    'Aai-ji-Honey-Gallery4.jpg',
  ]

  return (
    <div className={`
      relative w-full px-4 sm:px-6 md:px-8 py-12
      bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50
      rounded-3xl transition-all duration-1000
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
    `}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 opacity-20 rounded-3xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-block mb-4">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-800 font-semibold text-xs md:text-sm">
            📸 Gallery
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 mb-3">
          Our Beekeeping Journey
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-amber-700 max-w-2xl mx-auto">
          A visual story of passion, tradition, and sustainable beekeeping practices
        </p>

        {/* Decorative Divider */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <div className="h-1 w-8 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></div>
          <div className="h-1 w-16 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full animate-pulse"></div>
          <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Gallery Container */}
      <div className="relative w-full max-w-full lg:max-w-7xl mx-auto">
        {/* Swiper with Enhanced Styling */}
        <div 
          className="gallery-container rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200 bg-white transition-all duration-500 hover:shadow-3xl"
          onMouseEnter={() => setHoveredSlide(true)}
          onMouseLeave={() => setHoveredSlide(false)}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            loop={true}
            autoplay={{ 
              delay: 4000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              el: '.swiper-pagination-custom',
            }}
            slidesPerView={1}
            centeredSlides={true}
            className="w-full"
            speed={800}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index} className="flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-96 sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                  {/* Image Container with Animation */}
                  <div className={`
                    relative w-full h-full flex items-center justify-center
                    transition-all duration-500
                    ${hoveredSlide ? 'scale-100' : 'scale-100'}
                  `}>
                    <img
                      src={src}
                      alt={`Beekeeping Image ${index + 1}`}
                      className={`
                        w-full h-full object-contain
                        drop-shadow-2xl rounded-2xl
                        transition-all duration-700
                        max-w-full
                        ${hoveredSlide ? 'brightness-110' : 'brightness-100'}
                      `}
                      loading="lazy"
                    />

                    {/* Image Overlay on Hover */}
                    <div className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent
                      opacity-0 transition-opacity duration-500
                      ${hoveredSlide ? 'opacity-100' : 'opacity-0'}
                      pointer-events-none
                    `}></div>
                  </div>

                  {/* Image Counter */}
                  <div className={`
                    absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500
                    text-white px-4 py-2 rounded-full font-bold text-sm
                    transition-all duration-500
                    ${hoveredSlide ? 'scale-110 shadow-lg' : 'scale-100'}
                    shadow-md
                  `}>
                    {index + 1}/{images.length}
                  </div>

                  {/* Decorative Badge */}
                  <div className={`
                    absolute bottom-4 left-4 bg-white/90 backdrop-blur-md
                    text-amber-900 px-4 py-2 rounded-full font-semibold text-sm
                    transition-all duration-500
                    ${hoveredSlide ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                    shadow-lg
                  `}>
                    🐝 Swipe to explore
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group">
            <span className="text-xl font-bold transition-transform duration-300 group-hover:-translate-x-1">❮</span>
          </button>

          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group">
            <span className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1">❯</span>
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center items-center gap-3 py-6 px-4 bg-gradient-to-r from-amber-50 to-yellow-50 absolute bottom-0 left-0 right-0 z-10">
            {/* Pagination dots are dynamically inserted by Swiper */}
          </div>
        </div>

        {/* Info Section Below Gallery */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="group bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-amber-100 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2">
            <div className="text-3xl md:text-4xl mb-3 transition-transform duration-500 group-hover:scale-125">🐝</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2">Beekeeping</h3>
            <p className="text-sm text-gray-700">Sustainable and ethical beekeeping practices</p>
          </div>

          <div className="group bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-amber-100 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2" style={{ transitionDelay: '50ms' }}>
            <div className="text-3xl md:text-4xl mb-3 transition-transform duration-500 group-hover:scale-125">🌻</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2">Nature</h3>
            <p className="text-sm text-gray-700">Thriving in harmony with nature</p>
          </div>

          <div className="group bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-amber-100 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:-translate-y-2" style={{ transitionDelay: '100ms' }}>
            <div className="text-3xl md:text-4xl mb-3 transition-transform duration-500 group-hover:scale-125">🍯</div>
            <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2">Quality</h3>
            <p className="text-sm text-gray-700">Pure, natural, and premium honey</p>
          </div>
        </div>
      </div>

      {/* CSS Animations and Custom Styles */}
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

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Swiper Pagination Custom Styles */
        .swiper-pagination-custom {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          background: linear-gradient(to right, #fef3c7, #fef9e7) !important;
        }

        .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background: linear-gradient(135deg, #d97706, #f97316) !important;
          opacity: 0.5 !important;
          transition: all 0.3s ease !important;
          border-radius: 50% !important;
        }

        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #d97706, #f97316) !important;
          opacity: 1 !important;
          width: 32px !important;
          border-radius: 10px !important;
          box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4) !important;
        }

        /* Swiper Navigation Button Styles */
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          z-index: 20;
        }

        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          box-shadow: 0 8px 25px rgba(217, 119, 6, 0.3);
        }

        /* Hide default Swiper buttons */
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            width: 40px;
            height: 40px;
            font-size: 16px;
            left: auto;
            right: auto;
          }

          .swiper-button-prev-custom {
            left: 8px;
          }

          .swiper-button-next-custom {
            right: 8px;
          }
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(217, 119, 6, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d97706, #f97316);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b45309, #ea580c);
        }

        /* Fade effect animation */
        .swiper-fade .swiper-slide {
          transition-property: opacity;
        }

        .swiper-fade .swiper-slide-active {
          animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageGallery