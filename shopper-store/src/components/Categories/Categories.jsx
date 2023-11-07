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
				console.log("Categorias")
				console.log(querySnapshot)

				const allCategory = {
					id: 'all01',
					name: "Todos",
					backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/veroshopper-cbeb1.appspot.com/o/productCategories%2FbackgroundImages%2FtodosFondo.jpg?alt=media&token=fdf2d8f4-893f-4d77-b971-a37a72e6c974&_gl=1*1e2i2vy*_ga*MTY4ODU1Mzk3NS4xNjk4NDM1ODk0*_ga_CW55HF8NVT*MTY5OTMzMTI3MC44LjEuMTY5OTMzMjU2Ny4yNi4wLjA.',
					icon: 'https://firebasestorage.googleapis.com/v0/b/veroshopper-cbeb1.appspot.com/o/productCategories%2Ficons%2FtodosIcon.jpg?alt=media&token=1ce341e9-4fb2-46a2-9146-d23d0eb8b986&_gl=1*1qnco9c*_ga*MTY4ODU1Mzk3NS4xNjk4NDM1ODk0*_ga_CW55HF8NVT*MTY5OTMzMTI3MC44LjEuMTY5OTMzMjQ4MS40My4wLjA.'
				}

				//Insert at the begining 
				querySnapshot.unshift(allCategory)


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
