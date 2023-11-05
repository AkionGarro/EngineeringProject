import React, { Component, useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"
import CategoryCard from "./CategoryCard"
import { ImageList, ImageListItem } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2

import CircularProgress from "@mui/material/CircularProgress"
import { Box } from "@mui/material"

const Categories = props => {
	//Si carritoCompras no existe en LocalStorage, lo crea. De lo contrario no entra en el condicional.

	if (!localStorage.getItem("carritoCompras")) {
		var carritoCompras = []
		var carritoComprasJSON = JSON.stringify(carritoCompras)
		localStorage.setItem("carritoCompras", carritoComprasJSON)
	}

	//============================

	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)

	const api = useFirebase()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await api.getCategoriesByStatus(1)
				setCategories(querySnapshot)
				setLoading(false)
			} catch (error) {
				console.log("Error al obtener los Datos de las Categorias")
			}
		}

		fetchData()
	}, [])

	const onCategoryClick = category => {
		props.handleCategoryChange(category)
	}

	const createCategoryComponents = () => {
		let mappedCategories = []

		categories.forEach(element => {
			mappedCategories.push(


        <Grid xs={3} sm={4} md={4} lg={4} xl={4}>

            <CategoryCard categoryInfo={element} onCategoryClick={onCategoryClick} />
        </Grid>
      


      )
		})

		return mappedCategories
	}

	return (
		<>
			{loading ? (
				<Box sx={{ display: "flex" }}>
					<CircularProgress />
				</Box>
			) : (

				<div>
          <h3 id="categories_component_title">Categorias</h3>
					<Grid container xs={12} spacing={1} >{createCategoryComponents()}</Grid>
				</div>
			)}
		</>
	)
}

export default Categories
