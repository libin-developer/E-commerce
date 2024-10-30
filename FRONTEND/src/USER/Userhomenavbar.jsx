import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaUser } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi'; // Use an appropriate cart icon
import Logo from '../assets/BUYKART.jpg.png';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteCookie } from '../../uTILS/Removecookies';

const Userhomenavbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to check authentication

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(!!userId); // Set authentication state
  }, []);

  useEffect(() => {
    // Retrieve dark mode setting from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900', 'bg-white');
    }
  }, []);

  useEffect(() => {
    const updateCartItemCount = () => {
      const itemCount = JSON.parse(localStorage.getItem('cartItemCount')) || 0;
      setCartItemCount(itemCount);
    };

    // Initial count update
    updateCartItemCount();

    // Listen for storage events to sync cart item count across tabs/windows
    window.addEventListener('storage', updateCartItemCount);
    return () => window.removeEventListener('storage', updateCartItemCount);
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
    // Save dark mode setting to localStorage
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  const goToHomePage = () => {
    navigate("/"); // Navigate to the homepage
  };

  const goToSellerSignup = () => {
    navigate("/seller"); // Navigate to the seller signup page
  };

  const logout = () => {
    // Remove cookies and localStorage items related to user session
    deleteCookie();
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart"); // Clear cart from local storage
    localStorage.removeItem("cartItemCount"); // Clear cart item count from local storage
    toast.success("You have been logged out");
    setIsAuthenticated(false); // Update the authentication status
    navigate("/signin");
    window.location.reload();
  };

  return (
    <nav className="bg-zinc-300 dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-3 object-fit rounded-full border-transparent" />
          <span className="text-xl font-bold dark:text-white">BUYKART</span>
        </div>

        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          {isAuthenticated ? (
            <>
              <button
                className="text-sm font-semibold px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:shadow-lg transition duration-300 ease-in-out shadow-sm opacity-80 dark:bg-gray-900 dark:text-white"
                onClick={goToHomePage}
              >
                Home
              </button>
              <div className="relative">
                <button className="text-gray-700 dark:text-white" onClick={handleCartClick}>
                  <HiShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
              <button className="text-gray-700 dark:text-white" onClick={goToDashboard}>
                <FaUser size={24} />
              </button>
              <button onClick={toggleDarkMode} className="text-gray-700 dark:text-white">
                {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
              </button>
            </>
          ) : (
            <>
              <button
                className="text-sm font-semibold px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:shadow-lg transition duration-300 ease-in-out shadow-sm opacity-80 dark:bg-gray-900 dark:text-white"
                onClick={() => navigate("/signin")}
              >
                Login
              </button>
              <button
                className="text-sm font-semibold px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:shadow-lg transition duration-300 ease-in-out shadow-sm opacity-80 dark:bg-gray-900 dark:text-white"
                onClick={goToSellerSignup}
              >
                Sell Your Product
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Userhomenavbar;
