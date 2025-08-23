import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const confirmed = window.confirm("⚠️ This login is for the owner only.\nDo you want to continue?");
    if (confirmed) {
      navigate('/login');
    } else {
      window.location.href = '/';
    }

  };
  return (
    <div className='bg-[#fde4bc] text-[#FFB300] pr-3 pt-3 pb-3 inline-flex justify-between items-center w-full h-18 shadow-xl transition-all duration-300 ease-in-out hover:drop-shadow-2xl rounded-b-3xl z-10'>
      <div className='Logo pl-1'><img className='w-20 p-2 rounded-full file:drop-shadow-2xl' src='Aai ji honey.jpg'></img></div>
      <nav className="md:space-x-4 space-x-3 pr-4 items-center justify-center font-semibold">
        <Link to="/" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Home</Link>
        <Link to="/products" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Store</Link>
        <Link to="/about" className="hover:text-amber-600 hover:font-bold active:text-amber-600">About</Link>
        <Link to="/contact" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Contact</Link>
        <Link to="/login" onClick={handleLoginClick} title="Owner login only" className="hover:text-amber-600 hover:font-bold active:text-amber-600">Login</Link>
      </nav>
    </div>
  )
}

export default Navbar
