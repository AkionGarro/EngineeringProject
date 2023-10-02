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
	IconButton
} from "@mui/material"

//MUI Icons
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

import Chip from "@mui/material/Chip"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import CircularProgress from "@mui/material/CircularProgress"

import FilterBar from "../ProductCategoryFilter/FilterBar"

import { useFirebase } from "../../context/DatabaseContext"
import AdminProductForm from "./AdminProductForm"

const Filters = [
	{ key: 0, label: "All" },
	{ key: 1, label: "Active" },
	{ key: 2, label: "Inactive" }
]

const AdminProductsTableComponent = memo(props => {

	const [filter, setFilter] = useState("Active")
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	const [open, setOpen] = useState(false)
	const [editProduct, setEditProduct] = useState(null)

	const api = useFirebase()

	useEffect(() => {
		const fetchData = async () => {
			try {
				let querySnapshot = null
				if(filter === "Active"){
					querySnapshot = await api.getProductsByStatus(1)
				}else if(filter === "Inactive"){
					querySnapshot = await api.getProductsByStatus(0)
				}else{
					querySnapshot = await api.getAllProducts()
				}
				setProducts(querySnapshot)
				setLoading(false)
			} catch (error) {
				console.log("Error al Obtener Datos de productos de Firebase", error)
			}
		}
		fetchData()
		setEditProduct(null)
		setOpen(false)
	}, [loading, filter])


	const handleDelete = item => {
		console.log("Desactivar producto:", item)

		api.deactivateProduct(item.id).then(() => {
			setLoading(true)
		})
	}

	const handleEdit = item => {
		//Vamos a abrir el modal para editar la categoria seleccionada
		setEditProduct(item)
		setOpen(true)
	}

	const handleOpenForm = item => {
		setEditProduct(item)
		setOpen(true)
	}

	const handleCloseform = () => {
		setEditProduct(null)
		setOpen(false)
	}


	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const handleFilterChange = event => {
		setFilter(event.target.innerText)
		setLoading(true)
		console.log("Filter: ", event.target.innerText);
	}


	const startIndex = page * rowsPerPage
	const endIndex = startIndex + rowsPerPage

	return (
		<>
			{loading ? (
				<Box sx={{ display: "flex" }}>
					<CircularProgress />
				</Box>
			) : (
				<>

					<FilterBar FilterList={Filters} handleFilterChange={handleFilterChange} />

					<IconButton aria-label="add" onClick={() => handleOpenForm()}>
						<AddIcon />
					</IconButton>

					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>Category</TableCell>
									<TableCell>Price</TableCell>
									<TableCell>State</TableCell>
									{/* <TableCell>Attributes</TableCell> */}
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{products.slice(startIndex, endIndex).map((item, index) => (
									<TableRow key={index}>
										<TableCell>{item.name}</TableCell>
										<TableCell>Categoria</TableCell>
										<TableCell>{item.price}</TableCell>
										{item.status === 1 ? (
											<TableCell align="center">
												<Chip
													id="status-chip"
													icon={<SentimentSatisfiedAltIcon />}
													label="  Active"
													color="success"
													size="small"
												/>
											</TableCell>
										) : (
											<TableCell align="center">
												<Chip
													id="status-chip"
													icon={<SentimentVeryDissatisfiedIcon />}
													label="Inactive"
													color="error"
													size="small"
												/>
											</TableCell>
										)}
										{/* <TableCell>{item.personalizedFields.length}</TableCell>  */}
										<TableCell>
											<Box sx={{ display: "flex", gap: 1 }}>
												<IconButton aria-label="delete" onClick={() => handleDelete(item)}>
													<DeleteIcon />
												</IconButton>
												<IconButton aria-label="edit" onClick={() => handleEdit(item)}>
													<EditIcon />
												</IconButton>
											</Box>
										</TableCell>
									</TableRow>
								))}
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

					<AdminProductForm setLoading={setLoading} open={open} closeForm={handleCloseform} product={editProduct} />
				</>
			)}
		</>
	)
})

AdminProductsTableComponent.propTypes = {}

export default AdminProductsTableComponent
