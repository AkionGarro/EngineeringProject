import React, { Component, useEffect, useState } from "react"
import { useFirebase } from "../../context/DatabaseContext"


const Categories = () => {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)

	const api = useFirebase()

	useEffect( () => {

		const fetchData = async () => {

			try{
				const querySnapshot = await api.getCategoriesByStatus(1)

				setCategories(querySnapshot)
				setLoading(false)

			}catch (error) {
				console.log("Error al obtener los Datos de las Categorias")
			}
		}

		fetchData()
	},[]

	)



	return (
		<>
			<div>Aquí van las Categories</div>
		</>
	)
}

export default Categories
