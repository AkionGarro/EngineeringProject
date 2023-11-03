import * as React from "react"
import PropTypes from "prop-types"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import AdbIcon from "@mui/icons-material/Adb"
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";

import ProductsPage from "./../Categories/ProductsPage.jsx"
import Blog from "./HomePage.js"
import logo from "../../imagenes/logo.png"

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useGlobalContext } from "../../GlobalContext/GlobalContext"


// Es el Navbar
const Header = props => {
	const { onClickCarrito } = props

	const { setComponentToRender } = useGlobalContext()


	//Maneja el cambio del Componente principal
	const handleNavoptions = (route, title) => {
		console.log(route)
		setComponentToRender(route)
	}

	return (
		<AppBar position="static">
			<Container
				sx={{
					backgroundColor: "#457B9D",
					maxWidth: "xl",
				}}
			>
				<Toolbar sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<div
							style={{
								width: "50px", // Tamaño del círculo
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
						<Typography
							component="h2"
							variant="h5"
							color="inherit"
							align="center"
							noWrap
							sx={{ flex: 1, color: "#457B9D" }}>
							Verocam Shop
						</Typography>
					</div>

					<Button variant="contained" color="primary" onClick={onClickCarrito}>
						<div className="inside-button-products">
							<ShoppingCartIcon />
						</div>
					</Button>
					<div>
						<Button
							size="small"
							onClick={() => handleNavoptions(<Blog/>, "Inicio")}
							sx={{
								color: "#457B9D",
								"&:hover": {
									backgroundColor: "white"
								}
							}}>
							<Link href="/" variant="body1">
								Inicio
							</Link>
						</Button>
						<Button
							variant="outlined"
							size="small"
							sx={{
								border: "1px solid #457B9D",
								color: "#457B9D",
								marginLeft: "5px",
								"&:hover": {
									backgroundColor: "#6C98B4",
									color: "white",
									border: "1px solid #6C98B4"
								}
							}}>
							<Link href="/Login" variant="body1">
								Iniciar Sesion
							</Link>
						</Button>
					</div>
				</Toolbar>
			</Container>
		</AppBar>
	)
}

Header.propTypes = {
	sections: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired
		})
	).isRequired,
	title: PropTypes.string.isRequired
}

export default Header