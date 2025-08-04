import React from 'react'
import HoneyBeeBackground from './HoneyBeeBackground';


const Contact = () => {

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-br from-yellow-100 via-white/80 to-amber-100 mt-[-25px] h-full">
      <HoneyBeeBackground />
      <div className="flex justify-center items-center ">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide mt-10 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 drop-shadow-lg">
          Get in Touch With Our Team
        </h1>
      </div>

      <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50'>
        {/* {card 1} */}
        <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Sitaram Seervi</h1>
          <div className='flex flex-row items-center justify-center mb-3 border-b-2 border-gray-300 pb-3'>
            <div className='flex flex-col items-center justify-center mr-3'>
              <img className="w-25 rounded-full" src="Aai-ji-Honey-Founder.jpg" alt="Founder" />
              <h1 className="font-bold">Founder</h1>
            </div>
            <div>
              <li>Ph.D. in Entomology</li>
              <li>Apiculture</li>
              <li>Beekeeping Expert</li>
            </div>
          </div>
          <div>
            <h2 className="flex items-center justify-center">
              <span className="material-symbols-outlined"> mail </span> aaijihoney24@gmail.com
            </h2>
          </div>
        </div>


        {/* {card 2} */}
        <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Naveen Jangir</h1>
          <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
            <div className='flex flex-col items-center justify-center mr-4 pb-3 ml-4'>
              <img className="w-30 rounded-full h-28" src="\Aai-ji-Honey-CEO.jpg" alt="CEO" />
              <h1 className="font-bold">CEO</h1>
            </div>
            <div>
              <li>Ph.D in Entomology</li>
              <li>Specilaized in Apiculture</li>
              <li>6+ years of Field & Research Experience</li>
            </div>
          </div>
          <div className='p-3'>
            <h2 className="flex items-center justify-center">
              <span className="material-symbols-outlined"> mail </span> jangir000naveen@gmail.com
            </h2>
          </div>
        </div>
      </div>


      <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50 mt-[-10px]'>
        {/* {card 3} */}
        <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Dr. Neha Tomar</h1>
          <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
            <div className='flex flex-col items-center justify-center mr-3 w-50'>
              <img className="w-25 rounded-full h-28 mr-2 ml-[-2px]" src="Aai-ji-Honey-HR.jpg" alt="Human resources" />
              <h1 className="font-bold pl-4 w-40">Human Resources</h1>
            </div>
            <div>
              <li>Agriculture Business Management (ABM)</li>
            </div>
          </div>
          <div className='p-2'>
            <h2 className="flex items-center justify-center pt-2">
              <span className="material-symbols-outlined"> mail </span> nehatomar5557@gmail.com
            </h2>
          </div>
        </div>

        {/* {card 4} */}
        <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Mr. Bhanwar Lal Bhayal</h1>
          <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
            <div className='flex flex-col items-center justify-center pr-3 pb-3'>
              <img className="w-25 rounded-full h-28" src="Aai-ji-Honey-General-manager.jpg" alt="Human resources" />
              <h1 className="font-bold">General Manager</h1>
            </div>
            <div>
              <li className='pr-10'>M-com</li>
              <li>2+ Years Experience</li>
            </div>
          </div>
          <div className='p-3'>
            <h2 className="flex items-center justify-center">
              <span className="material-symbols-outlined"> mail </span> pipliahiran@gmail.com
            </h2>
          </div>
        </div>
      </div>

      {/* {card 5} */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-6 p-6 md:gap-50 mt-[-10px]'>
        <div className="items-center justify-center drop-shadow-2xl w-80 h-55 rounded-lg bg-white shadow-lg m-6  hover:transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h1 className="text-xl font-bold bg-orange-400 rounded-t-lg pl-1.5 mt-[-24px] w-full mb-2">Mr.Sobha Lal</h1>
          <div className='flex flex-row items-center justify-center border-b-2 border-gray-300 pb-2'>
            <div className='flex flex-col items-center justify-center mr-3 w-50'>
              <img className="w-25 rounded-full h-28 ml-2" src="Aai-ji-Honey-Account.jpg" alt="Accountant" />
              <h1 className="font-bold pl-4 w-20 ml-[-6px] pr-2">Accountant</h1>
            </div>
            <div>
              <li>Specialized in Accountant & Tax Consultant</li>
              <li>3+ Years of Experience</li>
            </div>
          </div>
          <div className='p-2'>
            <h2 className="flex items-center justify-center pt-2">
              <span className="material-symbols-outlined"> mail </span> truebaladvisors@gmail.com
            </h2>
          </div>
        </div>
      </div>

      {/* contact information */}
      <div>
        <h1 className="text-2xl font-bold text-center mt-6">Contact Us :</h1>
        <p className="text-center font-bold text-gray-600 mb-4">For inquiries, feedback, or support, reach out to us at:</p>
        <div className='flex items-center justify-center gap-4 mb-6'>
          <h1 className='font-bold ml-3'>Head Offfice :<p className='font-light ml-6'>426,Aai mata colony, Megakheda,Post-Pipli Ahiran,Teh-Kunwariya,Dist-Rajsamand,Rajasthan, PIN-313327,India.</p></h1>
        </div>
        <div className="font-bold flex items-center justify-center gap-4 mb-6">
          <h1 className='font-bold ml-3'>Branck Office :<p className='font-light ml-6'>Plot no 206, Indra Gandhi Nagar, L-Block, Sector 14, Hiran Magri, Gordhan Vilas Rural, udaipur, Rajasthan, PIN-313001, India</p></h1>
        </div >
        <div className="font-bold ml-3 flex items-center justify-center gap-4 mb-6">
          Contact Number : <span className='font-bold ml-3'>+91-9610047740 , +91-9887918251</span>
        </div>

        <div className="w-full h-[200px] px-4 pb-8 flex items-center justify-center ">
          <iframe
            title="Aai Mata Colony Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.2806644901734!2d73.1799!3d24.5282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967f4c8e672cfd9%3A0xd2c8a2ff1e3e0df0!2sPipli%20Ahiran%2C%20Rajasthan%20313327!5e0!3m2!1sen!2sin!4v1721301940550!5m2!1sen!2sin"
            width="50%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>
      </div>
    </div>
  )
}

export default Contact
