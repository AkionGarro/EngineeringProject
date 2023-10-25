import React, { Component, useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"
import CategoryCard from "./CategoryCard"
import { ImageList, ImageListItem } from "@mui/material"
import Stack from "@mui/material/Stack"


import CircularProgress from "@mui/material/CircularProgress"
import {Box} from "@mui/material"

const Categories = () => {
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

	const createCategoryComponents = () => {
		let mappedCategories = []

		categories.forEach(element => {
			mappedCategories.push(<CategoryCard categoryInfo={element} />)
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
				<Stack direction="row" spacing={2}>
					{createCategoryComponents()}
				</Stack>
			)}
		</>
	)
}

export default Categories
