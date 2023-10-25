import React, { useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"
import ProductCard from "./ProductCard"
import Stack from "@mui/material/Stack"

import {Box} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"


const Products = () => {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const api = useFirebase()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await api.getProductsByStatus(1)
				setProducts(querySnapshot)
				setLoading(false)
			} catch (error) {
				console.log("Error al obtener los Datos de los Productos")
			}
		}

		fetchData()
	}, [])

	const createProductComponents = () => {
		let mappedProducts = []

		products.forEach(element => {
			mappedProducts.push(<ProductCard productInfo={element} />)
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
				<Stack direction="row" spacing={2}>
					{createProductComponents()}
				</Stack>
			)}
		</>
	)
}

export default Products
