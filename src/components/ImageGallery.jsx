import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const ImageGallery = () => {
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
    <div className="mt-12 px-4 md:px-8 md:max-w-6xl mx-auto w-100">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-amber-700">
        Our Beekeeping Journey
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        centeredSlides={true}
        className="max-w-4xl mx-auto rounded-xl overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`Beekeeping Image ${index + 1}`}
              className="w-full h-[400px] object-contain drop-shadow-2xl rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  )
}

export default ImageGallery
