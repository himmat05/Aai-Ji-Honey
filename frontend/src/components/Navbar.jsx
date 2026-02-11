// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom';


// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     const confirmed = window.confirm("⚠️ This login is for the owner only.\nDo you want to continue?");
//     if (confirmed) {
//       navigate('/login');
//     } else {
//       window.location.href = '/';
//     }

//   };
//   return (
//     <div className='bg-[#fde4bc] text-[#FFB300] pr-3 pt-3 pb-3 inline-flex justify-between items-center w-full h-18 shadow-xl transition-all duration-300 ease-in-out hover:drop-shadow-2xl rounded-b-3xl z-10'>
//       <div className='Logo pl-1'><img className='w-20 p-2 rounded-full file:drop-shadow-2xl' src='Aai ji honey.jpg'></img></div>
//       <nav className="md:space-x-4 space-x-3 pr-4 items-center justify-center font-semibold">
//         <Link to="/" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Home</Link>
//         <Link to="/products" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Store</Link>
//         <Link to="/about" className="hover:text-amber-600 hover:font-bold active:text-amber-600">About</Link>
//         <Link to="/contact" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Contact</Link>
//         <Link to="/login" onClick={handleLoginClick} title="Owner login only" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Login</Link>
//       </nav>
//     </div>
//   )
// }

// export default Navbar

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    const confirmed = window.confirm("⚠️ This login is for the owner only.\nDo you want to continue?");
    if (confirmed) {
      navigate('/login');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className='sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-b-4 border-amber-400 shadow-2xl'>
      <div className='flex justify-between items-center px-4 lg:px-8 py-3 max-w-7xl mx-auto'>
        {/* Logo Section */}
        <div className='flex items-center gap-3'>
          <img 
            className='w-16 h-16 p-2 rounded-full shadow-lg border-2 border-amber-300 hover:scale-110 transition-transform duration-300' 
            src='favicon.png'
            alt='Aai Ji Honey Logo'
          />
          <div className='hidden sm:block'>
            <h1 className='text-xl font-bold text-amber-900'>Aai Ji Honey</h1>
            <p className='text-xs text-amber-600'>Pure • Natural • Fresh</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-semibold text-amber-900">
          <Link 
            to="/" 
            className="relative group hover:text-amber-600 transition-colors duration-300"
          >
            🏠 Home
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link 
            to="/products" 
            className="relative group hover:text-amber-600 transition-colors duration-300"
          >
            🛍️ Store
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link 
            to="/about" 
            className="relative group hover:text-amber-600 transition-colors duration-300"
          >
            ℹ️ About
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link 
            to="/contact" 
            className="relative group hover:text-amber-600 transition-colors duration-300"
          >
            📞 Contact
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-amber-500 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <button
            onClick={handleLoginClick}
            title="Owner login only"
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            🔐 Login
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='lg:hidden text-amber-900 text-2xl'
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className='lg:hidden bg-amber-50 border-t-2 border-amber-300 py-4 px-4 space-y-3'>
          <Link 
            to="/" 
            className="block px-4 py-2 text-amber-900 font-semibold hover:bg-amber-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link 
            to="/products" 
            className="block px-4 py-2 text-amber-900 font-semibold hover:bg-amber-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            🛍️ Store
          </Link>
          <Link 
            to="/about" 
            className="block px-4 py-2 text-amber-900 font-semibold hover:bg-amber-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            ℹ️ About
          </Link>
          <Link 
            to="/contact" 
            className="block px-4 py-2 text-amber-900 font-semibold hover:bg-amber-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            📞 Contact
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLoginClick();
            }}
            className="w-full px-4 py-2 hover:cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            🔐 Login
          </button>
        </div>
      )}
    </div>
  )
}

export default Navbar
