import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const fetchData = async (page) => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/product/get-product", {
        params: { page, limit: 8 },
      });
      setProducts(response.data.products);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/home/product/${productId}`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/product/searchproduct`, {
          params: { q: query },
          withCredentials: true,
        });
        console.log('Search results:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching search results', error);
      }
    }
  };

  return (
    <div id="products" className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-md bg-gray-100 rounded-md overflow-hidden shadow-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 bg-transparent outline-none text-gray-700"
              placeholder="Search products..."
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
              <AiOutlineSearch />
            </button>
          </form>
        </div>

        {/* Products List */}
        <h2 className="text-3xl font-semibold mb-6 text-center">Latest Products</h2>
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
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{product.productname}</h3>
                <p className="text-gray-700 mb-2">{product.description}</p>
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

        {/* Pagination Controls */}
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
      </div>
    </div>
  );
}
