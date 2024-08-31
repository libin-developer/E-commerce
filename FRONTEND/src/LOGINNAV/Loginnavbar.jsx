
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import logo from "../assets/BUYKART.jpg.png";


const Loginnavbar = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;

    // Navigate to the corresponding page based on the selected role
    switch (selectedRole) {
      case 'User':
        navigate('/');
        break;
      case 'Seller':
        navigate('/seller');
        break;
      case 'Admin':
        navigate('/admin');
        break;
       default: 

        break;
    }
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "black", paddingY: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters className="flex flex-col md:flex-row justify-between items-center">

            {/* Logo and Title Section */}
            <div className="flex items-center space-x-2">
              <IconButton className="hidden md:flex">
                <Avatar alt="Remy Sharp" src={logo} />
              </IconButton>
              <Typography
                variant="h6"
                component="a"
                href="#app-bar-with-responsive-menu"
                className="text-white font-mono font-semibold tracking-wider no-underline hidden md:flex"
              >
                BUYKART
              </Typography>

              <div className="flex md:hidden items-center">
                <Typography
                  variant="h5"
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  className="text-white font-mono font-bold tracking-wider no-underline"
                >
                  BUYKART
                </Typography>
              </div>
            </div>

            {/* User Role Dropdown and Contact Button */}
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <div className="relative">
                <select 
                  className="block appearance-none w-full bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-800 focus:border-gray-500"
                  onChange={handleRoleChange} // Handle the change event
                   defaultValue=""
                >
                  
                  <option value="" disabled>Are You ?</option>
                  <option value="User">User</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>

              <IconButton size="medium" color="inherit" onClick={scrollToFooter} className="text-white">
                Contact
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Loginnavbar;
