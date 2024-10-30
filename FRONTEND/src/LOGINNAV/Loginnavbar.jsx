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

            {/* Contact Button */}
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
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
