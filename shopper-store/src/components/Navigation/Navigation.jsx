import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LogoVeroShop from "../Logo/Logo";
import "./Navigation.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import logo from "../../imagenes/logoBlanco.png";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const pages = [{ name: "Inicio", route: "/" }];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [userAuthenticated, setUserAuthenticated] = React.useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    if (auth.user) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }
  }, [auth.user]);

  const checkAuth = () => {
    if (userAuthenticated) {
      console.log("User is authenticated");
      console.log(auth.user);
    } else {
      console.log("User isn't authenticated");
    }
  };

  const handleLogout = () => {
    console.log("User is logging out");
    auth.logout();
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  const renderLogin = () => {
    return (
      <Button
        key="login"
        onClick={handleLogin}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        Iniciar Sesión
      </Button>
    );
  };

  const renderLogout = () => {
    return (
      <Button
        key="logout"
        onClick={handleLogout}
        sx={{ my: 2, color: "white", display: "block" }}
      >
        Cerrar Sesión
      </Button>
    );
  };

  return (
    <AppBar position="static">
      <Container
        sx={{
          backgroundColor: "#457B9D",
          maxWidth: "xl",
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="h2"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 200,
              color: "inherit",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <div
              style={{
                width: "40px", // Tamaño del círculo
                height: "40px", // Tamaño del círculo
                borderRadius: "50%", // Forma circular
                backgroundColor: "lightgray", // Color del círculo
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px", // Espacio entre el círculo y el texto
              }}
            >
              <img
                src={logo} // Reemplaza con la URL o la ruta de tu imagen
                style={{
                  width: "100%", // Tamaño de la imagen dentro del círculo
                  height: "auto", // Altura automática para mantener la proporción
                  borderRadius: "50%", // Hace que la imagen sea circular
                }}
              />
            </div>
            VeroCamp Shop
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link
                    to={`${page.route.toLowerCase()}`}
                    key={page.route}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      key={page.name}
                      sx={{ my: 2, color: "#457B9D", height: "20px" }}
                      onClick={page.clicked}
                    >
                      {page.name}
                    </Button>
                  </Link>
                </MenuItem>
              ))}
              
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VeroCampShop
          </Typography>

          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className="container-nav"
          >
            {pages.map((page) => (
              <Link
                to={`${page.route.toLowerCase()}`}
                key={page.route}
                style={{ textDecoration: "none" }}
              >
                <Button
                  key={page.name}
                  onClick={page.clicked}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
            {userAuthenticated ? renderLogout() : renderLogin()}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
