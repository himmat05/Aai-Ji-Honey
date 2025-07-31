import React from 'react'

const Footer = () => {
    return (
        <div className='bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400 text-white p-4 flex items-center w-full h-20 shadow-xl drop-shadow-2xl justify-between'>
            <div className='flex space-x-2 justify-center items-center ml-1'>
                <a href='https://www.facebook.com/share/186fGU4Yb6/'><img src='vecteezy_facebook-logo-png-facebook-icon-transparent-white-background_41643208.png' className='w-13 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-2xl' /></a>
                <a href='https://www.instagram.com/aaijihoney24?utm_source=ig_web_button_share_sheet&igsh=Z25laGJnYmJoaWVq'><img className='w-9 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-xl' src='Instagram_icon.png' alt='Insta' /></a>
                <a href='https://youtu.be/tDlWHE-kL7w?si=rR2utLe3EJ5QQlbN'><img src='vecteezy_youtube-logo-png-youtube-logo-transparent-png-youtube-icon_23986480.png'  className='w-12 transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-2xl' /></a>
            </div>
            <div>
                <ul>
                    <li>&copy; {new Date().getFullYear()} Aai Ji Honey.</li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
