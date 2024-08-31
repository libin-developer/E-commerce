import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaUser, FaPlusCircle } from 'react-icons/fa';
import Logo from '../assets/BUYKART.jpg.png';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteCookie } from '../../uTILS/Removecookies';

const Sellerhomenav = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900', 'bg-white');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900', 'bg-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
      document.body.classList.add('bg-white');
    }
    localStorage.setItem('darkMode', newDarkMode);
  };

  const goToDashboard = () => {
    navigate("/sellerhome/dashboard");
  };

  const goToAddProduct = () => {
    navigate("/sellerhome/add-product");
  };

  const logout = () => {
    deleteCookie();
    localStorage.removeItem("sellername");
    localStorage.removeItem("email");
    localStorage.removeItem("darkMode");
    localStorage.removeItem("sellerId");
    toast.success("You have been logged out");
    navigate("/seller");
    window.location.reload();
  };

  return (
    <nav className="bg-zinc-300 dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-3 object-fit rounded-full border-transparent" />
          <span className="text-xl font-bold dark:text-white">BUYKART</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Profile Icon with Tooltip */}
          <div className="relative group">
            <button className="text-gray-700 dark:text-white" onClick={goToDashboard}>
              <FaUser size={24} />
            </button>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-0.5 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </div>

          {/* Add Product Icon with Tooltip */}
          <div className="relative group">
            <button className="text-gray-700 dark:text-white" onClick={goToAddProduct}>
              <FaPlusCircle size={24} />
            </button>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-0.5 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Add Product
            </span>
          </div>

          <button onClick={toggleDarkMode} className="text-gray-700 dark:text-white">
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>

          <button className="text-gray-700 dark:text-white" onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Sellerhomenav;
