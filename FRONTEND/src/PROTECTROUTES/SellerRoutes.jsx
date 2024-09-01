import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SellerRoutes = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkseller = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}seller/check-seller`,
          {
            withCredentials: true,
          },
        );

        const data = res.data;
        console.log(data);
        
        if (data.success === false) {
          navigate("/seller", { replace: true });
        }
      } catch (error) {
        console.error("Error occurred while checking seller:", error);
        navigate("/seller", { replace: true });
      }
    };
    checkseller();
  }, [navigate]);

  return children;
};

export {SellerRoutes} 