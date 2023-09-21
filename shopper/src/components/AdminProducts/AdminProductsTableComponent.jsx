import PropTypes from "prop-types"
import React, { memo, useEffect, useState } from "react"

//MUI Components
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Box,
	IconButton,
} from "@mui/material"

//MUI Icons
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

import { firestore } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"

const AdminProductsTableComponent = memo(props => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const collectionRef = collection(firestore, "products")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await getDocs(collectionRef)
				const newData = querySnapshot.docs.map(doc => doc.data())
				setProducts(newData)
				setLoading(false)
				console.log("Datos Obtenidos de Firebase", newData)
			} catch (error) {
				console.log("Error al Obtener Datos de Firebase", error)
			}
		}

		fetchData()
	}, [])

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const startIndex = page * rowsPerPage
	const endIndex = startIndex + rowsPerPage

	return (
		<>
			<IconButton aria-label="add">
				<AddIcon />
			</IconButton>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Categoria</TableCell>
							<TableCell>Precio</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell>Campos</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5}>Cargando...</TableCell>
							</TableRow>
						) : (
							products.slice(startIndex, endIndex).map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.name}</TableCell>
									<TableCell>Categoria</TableCell>
									<TableCell>{item.price}</TableCell>
									<TableCell>{item.status}</TableCell>
									<TableCell>Campos Personalizados</TableCell>
									<TableCell>
										<Box sx={{ display: "flex", gap: 1 }}>
											<IconButton aria-label="delete">
												<DeleteIcon />
											</IconButton>
											<IconButton aria-label="edit">
												<EditIcon />
											</IconButton>
										</Box>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={products.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</>
	)
})

AdminProductsTableComponent.propTypes = {}

export default AdminProductsTableComponent
