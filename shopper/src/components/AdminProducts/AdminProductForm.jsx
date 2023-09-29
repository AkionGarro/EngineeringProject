import React, { useEffect, useState } from "react"
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Paper } from "@mui/material"


import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Grid from "@mui/material/Unstable_Grid2"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"

import UploadProductImagesInput from "./UploadProductImagesInput"
import { useFirebase } from "../../context/DatabaseContext"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

import { styled } from "@mui/material/styles"
import Swal from "sweetalert2";


//Campo Personalizado en blanco
const initialField = {
	name: "",
	type: "text"
}

const initialImage = {
	url: "",
	file: null
}

const initialFormData = {
	id: "",
	name: "",
	category: "",
	images: [],
	price: "",
	personalizedFields: {},
	status: 1
}

const initialproductCategory = {
	personalizedFields: [initialField]
}

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.secondary.light,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary
}))

const AdminProductForm = props => {

	const api = useFirebase()

	//Guarda los datos del formulario
	const [formData, setFormData] = useState(initialFormData)
	//Guarda los datos de las imagenes del producto
	const [imagesFormData, setImagesFormData] = useState([])
	//Guarda los datos de la categoria
	const [productCategory, setProductCategory] = useState(initialproductCategory)
	//Actualiza los datos del formulario
	useEffect(() => {
		const fetchProductCategory = async categoryRef => {
			try {
				const productCategorySnap = await api.getCategoryByID(categoryRef)
				setProductCategory(productCategorySnap)
			} catch (error) {
				console.log("Error la categoria del producto", error)
			}
		}

		if (props.product) {
			//Crea un array de imagenes con los datos del producto
			const imageList = props.product.images.map(image => {
				return {
					url: image,
					file: null
				}
			})

			setFormData({
				id: props.product.id,
				name: props.product.name,
				category: props.product.category,
				price: props.product.price,
				status: props.product.status,
				personalizedFields: props.product.personalizedFields
			})

			fetchProductCategory(props.product.category)
			setImagesFormData(imageList)
		} else {
			setFormData(initialFormData)
			setImagesFormData([])
			setProductCategory(initialproductCategory)
		}
	}, [props.open])

	//Actualiza el input de nombre de categoria
	const handleNameChange = e => {
		const { value } = e.target //Toma el Valor del Input
		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			name: value
		})
	}

	//Actualiza el Status del Producto
	const handleStatusChange = e => {
		const { value } = e.target //Toma el Valor del Input
		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			status: value
		})
	}

	//Actualiza la descripcion de la categoria
	const handleDescriptionChange = e => {
		const { value } = e.target //Toma el Valor del Input
		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			description: value
		})
	}

	const handleAddImage = e => {
		const file = e.target.files[0]

		if (file) {
			const newImage = {
				url: URL.createObjectURL(file),
				file: file
			}

			setImagesFormData([...imagesFormData, newImage])
		}
	}

	const handleRemoveImage = item => {
		const index = imagesFormData.indexOf(item)
		const updatedImages = [...imagesFormData]
		updatedImages.splice(index, 1)
		setImagesFormData(updatedImages)
	}

	//Actualiza los datos de los inputs personalizados
	const handleInputChange = (e, attribute) => {
		const { value } = e.target //Toma el Valor del Input

		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			personalizedFields: {
				...formData.personalizedFields,
				[attribute]: value
			}
		})

		// const { name, value } = e.target //Toma el Valor del Input

		// const updatedFields = [...fieldsFormData] //Copia el Array de Campos Personalizados

		// //Actualiza el Campo Personalizado
		// updatedFields[index] = {
		// 	...updatedFields[index],
		// 	[name]: value
		// }

		// setFieldsFormData(updatedFields) //Actualiza el Array de Campos Personalizados
	}

	//Envia los datos del formulario
	const handleSubmit = async e => {
		e.preventDefault()

		const product = {
			id: formData.id,
			name: formData.name,
			category: formData.category,
			images: formData.images,
			price: formData.price,
			status: formData.status,
			personalizedFields: formData.personalizedFields,
			newImages: imagesFormData
		}

		console.log("Submitting this product: ", product)
	}

	const handleClose = () => {

		Swal.fire({
			target: document.getElementById('form-modal'),
			title: 'You have unsaved changes!',
			text: "Are you sure you want to leave without saving?",
			icon: 'warning',
			showCancelButton: true,
			cancelButtonColor: '#3085d6',
			confirmButtonColor: '#d33',
			cancelButtonText:'Stay on this Page',
			confirmButtonText: 'Discard Changes'
		}).then((result) => {
			if (result.isConfirmed) {
				props.setOpen(false)
				
			}
		})

	} 


	return (
		<>
			<Dialog
				id="form-modal"
				open={props.open}
				onClose={handleClose}
				scroll="paper"
				maxWidth="lg"
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<DialogContent dividers>
					<form onSubmit={handleSubmit}>
						<Grid id="FormContainer" container spacing={2}>
							<Grid id="Title-Exit" container xs={12}>
								<Grid id="Title" xs={10}>
									<h3>Category Form</h3>
								</Grid>

								<Grid id="Exit_Button" xs={2} display="flex" justifyContent="end" alignItems="center">
									<IconButton onClick={handleClose}>
										<CloseIcon />
									</IconButton>
								</Grid>
							</Grid>

							<Grid container id="InputContainer" xs={12} sm={6}>
								<Grid xs={12}>
									<p>General Information</p>

									<TextField
										InputLabelProps={{ shrink: true }}
										label="Name"
										name="name"
										value={formData.name}
										onChange={e => handleNameChange(e)}
										fullWidth
										margin="normal"
									/>

									<FormControl fullWidth margin="normal">
										<InputLabel htmlFor="price-adornment">Price</InputLabel>
										<OutlinedInput
											id="price-adornment"
											name="Price"
											onChange={e => handleDescriptionChange(e)}
											startAdornment={<InputAdornment position="start">$</InputAdornment>}
											label="Price"
										/>
									</FormControl>

									<TextField
										InputLabelProps={{ shrink: true }}
										label="Status"
										name="status"
										value={formData.status}
										onChange={e => handleStatusChange(e)}
										select
										fullWidth
										margin="normal">
										<MenuItem value={1}>Active</MenuItem>
										<MenuItem value={0}>Inactive</MenuItem>
									</TextField>
								</Grid>

								<Grid xs={12}>
									<p>Product Attributes</p>
									{productCategory.personalizedFields.map((field, index) => (
										<TextField
											InputLabelProps={{ shrink: true }}
											label={field.name}
											name={field.name}
											value={formData.personalizedFields[field.name]}
											onChange={e => handleInputChange(e, field.name)}
											fullWidth
											margin="normal"
										/>
									))}
								</Grid>
							</Grid>

							<Grid id="ImagesContainer" xs={12} sm={6}>
								<p>Product Images</p>

								<UploadProductImagesInput
									images={imagesFormData}
									handleAddImage={handleAddImage}
									handleRemoveImage={handleRemoveImage}
								/>
							</Grid>

							<Grid container id="Action Buttons" xs={12}>
								<Grid xs={6}>
									<Button type="submit" variant="contained" color="error" fullWidth>
										Cancel
									</Button>
								</Grid>
								<Grid xs={6}>
									<Button type="submit" variant="contained" color="success" fullWidth>
										Save Changes
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default AdminProductForm
