import React, { useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"
import ProductCard from "./ProductCard"
import Stack from "@mui/material/Stack"

import {Box} from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"


const Products = (props) => {

  const {category, handleProductClick} = props
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const api = useFirebase()

	useEffect(() => {
    
    setLoading(true)

		const fetchData = async () => {
			try {

        let querySnapshot = null

        if( category === "all"){
          querySnapshot = await api.getProductsByStatus(1)
        }else{
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
			mappedProducts.push(<ProductCard productInfo={element} onClickHandler={handleProductClick} />)
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
