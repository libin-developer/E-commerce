import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

export function NoProductsFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-4 dark:bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <AiOutlineSearch className="text-6xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4 dark:text-white">No Products Found</h1>
        <p className="text-gray-600 mb-6 dark:text-slate-300">Sorry, we couldnt find any products matching your search. Please try a different search term.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
