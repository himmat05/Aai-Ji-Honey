// import React from 'react'

// const Footer = () => {
//     return (
//         <div className='bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 text-white p-4 flex items-center w-full h-20 shadow-xl drop-shadow-2xl justify-between'>
//             <div className='flex space-x-2 justify-center items-center'>
//                 <a href='https://www.facebook.com/share/186fGU4Yb6/'><img src='vecteezy_facebook-logo-png-facebook-icon-transparent-white-background_41643208.png' className='w-13 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-2xl' /></a>
//                 <a href='https://www.instagram.com/aaijihoney24?utm_source=ig_web_button_share_sheet&igsh=Z25laGJnYmJoaWVq'><img className='w-9 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-xl' src='Instagram_icon.png' alt='Insta' /></a>
//                 <a href='https://youtu.be/tDlWHE-kL7w?si=rR2utLe3EJ5QQlbN'><img src='vecteezy_youtube-logo-png-youtube-logo-transparent-png-youtube-icon_23986480.png'  className='w-12 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-2xl' /></a>
//             </div>
//             <div>
//                 <ul>
//                     <li>&copy; {new Date().getFullYear()} Aai Ji Honey.</li>
//                 </ul>
//             </div>
//         </div>
//     )
// }

// export default Footer


import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-8 shadow-2xl'>
            <div className="max-w-7xl mx-auto px-6">
                <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                    
                    {/* Left Section - Branding */}
                    <div className='flex items-center gap-4'>
                        <img 
                            src='Aai ji honey.jpg' 
                            alt='Aai Ji Honey Logo'
                            className='w-16 h-16 p-2 rounded-full bg-white shadow-lg'
                        />
                        <div>
                            <h3 className='text-xl font-bold'>Aai Ji Honey</h3>
                            <p className='text-amber-200 text-sm'>Pure • Natural • Fresh</p>
                        </div>
                    </div>

                    {/* Center Section - Social Links */}
                    <div className='flex space-x-6 items-center'>
                        <a 
                            href='https://www.facebook.com/share/186fGU4Yb6/' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:scale-125 transition-transform duration-300 hover:drop-shadow-2xl'
                            title='Follow us on Facebook'
                        >
                            <img 
                                src='vecteezy_facebook-logo-png-facebook-icon-transparent-white-background_41643208.png' 
                                alt='Facebook'
                                className='w-12'
                            />
                        </a>
                        <a 
                            href='https://www.instagram.com/aaijihoney24?utm_source=ig_web_button_share_sheet&igsh=Z25laGJnYmJoaWVq' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:scale-125 transition-transform duration-300 hover:drop-shadow-2xl'
                            title='Follow us on Instagram'
                        >
                            <img 
                                className='w-10' 
                                src='/Instagram_icon.png' 
                                alt='Instagram' 
                            />
                        </a>
                        <a 
                            href='https://youtu.be/tDlWHE-kL7w?si=rR2utLe3EJ5QQlbN' 
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:scale-125 transition-transform duration-300 hover:drop-shadow-2xl'
                            title='Watch us on YouTube'
                        >
                            <img 
                                src='/vecteezy_youtube-logo-png-youtube-logo-transparent-png-youtube-icon_23986480.png'
                                alt='YouTube'
                                className='w-12'
                            />
                        </a>
                    </div>

                    {/* Right Section - Copyright */}
                    <div className='text-right'>
                        <p className='font-semibold mb-2'>© {currentYear} Aai Ji Honey</p>
                        <p className='text-amber-200 text-sm'>All rights reserved</p>
                    </div>
                </div>

                {/* Bottom Divider */}
                <div className='mt-8 pt-8 border-t-2 border-orange-700'>
                    <p className='text-center text-amber-200 text-sm'>
                        Crafted with 🐝 love | From farm to your home
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
