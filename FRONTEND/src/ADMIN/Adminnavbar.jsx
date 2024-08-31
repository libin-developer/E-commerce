import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/BUYKART.jpg.png";
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteCookie } from '../../uTILS/Removecookies';

const Adminnavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie();
    localStorage.removeItem("adminname");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("adminId");
    navigate("/admin");
    window.location.reload();
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "black", py: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Title Section */}
            <div className="flex items-center space-x-2">
              <IconButton className="hidden md:flex">
                <Avatar alt="BuyKart Logo" src={logo} />
              </IconButton>
              <Typography
                variant="h4"
                component="a"
                href="#"
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  display: { xs: 'none', md: 'flex' },
                }}
              >
                BUYKART
              </Typography>

              <div className="flex md:hidden items-center">
                <Typography
                  variant="h5"
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 700,
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  BUYKART
                </Typography>
              </div>
            </div>

            {/* Logout Button */}
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleLogout}
                sx={{
                  fontSize: "1.5rem",
                  color: "white",
                }}
                title="Logout"
              >
                <LogoutIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Adminnavbar;
