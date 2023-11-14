import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import "./Navigation.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import logo from "../../imagenes/logoBlanco.png";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext/GlobalContext.js";
import Cuenta from "../../Pages/Account/Account";
import Blog from "../../Pages/HomePage/HomePage.jsx";
//import Pedidos from "../HomePage/Pedidos.jsx"

import Pedidos from "../Pedidos/Pedidos.jsx";

const pages = [{ name: "Inicio", route: "/" }];

const pages2 = [{ name: "Inicio", route: "/" }];

const section = [
  { name: "Mi Cuenta", route: <Cuenta /> },
  { name: "Historial de pedidos", route: <Pedidos /> },
];

function ResponsiveAppBar(props) {
  const { onClickCarrito } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const location = useLocation();

  const auth = useAuth();
  const navigate = useNavigate();

  const { setComponentToRender } = useGlobalContext();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    handleMenuClose();
  };

  const handleNavoptions = (route) => {
    setComponentToRender(route);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (auth.user) {
      setUserAuthenticated(true);
    } else {
      setUserAuthenticated(false);
    }
  }, [auth.user]);

  const handleLogout = () => {
    localStorage.removeItem("carritoCompras");
    localStorage.removeItem("CarritoCompras");
    localStorage.removeItem("currentUser");
    setComponentToRender(<Blog />);
    auth.logout();
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  const handleInicio = () => {
    if (location.pathname === "/Login") {
      navigate("/");
    } else {
      setComponentToRender(<Blog />);
    }
  };

  const renderLogin = () => {
    return (
      <Box
        sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        className="container-nav"
      >
        <Button
          onClick={handleInicio}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Inicio
        </Button>
        <Button
          key="login"
          onClick={handleLogin}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Iniciar Sesión
        </Button>
      </Box>
    );
  };

  const renderLogout = () => {
    return (
      <Box
        sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        className="container-nav"
      >
        <Button
          variant="contained"
          disableElevation
          style={{ backgroundColor: "#457B9D" }}
          onClick={onClickCarrito}
        >
          <div className="inside-button-products">
            <ShoppingCartIcon />
          </div>
        </Button>
        {section.map((section) => (
          <Button
            key={section.name}
            onClick={() => handleNavoptions(section.route)}
            color="inherit"
          >
            {section.name}
          </Button>
        ))}
        <Button
          onClick={handleInicio}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Inicio
        </Button>
        <Button
          key="logout"
          onClick={handleLogout}
          sx={{ my: 2, color: "white", display: "block" }}
        >
          Cerrar Sesión
        </Button>
      </Box>
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
        <Toolbar>
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
              onClick={handleMenuClick}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {userAuthenticated ?
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={() => handleMenuItemClick()}>
                  <Button
                    color='inherit'
                    onClick={onClickCarrito}
                  >
                    Carrito
                  </Button></MenuItem>
                {section.map((section) => (
                  <MenuItem onClick={() => handleMenuItemClick()}>
                    <Button
                      key={section.name}
                      onClick={() => handleNavoptions(section.route)}
                      color="inherit"
                    >
                      {section.name}
                    </Button>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handleMenuItemClick()}>
                  <Button
                    onClick={handleInicio}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                  >
                    Inicio
                  </Button>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick()}>
                  <Button key="logout" onClick={handleLogout} sx={{ color: "black" }}>
                    Cerrar Sesión
                  </Button>
                </MenuItem>
              </Menu>
              :
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={() => handleMenuItemClick()}>
                  <Button
                    onClick={handleInicio}
                    sx={{ my: 2, color: "inherit", display: "block" }}
                  >
                    Inicio
                  </Button>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick()}>
                  <Button
                    key="login"
                    onClick={handleLogin}
                    sx={{ my: 2, color: "black", display: "block" }}
                  >
                    Iniciar Sesión
                  </Button>
                </MenuItem>
              </Menu>}

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
          {userAuthenticated ? renderLogout() : renderLogin()}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;