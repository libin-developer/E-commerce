import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkadmin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}admin/check-admin`,
          {
            withCredentials: true,
          },
        );

        const data = res.data;
        console.log(data);
        
        if (data.success === false) {
          navigate("/admin", { replace: true });
        }
      } catch (error) {
        console.error("Error occurred while checking seller:", error);
        navigate("/admin", { replace: true });
      }
    };
    checkadmin();
  }, [navigate]);

  return children;
};

export {AdminRoutes} 