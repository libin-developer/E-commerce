import { useEffect, useState } from 'react';
import UserDashboard from './Userdashboard';
import AdminDashboard from '../ADMIN/Admindashboard';
import { useNavigate } from 'react-router-dom';

const DashboardWrapper = () => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check success and role stored in local storage (or cookies if preferred)
        const success = JSON.parse(localStorage.getItem("success"));
        const storedRole = localStorage.getItem("role");

        if (success && storedRole) {
            setRole(storedRole);
        } else {
            // Redirect to login if role or success flag is not found
            navigate('/signin');
        }
    }, [navigate]);

    // Render the appropriate dashboard based on the role
    if (role === "user") {
        return <UserDashboard />;
    } else if (role === "admin") {
        return <AdminDashboard />;
    } else {
        return null; // Optionally add a loading spinner or redirect if role is undefined
    }
};

export default DashboardWrapper;
