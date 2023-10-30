import * as React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import GitHubIcon from "@mui/icons-material/GitHub"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import FeaturedPost from "./FeaturedPost"
import Main from "./Main"
import Sidebar from "./Sidebar"
import post1 from "./blog-post.1.md"
import Carrousel from "./Carrousel"
import Typography from '@mui/material/Typography';
import StorefrontIcon from '@mui/icons-material/Storefront';

const tiposPedidos = [
	{
		title: "Pedido Online",
		description: "Envía los links de los productos que deseas comprar y estos llegaran a tu puerta",
		image: "https://source.unsplash.com/random?wallpapers",
	},
	{
		title: "Pedido Personal",
		description: "Envía la descripción y imágenes de los productos que quieras buscar.",
		image: "https://source.unsplash.com/random?wallpapers",
	},
	{
		title: "Pedido en la tienda",
		date: "Nov 11",
		description: "Adquiere productos de nuestra lista de productos disponibles ",
		image: "https://source.unsplash.com/random?wallpapers",
	}
]

const posts = [post1]

const sidebar = {
	title: "About",
	description:
		"Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.",
	social: [
		{ name: "GitHub", icon: GitHubIcon },
		{ name: "Twitter", icon: TwitterIcon },
		{ name: "Facebook", icon: FacebookIcon }
	]
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

const Blog = props => {
  
  const { goTo } = props
  
	const section1 = React.useRef(null)
	const section2 = React.useRef(null)
	const section3 = React.useRef(null)


	//Scrolea a la seccion indicada
	//Hay que mejorarlo, cuando yo cambio el componente, no hace scroll
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
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<Container maxWidth="lg">
				<main>
					<div ref={section1}>
						<Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign:'center' }}>
							En Verocam_shop conseguimos los productos que necesitas de tus tiendas favoritas
						</Typography>
						<Carrousel />
					</div>

					<div ref={section2}>
						<Typography variant="h6" gutterBottom sx={{ mt: 3, textAlign:'center', color:"#457B9D", marginBottom:"40px" }}>
							Realiza tu pedido 
						</Typography>
						<Grid container spacing={4}>
							{tiposPedidos.slice(0, 2).map((post) => (
								<FeaturedPost key={post.title} post={post} />
							))}
							<Grid item xs={12} md={3}></Grid> {/* Espacio para centrar la tercera tarjeta */}
							{tiposPedidos.slice(2).map((post) => (
								<FeaturedPost key={post.title} post={post} />
							))}
							</Grid>
					</div>

					<div ref={section3}>
						<Grid container spacing={5} sx={{ mt: 3 }}>
							<Main title="From the firehose" posts={posts} />
							<Sidebar
								title={sidebar.title}
								description={sidebar.description}
								social={sidebar.social}
							/>
						</Grid>
					</div>
				</main>

			</Container>
			{scrollToSection()}
		</ThemeProvider>
		
	)
}

export default Blog
