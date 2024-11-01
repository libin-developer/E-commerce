import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './Userdashboard';
import AdminDashboard from '../ADMIN/Admindashboard';

const DashboardWrapper = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}user/user-role`,{
                    withCredentials: true
                  });
                const userRole = response.data.role;

                if (userRole) {
                    setRole(userRole);
                } else {
                    // If no role found, redirect to login
                    navigate('/signin');
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
                navigate('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Optionally add a loading spinner
    }

    // Render the appropriate dashboard based on the role
    if (role === "user") {
        return <UserDashboard />;
    } else if (role === "admin") {
        return <AdminDashboard />;
    } else {
        navigate('/signin'); // Redirect if role is undefined or invalid
        return null;
    }
};

export default DashboardWrapper;
