import React, { useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"
import ProductCard from "./ProductCard"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2

import { Box } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"

const Products = props => {
	const { category, handleProductClick } = props
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const api = useFirebase()

	useEffect(() => {
		setLoading(true)

		const fetchData = async () => {
			try {
				let querySnapshot = null

				if (category.name === "Todos") {
					querySnapshot = await api.getProductsByStatus(1)
				} else {
					querySnapshot = await api.getActiveProductsByCategory(category.name)
				}

				setProducts(querySnapshot)
				setLoading(false)
			} catch (error) {
				console.log("Error al obtener los Datos de los Productos")
			}
		}

		fetchData()
	}, [category])

	const createProductComponents = () => {
		let mappedProducts = []

		products.forEach(element => {
			mappedProducts.push(
				<Grid xs={12} sm={6} md={4} lg={3}>
					<ProductCard productInfo={element} onClickHandler={handleProductClick} />
				</Grid>
			)
		})

		return mappedProducts
	}

	return (
		<>
			{loading ? (
				<Box sx={{ display: "flex" }}>
					<CircularProgress />
				</Box>
			) : (
				<Grid container xs={12} spacing={3}>
					{createProductComponents()}
				</Grid>
			)}
		</>
	)
}

export default Products
