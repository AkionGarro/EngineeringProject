import * as React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Pedidos from "./Pedidos"
import Beneficios from "./Beneficios"
import InfoVero from "./AcercaDe.js"
import Contact from "./Contacto.js"

import Carrousel from "./Carrousel"
import Typography from '@mui/material/Typography';
import ProductsPage from "./../Categories/ProductsPage.jsx"

import online from "../../imagenes/online.png"
import personal from "../../imagenes/pedidoPersonal.png"
import tienda from "../../imagenes/tienda.png"
import Personal_Order from "../PersonalOrdersStore/PersonalOrderStore"


import "./HomePage.css";

const tiposPedidos = [
	{
		title: "Pedido Online",
		description: "Envía los links de los productos que deseas comprar y estos llegaran a tu puerta",
		image: online,
		route: <Personal_Order />
	},
	{
		title: "Pedido Personal",
		description: "Envía la descripción y imágenes de los productos que quieras buscar.",
		image: personal,
		route: <Personal_Order />
	},
	{
		title: "Pedido en la tienda",
		description: "Adquiere productos de nuestra lista de productos disponibles ",
		image: tienda,
		route: <ProductsPage />
	}
]


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

const Blog = props => {
  
    const { goTo } = props
  
	const section1 = React.useRef(null)
	const section2 = React.useRef(null)
	const section3 = React.useRef(null)

	const scrollToSection = () => {

		let targetRef = null 
		switch (goTo) {
		case 1:
			targetRef = section1
			break;

		case 2:
			targetRef = section2
			break;

		case 3:
			targetRef = section3
			break;

		default:
			targetRef = section1
			break;
		}

			if (targetRef.current) {
		targetRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}

	return (
		<ThemeProvider theme={defaultTheme} >
			<CssBaseline />
			<Container maxWidth="lg">
				<main >					
					<div>
						<Typography variant="h5" gutterBottom sx={{ mt: 3, textAlign:'center' }}>
							En Verocam_shop conseguimos los productos que necesitas de tus tiendas favoritas
						</Typography>
						<Carrousel />
					</div>

					<div ref={section1} className="pedidos">
						<Typography variant="h6" gutterBottom sx={{mt: 3, textAlign:'center', color:"#457B9D", marginBottom:"40px" }}>
							Realiza tu pedido 
						</Typography>
						<Grid container spacing={4}>
							{tiposPedidos.slice(0, 2).map((post) => (
								<Pedidos key={post.title} pedido={post}  />
							))}
							<Grid item xs={12} md={3}></Grid> {/* Espacio para centrar la tercera tarjeta */}
							{tiposPedidos.slice(2).map((post) => (
								<Pedidos key={post.title} pedido={post} />
							))}
						</Grid>
					</div>

					<div ref={section2}>
						<Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign:'center', color:"#457B9D", marginTop:"8vh"}}>
							Acerca de Vero
						</Typography>
						<InfoVero/>
					</div>

					<div >
						<Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign:'center', color:"#457B9D", marginTop:"50px"}}>
							Beneficios
						</Typography>
						<Beneficios/>
					</div>

					<div ref={section3}>
						<Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign:'center', color:"#457B9D", marginTop:"50px"}}>
							Contacto
						</Typography>
						<Contact />
					</div>
				</main>

			</Container>
			{scrollToSection()}
		</ThemeProvider>
		
	)
}

export default Blog;
