import PropTypes from 'prop-types'
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

//Categories Modal
import AdminCategoryComponent from "./AdminCategoryComponent"

import { firestore } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"

const AdminCategoriesTableComponent = memo((props) => {
  const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)

  const [open, setOpen] = React.useState(false)
  const [editCategory, setEditCategory] = React.useState("")

	const collectionRef = collection(firestore, "productCategories")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await getDocs(collectionRef)
				const newData = querySnapshot.docs.map(doc => doc.data())
				setCategories(newData)
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

  const handleOpenModal = (item) => {
    setEditCategory(item)
    setOpen(true)
  };

	const startIndex = page * rowsPerPage
	const endIndex = startIndex + rowsPerPage

	return (
		<>
			<IconButton aria-label="add" onClick={() => {
    handleOpenModal()
  }}>
				<AddIcon />
			</IconButton>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Personalized Fields</TableCell>
							<TableCell>Background Image</TableCell>
							<TableCell>Icon Image</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5}>Cargando...</TableCell>
							</TableRow>
						) : (
							categories.slice(startIndex, endIndex).map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.description}</TableCell>
									<TableCell>{item.personalizedFields.length}</TableCell>
									<TableCell>
                    <img src={item.backgroundImage} width={"70px"} alt="BG" />
                  </TableCell>
									<TableCell>
                  <img src={item.icon} width={"70px"} alt="BG" />
                  </TableCell>
									<TableCell>
										<Box sx={{ display: "flex", gap: 1 }}>
											<IconButton aria-label="delete"  onClick={() => {handleOpenModal(item)}}>
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
				count={categories.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
      
      <AdminCategoryComponent open={open} setOpen={setOpen} category={editCategory}/>
		</>
	)
}
  
  )

AdminCategoriesTableComponent.propTypes = {}

export default AdminCategoriesTableComponent