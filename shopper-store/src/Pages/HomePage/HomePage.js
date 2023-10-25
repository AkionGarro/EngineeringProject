import * as React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import GitHubIcon from "@mui/icons-material/GitHub"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Header from "./Header"
import MainFeaturedPost from "./MainFeaturedPost"
import FeaturedPost from "./FeaturedPost"
import Main from "./Main"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import post1 from "./blog-post.1.md"
import Carrousel from "./Carrousel"

const mainFeaturedPost = {
	title: "Title of a longer featured blog post",
	description:
		"Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
	image: "https://source.unsplash.com/random?wallpapers",
	imageText: "main image description",
	linkText: "Continue reading…"
}

const featuredPosts = [
	{
		title: "Pedido Online",
		description: "Envía los links de los productos que deseas comprar y estos llegaran a tu puerta",
		image: "https://source.unsplash.com/random?wallpapers",
		imageLabel: "Image Text"
	},
	{
		title: "Pedido Personal",
		description: "Envía la descripción y imágenes de los productos que quieras buscar.",
		image: "https://source.unsplash.com/random?wallpapers",
		imageLabel: "Image Text"
	},
	{
		title: "Pedido en la tienda",
		date: "Nov 11",
		description: "Adquiere productos de nuestra lista de productos disponibles ",
		image: "https://source.unsplash.com/random?wallpapers",
		imageLabel: "Image Text"
	}
]

const posts = [post1]

const sidebar = {
	title: "About",
	description:
		"Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.",
	archives: [
		{ title: "March 2020", url: "#" },
		{ title: "February 2020", url: "#" },
		{ title: "January 2020", url: "#" },
		{ title: "November 1999", url: "#" },
		{ title: "October 1999", url: "#" },
		{ title: "September 1999", url: "#" },
		{ title: "August 1999", url: "#" },
		{ title: "July 1999", url: "#" },
		{ title: "June 1999", url: "#" },
		{ title: "May 1999", url: "#" },
		{ title: "April 1999", url: "#" }
	],
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

	const scrollToSection = () => {

    let targetRef = null 
    switch (goTo) {
      case 1:
        targetRef = section1
        console.log("section1")
        break;

      case 2:
        targetRef = section2
        console.log("section2")
        break;

      case 3:
        targetRef = section3
        console.log("section3")
        break;

      default:
        targetRef = section1
        break;
    }

		if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }

		// window.scrollTo({
		// 	top: elementRef.current.offsetTop,
		// 	behavior: "smooth"
		// })

	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />

			<Container maxWidth="lg">
				<main>
					<div ref={section1}>
						<Carrousel />
					</div>

					<div ref={section2}>
						<Grid container spacing={4}>
							{featuredPosts.map(post => (
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
								archives={sidebar.archives}
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
