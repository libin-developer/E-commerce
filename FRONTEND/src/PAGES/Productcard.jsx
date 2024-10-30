import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Fetch products for the current page
  const fetchData = async (page) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/get-product`, {
        params: { page, limit: 8 },
      });
      setProducts(response.data.products);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data when page or query changes
  useEffect(() => {
    if (query.trim() === '') {
      fetchData(currentPage);
    }
  }, [currentPage, query]);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Handle buy now
  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle search
  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim()) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}product/searchproduct`, {
          params: { q: searchQuery },
          withCredentials: true,
        });
        if (response.data.length === 0) {
          // Redirect if no products found
          navigate('/no-products-found');
        }
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    } else {
      fetchData(currentPage); // Fetch data for the current page if query is cleared
    }
  };

  return (
    <div id="products" className="py-10 bg-gray-100  dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <form className="flex items-center w-full max-w-md bg-gray-100 rounded-md overflow-hidden shadow-md">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              className="flex-grow px-4 py-2 bg-transparent outline-none text-gray-700"
              placeholder="Search products..."
            />
            <button type="button" className="px-4 py-2 bg-blue-500 text-white">
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {/* Products List */}
        <h2 className="text-3xl font-semibold mb-6 text-center dark:text-white">Latest Products</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                <div className="flex-shrink-0">
                  <img
                    className="w-full h-48 object-cover"
                    src={product.image}
                    alt={product.productname}
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col dark:text-white">
                  <h3 className="text-lg font-semibold mb-2">{product.productname}</h3>
                  <p className="text-gray-700 mb-2 dark:text-slate-300">{product.description}</p>
                  <div className="text-xl font-bold mb-4">₹{product.price}</div>
                  <button 
                    onClick={() => handleBuyNow(product._id)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition mt-auto"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 mt-4">
            {query.trim() ? 'No products found' : 'Loading products...'}
          </div>
        )}

        {/* Pagination Controls */}
        {products.length > 0 && (
          <div className="flex justify-center items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 hover:bg-gray-400 transition disabled:opacity-50"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded ml-2 hover:bg-gray-400 transition disabled:opacity-50"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
