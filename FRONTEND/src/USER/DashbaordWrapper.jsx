import { useEffect, useState } from 'react';
import UserDashboard from './Userdashboard';
import AdminDashboard from '../ADMIN/Admindashboard';
import { useNavigate } from 'react-router-dom';

const DashboardWrapper = () => {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve role from localStorage and set it in state
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        } else {
            // Redirect to login if role is not found
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
