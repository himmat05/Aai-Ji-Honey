// import React from 'react'
// import HoneyBeeBackground from './HoneyBeeBackground';


// const Contact = () => {

//   return (
//     <div className="font-sans text-gray-800 bg-gradient-to-br from-yellow-100 via-white/80 to-amber-100 mt-[-25px] h-full">
//       <HoneyBeeBackground />
//       <div className="flex justify-center items-center ">
//         <h1 className="text-3xl md:text-5xl font-bold tracking-wide mt-10 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 drop-shadow-lg">
//           Get in Touch With Our Team
//         </h1>
//       </div>

//       <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50'>
//         {/* {card 1} */}
//         <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Sitaram Seervi</h1>
//           <div className='flex flex-row items-center justify-center mb-3 border-b-2 border-gray-300 pb-3'>
//             <div className='flex flex-col items-center justify-center mr-3'>
//               <img className="w-25 rounded-full" src="Aai-ji-Honey-Founder.jpg" alt="Founder" />
//               <h1 className="font-bold">Founder</h1>
//             </div>
//             <div>
//               <li>Ph.D. in Entomology</li>
//               <li>Apiculture</li>
//               <li>Beekeeping Expert</li>
//             </div>
//           </div>
//           <div>
//             <h2 className="flex items-center justify-center">
//               <span className="material-symbols-outlined"> mail </span> aaijihoney24@gmail.com
//             </h2>
//           </div>
//         </div>


//         {/* {card 2} */}
//         <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Naveen Jangir</h1>
//           <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
//             <div className='flex flex-col items-center justify-center mr-4 pb-3 ml-4'>
//               <img className="w-30 rounded-full h-28" src="\Aai-ji-Honey-CEO.jpg" alt="CEO" />
//               <h1 className="font-bold">CEO</h1>
//             </div>
//             <div>
//               <li>Ph.D in Entomology</li>
//               <li>Specilaized in Apiculture</li>
//               <li>6+ years of Field & Research Experience</li>
//             </div>
//           </div>
//           <div className='p-3'>
//             <h2 className="flex items-center justify-center">
//               <span className="material-symbols-outlined"> mail </span> jangir000naveen@gmail.com
//             </h2>
//           </div>
//         </div>
//       </div>


//       <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50 mt-[-10px]'>
//         {/* {card 3} */}
//         <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Neha Tomar</h1>
//           <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
//             <div className='flex flex-col items-center justify-center mr-3 w-50'>
//               <img className="w-25 rounded-full h-28 mr-2 ml-[-2px]" src="Aai-ji-Honey-HR.jpg" alt="Human resources" />
//               <h1 className="font-bold pl-4 w-40">Human Resources</h1>
//             </div>
//             <div>
//               <li>Agriculture Business Management (ABM)</li>
//             </div>
//           </div>
//           <div className='p-2'>
//             <h2 className="flex items-center justify-center pt-2">
//               <span className="material-symbols-outlined"> mail </span> nehatomar5557@gmail.com
//             </h2>
//           </div>
//         </div>

//         {/* {card 4} */}
//         <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Mr. Bhanwar Lal Bhayal</h1>
//           <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
//             <div className='flex flex-col items-center justify-center pr-3 pb-3'>
//               <img className="w-25 rounded-full h-28" src="Aai-ji-Honey-General-manager.jpg" alt="Human resources" />
//               <h1 className="font-bold">General Manager</h1>
//             </div>
//             <div>
//               <li className='pr-10'>M-com</li>
//               <li>2+ Years Experience</li>
//             </div>
//           </div>
//           <div className='p-3'>
//             <h2 className="flex items-center justify-center">
//               <span className="material-symbols-outlined"> mail </span> pipliahiran@gmail.com
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* {card 5} */}
//       <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50 mt-[-10px]'>
//         <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
//           <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Mr.Sobha Lal</h1>
//           <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
//             <div className='flex flex-col items-center justify-center mr-3 w-50'>
//               <img className="w-25 rounded-full h-28 ml-2" src="Aai-ji-Honey-Account.jpg" alt="Accountant" />
//               <h1 className="font-bold pl-4 w-20 ml-[-6px] pr-2">Accountant</h1>
//             </div>
//             <div>
//               <li>Specialized in Accountant & Tax Consultant</li>
//               <li>3+ Years of Experience</li>
//             </div>
//           </div>
//           <div className='p-2'>
//             <h2 className="flex items-center justify-center pt-2">
//               <span className="material-symbols-outlined"> mail </span> truebaladvisors@gmail.com
//             </h2>
//           </div>
//         </div>
//       </div>

//       {/* contact information */}
//       <div>
//         <h1 className="text-2xl font-bold text-center mt-6">Contact Us :</h1>
//         <p className="text-center font-bold text-gray-600 mb-4">For inquiries, feedback, or support, reach out to us at:</p>
//         <div className='flex items-center justify-center gap-4 mb-6'>
//           <h1 className='font-bold ml-3'>Head Offfice :<p className='font-light ml-6'>426,Aai mata colony, Megakheda,Post-Pipli Ahiran,Teh-Kunwariya,Dist-Rajsamand,Rajasthan, PIN-313327,India.</p></h1>
//         </div>
//         <div className="font-bold flex items-center justify-center gap-4 mb-6">
//           <h1 className='font-bold ml-3'>Branch Office :<p className='font-light ml-6'>Plot no 206, Indra Gandhi Nagar, L-Block, Sector 14, Hiran Magri, Gordhan Vilas Rural, udaipur, Rajasthan, PIN-313001, India</p></h1>
//         </div >
//         <div className="font-bold ml-3 flex items-center justify-center gap-4 mb-6">
//           Contact Number : <span className='font-bold ml-3'>+91-9610047740 , +91-9887918251</span>
//         </div>

//         <div className="w-full h-[200px] px-4 pb-8 flex items-center justify-center ">
//           <iframe
//             title="Aai Mata Colony Map"
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.2806644901734!2d73.1799!3d24.5282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967f4c8e672cfd9%3A0xd2c8a2ff1e3e0df0!2sPipli%20Ahiran%2C%20Rajasthan%20313327!5e0!3m2!1sen!2sin!4v1721301940550!5m2!1sen!2sin"
//             width="50%"
//             height="100%"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           />

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Contact

import React, { useState, useEffect } from 'react'

const Contact = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cardData = [
    {
      id: 1,
      name: "Dr. Sitaram Seervi",
      role: "Founder",
      emoji: "👨‍🔬",
      image: "Aai-ji-Honey-Founder.jpg",
      expertise: "Ph.D. in Entomology, Apiculture, Beekeeping Expert",
      email: "aaijihoney24@gmail.com",
      borderColor: "border-yellow-500",
      bgColor: "from-yellow-500 to-amber-400",
      accentBg: "bg-yellow-50"
    },
    {
      id: 2,
      name: "Dr. Naveen Jangir",
      role: "CEO",
      emoji: "🏆",
      image: "Aai-ji-Honey-CEO.jpg",
      expertise: "Ph.D in Entomology, Specialized in Apiculture, 6+ years Experience",
      email: "jangir000naveen@gmail.com",
      borderColor: "border-orange-500",
      bgColor: "from-orange-500 to-yellow-500",
      accentBg: "bg-orange-50"
    },
    {
      id: 3,
      name: "Dr. Neha Tomar",
      role: "Human Resources",
      emoji: "👥",
      image: "Aai-ji-Honey-HR.jpg",
      expertise: "Agriculture Business Management (ABM)",
      email: "nehatomar5557@gmail.com",
      borderColor: "border-yellow-500",
      bgColor: "from-yellow-500 to-amber-400",
      accentBg: "bg-yellow-50"
    },
    {
      id: 4,
      name: "Mr. Bhanwar Lal Bhayal",
      role: "General Manager",
      emoji: "⚙️",
      image: "Aai-ji-Honey-General-manager.jpg",
      expertise: "M.Com, 2+ Years Experience",
      email: "pipliahiran@gmail.com",
      borderColor: "border-amber-500",
      bgColor: "from-amber-500 to-yellow-500",
      accentBg: "bg-amber-50"
    },
    {
      id: 5,
      name: "Mr. Sobha Lal",
      role: "Accountant",
      emoji: "💼",
      image: "Aai-ji-Honey-Account.jpg",
      expertise: "Specialist in Accounting & Tax Consultant, 3+ Years Experience",
      email: "truebaladvisors@gmail.com",
      borderColor: "border-orange-500",
      bgColor: "from-orange-500 to-amber-500",
      accentBg: "bg-orange-50"
    }
  ];

  const ContactCard = ({ card, index }) => {
    const isHovered = hoveredCard === card.id;
    const animationDelay = index * 100;

    return (
      <div
        className={`
          relative bg-white rounded-3xl shadow-lg overflow-hidden 
          border-t-4 ${card.borderColor}
          transition-all duration-500 ease-out
          ${isHovered ? 'shadow-2xl scale-105 -translate-y-2' : 'hover:shadow-xl'}
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          transform
        `}
        style={{
          transitionDelay: isVisible ? `${animationDelay}ms` : '0ms'
        }}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Animated gradient bar */}
        <div className={`h-1 bg-gradient-to-r ${card.bgColor} animate-pulse`}></div>

        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="p-8 relative z-10">
          {/* Profile Image Section with animation */}
          <div className="flex justify-center mb-6 relative">
            <div className={`
              absolute inset-0 rounded-full blur-2xl opacity-0 transition-all duration-500
              ${isHovered ? 'opacity-30' : 'opacity-0'}
              `}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`,
                animation: isHovered ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
              }}
            ></div>
            <img
              className={`
                w-32 h-32 rounded-full border-4 ${card.borderColor} shadow-xl object-cover
                transition-all duration-500
                ${isHovered ? 'ring-4 ring-offset-2 ring-yellow-300' : ''}
              `}
              src={card.image}
              alt={card.name}
              style={{
                animation: isHovered ? 'float 3s ease-in-out infinite' : 'none'
              }}
            />
          </div>

          {/* Name and Role */}
          <div className="text-center mb-4">
            <h3 className={`
              text-2xl font-bold text-amber-900 mb-2 transition-all duration-500
              ${isHovered ? 'text-transparent bg-clip-text bg-gradient-to-r ' + card.bgColor : ''}
            `}>
              {card.name}
            </h3>
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold mb-3">
              <span className="text-2xl">{card.emoji}</span>
              <p className="text-lg">{card.role}</p>
            </div>
          </div>

          {/* Divider */}
          <div className={`
            h-0.5 bg-gradient-to-r ${card.bgColor} my-4 rounded-full
            transition-all duration-500
            ${isHovered ? 'h-1 shadow-lg' : 'h-0.5'}
          `}></div>

          {/* Expertise Box */}
          <div className={`
            ${card.accentBg} rounded-xl p-4 mb-6 
            border-l-4 ${card.borderColor}
            transition-all duration-500
            ${isHovered ? 'border-l-8 shadow-md' : ''}
          `}>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="block mb-2">✓ Expertise:</strong>
              {card.expertise}
            </p>
          </div>

          {/* Email Section with hover effect */}
          <div className={`
            flex items-center justify-center gap-2 text-amber-900 font-semibold
            p-3 rounded-lg transition-all duration-500
            ${isHovered ? `bg-gradient-to-r ${card.bgColor} text-white shadow-lg` : 'hover:bg-gray-50'}
          `}>
            <span className="text-xl transition-transform duration-500" style={{
              animation: isHovered ? 'bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none'
            }}>
              ✉️
            </span>
            <a
              href={`mailto:${card.email}`}
              className="hover:underline transition-all duration-300"
            >
              {card.email}
            </a>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className={`h-1 bg-gradient-to-r ${card.bgColor}`}></div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-br from-yellow-50 via-white to-amber-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-12">
        <div className={`
          flex justify-center items-center flex-col
          transition-all duration-1000
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <h1 className="text-5xl md:text-6xl font-bold tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center mb-2">
            Meet Our Expert Team
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mb-4 animate-pulse"></div>
        </div>
      </div>

      {/* Team Cards Grid - Symmetric Layout */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cardData.map((card, idx) => (
              <div key={card.id} className="w-full flex justify-center">
                <div className="w-full max-w-sm">
                  <ContactCard card={card} index={idx} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section - Symmetric */}
      <section className={`
        relative z-10 mt-20 px-6 pb-20
        transition-all duration-1000
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
            Contact Information
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mx-auto mb-12 animate-pulse"></div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Head Office */}
            <div className={`
              group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-amber-500
              transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2
              animate-fadeIn
            `}
              style={{ animationDelay: '700ms' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">🏢</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Head Office</h3>
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    426, Aai Mata Colony, Megakheda, Post-Pipli Ahiran, Teh-Kunwariya, Dist-Rajsamand, Rajasthan, PIN-313327, India.
                  </p>
                </div>
              </div>
              <div className="h-0.5 bg-gradient-to-r from-amber-500 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Branch Office */}
            <div className={`
              group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-500
              transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2
              animate-fadeIn
            `}
              style={{ animationDelay: '800ms' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">🏪</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Branch Office</h3>
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    Plot no 206, Indra Gandhi Nagar, L-Block, Sector 14, Hiran Magri, Gordhan Vilas Rural, Udaipur, Rajasthan, PIN-313001, India
                  </p>
                </div>
              </div>
              <div className="h-0.5 bg-gradient-to-r from-orange-500 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Contact Numbers - Full Width */}
          <div className={`
            group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-yellow-500
            transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2
            animate-fadeIn
          `}
            style={{ animationDelay: '900ms' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">📱</span>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Contact Numbers</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                    <span>📞</span>
                    <a
                      href="tel:+919610047740"
                      className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                    >
                      +91-9610047740
                    </a>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
                    <span>📞</span>
                    <a
                      href="tel:+919887918251"
                      className="text-gray-700 hover:text-orange-600 font-semibold transition-colors"
                    >
                      +91-9887918251
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={`
        relative z-10 mt-12 px-6 pb-20
        transition-all duration-1000
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
        style={{ transitionDelay: '1000ms' }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">
            Find Us on Map
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full mx-auto mb-12 animate-pulse"></div>

          <div className={`
            rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200
            transition-all duration-700 hover:shadow-3xl hover:scale-105 hover:-translate-y-4
            group
          `}>
            <div className="relative bg-gradient-to-br from-yellow-100 to-amber-100 h-96 flex items-center justify-center">
              <iframe
                title="Aai Mata Colony Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.2806644901734!2d73.1799!3d24.5282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967f4c8e672cfd9%3A0xd2c8a2ff1e3e0df0!2sPipli%20Ahiran%2C%20Rajasthan%20313327!5e0!3m2!1sen!2sin!4v1721301940550!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:brightness-110 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}

export default Contact