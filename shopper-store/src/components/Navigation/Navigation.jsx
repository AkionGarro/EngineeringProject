import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import "./Navigation.css"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import { Link } from "react-router-dom"
import logo from "../../imagenes/logoBlanco.png"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGlobalContext } from "../../GlobalContext/GlobalContext.js"
import Cuenta from "../../Pages/Account/Account"
import Blog from "../../Pages/HomePage/HomePage.jsx"
//import Pedidos from "../HomePage/Pedidos.jsx"

import Pedidos from "../Pedidos/Pedidos.jsx"

const pages = [{ name: "Inicio", route: "/" }]

const pages2 = [
	{ name: "Inicio", route: "/" }
]

const section = [
	{ name: "Mi Cuenta", route: <Cuenta /> },
	{ name: "Pedidos", route: <Pedidos /> }
]

function ResponsiveAppBar(props) {
	const { onClickCarrito } = props
	const [anchorElNav, setAnchorElNav] = useState(null)
	const [userAuthenticated, setUserAuthenticated] = useState(false)
	const auth = useAuth()
	const navigate = useNavigate()

	const { setComponentToRender } = useGlobalContext()

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleNavoptions = route => {
		setAnchorElNav(null)
		setComponentToRender(route)
	}

	const handleOpenNavMenu = event => {
		setAnchorElNav(event.currentTarget)
	}

	useEffect(() => {
		if (auth.user) {
			setUserAuthenticated(true)
		} else {
			setUserAuthenticated(false)
		}
	}, [auth.user])

	const handleLogout = () => {
		auth.logout()
	}

	const handleLogin = () => {
		navigate("/Login")
	}

	const renderPedidos = () => {
		return (
			<Button
				key="login"
				onClick={() => setComponentToRender(<Pedidos />)}
				sx={{ my: 2, color: "white", display: "block" }}>
				Pedidos
			</Button>
		)
	}

	const renderInicio = () => {
		return (
			<Button
				key="login"
				onClick={() => setComponentToRender(<Blog goTo={0} />)}
				sx={{ my: 2, color: "white", display: "block" }}>
				Inicio
			</Button>
		)
	}

	const renderLogin = () => {
		return (
			<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} className="container-nav">
				{pages.map(page => (
					<Link to={`${page.route.toLowerCase()}`} key={page.route} style={{ textDecoration: "none" }}>
						<Button key={page.name} onClick={page.clicked} sx={{ my: 2, color: "white", display: "block" }}>
							{page.name}
						</Button>
					</Link>
				))}
				<Button key="login" onClick={handleLogin} sx={{ my: 2, color: "white", display: "block" }}>
					Iniciar Sesión
				</Button>
			</Box>
		)
	}

	const renderLoginCelular = () => {
		return (
			<Menu
				id="menu-appbar"
				anchorEl={anchorElNav}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				open={Boolean(anchorElNav)}
				onClose={handleCloseNavMenu}
				sx={{
					display: { xs: "block", md: "none" }
				}}>
				{pages.map(page => (
					<MenuItem key={page.name} onClick={handleCloseNavMenu}>
						<Link to={`${page.route.toLowerCase()}`} key={page.route} style={{ textDecoration: "none" }}>
							<Button key={page.name} onClick={page.clicked} sx={{ my: 2, color: "black", display: "block" }}>
								{page.name}
							</Button>
						</Link>
					</MenuItem>
				))}
				<MenuItem onClick={handleCloseNavMenu}>
					<Button key="login" onClick={handleLogin} sx={{ my: 2, color: "black", display: "block" }}>
						Iniciar Sesión
					</Button>
				</MenuItem>
			</Menu>
		)
	}

	const renderLogout = () => {
		return (
			<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} className="container-nav">
				<Button variant="contained" disableElevation style={{backgroundColor:'#457B9D'}} onClick={onClickCarrito}>
					<div className="inside-button-products">
						<ShoppingCartIcon />
					</div>
				</Button>
				{section.map(section => (
					<Button key={section.name} onClick={() => handleNavoptions(section.route)} color="inherit">
						{section.name}
					</Button>
				))}

				{/* <Button
          key={section.name}
          color="inherit"
          onClick={() => handleNavoptions(section.route)}
        >
          Mi Cuenta
        </Button> */}
				{pages2.map(page => (
					<Link to={`${page.route.toLowerCase()}`} key={page.route} style={{ textDecoration: "none" }}>
						<Button key={page.name} onClick={page.clicked} sx={{ my: 2, color: "white", display: "block" }}>
							{page.name}
						</Button>
					</Link>
				))}
				<Button key="logout" onClick={handleLogout} sx={{ my: 2, color: "white", display: "block" }}>
					Cerrar Sesión
				</Button>
			</Box>
		)
	}

	const renderLogoutCelular = () => {
		return (
			<Menu
				id="menu-appbar"
				anchorEl={anchorElNav}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				open={Boolean(anchorElNav)}
				onClose={handleCloseNavMenu}
				sx={{
					display: { xs: "block", md: "none" }
				}}>
				<MenuItem onClick={handleCloseNavMenu}>
					{section.map(section => (
						<Button key={section.name} onClick={() => handleNavoptions(section.route)} color="inherit">
							{section.name}
						</Button>
					))}
				</MenuItem>
				{pages2.map(page => (
					<MenuItem key={page.name} onClick={handleCloseNavMenu}>
						<Link to={`${page.route.toLowerCase()}`} key={page.route} style={{ textDecoration: "none" }}>
							<Button key={page.name} onClick={page.clicked} sx={{ my: 1, color: "black", display: "block" }}>
								{page.name}
							</Button>
						</Link>
					</MenuItem>
				))}
				<MenuItem onClick={handleCloseNavMenu}>
					<Button key="logout" onClick={handleLogout} sx={{ my: 1, color: "black", display: "block" }}>
						Cerrar Sesión
					</Button>
				</MenuItem>
			</Menu>
		)
	}

	return (
		<AppBar position="static">
			<Container
				sx={{
					backgroundColor: "#457B9D",
					maxWidth: "xl"
				}}>
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
							justifyContent: "center"
						}}>
						<div
							style={{
								width: "40px", // Tamaño del círculo
								height: "40px", // Tamaño del círculo
								borderRadius: "50%", // Forma circular
								backgroundColor: "lightgray", // Color del círculo
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginRight: "10px" // Espacio entre el círculo y el texto
							}}>
							<img
								src={logo} // Reemplaza con la URL o la ruta de tu imagen
								style={{
									width: "100%", // Tamaño de la imagen dentro del círculo
									height: "auto", // Altura automática para mantener la proporción
									borderRadius: "50%" // Hace que la imagen sea circular
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
							color="inherit">
							<MenuIcon />
							{userAuthenticated ? renderLogoutCelular() : renderLoginCelular()}
						</IconButton>
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
							textDecoration: "none"
						}}>
						VeroCampShop
					</Typography>
					{userAuthenticated ? renderLogout() : renderLogin()}
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default ResponsiveAppBar
