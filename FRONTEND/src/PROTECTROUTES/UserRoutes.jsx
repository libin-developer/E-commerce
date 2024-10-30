import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserRoutes = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/check-user`,
          {
            withCredentials: true,
          }
        );

        const data = res.data;
        console.log(data);
        
        // If the response indicates the user is not authenticated
        if (data.success === false) {
          clearAuthCookies();
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error occurred while checking user:", error);

        // Handle token expiration error
        if (error.response && error.response.status === 401) {
          clearAuthCookies();  // Clear cookies when token is expired
          localStorage.clear();
          navigate("/", { replace: true }); // Redirect to login page
        } else {
          // Redirect to home for other errors

          navigate("/", { replace: true });
        }
                             
      }
    };

    // Function to clear cookies
    const clearAuthCookies = () => {
      // Assuming the cookie name is 'token', clear it from the browser
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
    };

    checkUser();
  }, [navigate]);

  return children;
};

export { UserRoutes };
