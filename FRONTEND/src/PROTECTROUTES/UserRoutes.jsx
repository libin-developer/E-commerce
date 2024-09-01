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
          },
        );

        const data = res.data;
        console.log(data);
        
        if (data.success === false) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error occurred while checking user:", error);
        navigate("/", { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  return children;
};

export {UserRoutes} 