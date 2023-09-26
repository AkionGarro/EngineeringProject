import React, { useEffect, useState } from "react"
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import UploadProductImagesInput from "./UploadProductImagesInput"
import { useFirebase } from "../../context/DatabaseContext"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

//Campo Personalizado en blanco
const initialField = {
	name: "",
	type: "text"
}


const initialFormData = {
	id: "",
	name: "",
	category: "",
	images: "",
	price: "",
	status: 1
}

const initialproductCategory = {
	personalizedFields: [initialField]
}

const AdminProductForm = props => {
	const handleClose = () => props.setOpen(false)

	const api = useFirebase()

	//Guarda los datos del formulario
	const [formData, setFormData] = useState(initialFormData)
	//Guarda los datos de las imagenes del producto
	const [imagesFormData, setImagesFormData] = useState([])
	//Guarda los datos de los campos personalizados
	const [fieldsFormData, setFieldsFormData] = useState([initialField]) //If this doesn't exists we need to ask the user to pick a catgeory first
	//Guarda los datos de la categoria 
	const [productCategory, setProductCategory] = useState(initialproductCategory)
	//Actualiza los datos del formulario
	useEffect(() => {

		const fetchProductCategory = async (categoryRef) => {

			try {
				const productCategorySnap = await api.getCategoryByID(categoryRef)
				setProductCategory(productCategorySnap)
			} catch (error) {
				console.log("Error la categoria del producto", error)
			}
		}


		if (props.product) {
			setFormData({
				id: props.product.id,
				name: props.product.name,
				category: props.product.category,
				images: props.product.images,             // A List with al the images's urls
				price: props.product.price,
				status: props.product.status
			})
			setFieldsFormData(props.product.personalizedFields)
			fetchProductCategory(props.product.category)
		

		} else{
			setFormData(initialFormData)
			setFieldsFormData([initialField])
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
			setImagesFormData([...imagesFormData, file])
		}
	}

	const handleRemoveImage = index => {
		const updatedImages = [...imagesFormData]
		updatedImages.splice(index, 1)
		setImagesFormData(updatedImages)
	}

	
	//Actualiza los datos de los inputs personalizados
	const handleInputChange = (e, index) => {
		
		const { name, value } = e.target //Toma el Valor del Input

		const updatedFields = [...fieldsFormData] //Copia el Array de Campos Personalizados

		//Actualiza el Campo Personalizado
		updatedFields[index] = {
			...updatedFields[index],
			[name]: value
		}


		setFieldsFormData(updatedFields) //Actualiza el Array de Campos Personalizados
	}

	//Agrega un nuevo campo personalizado
	const handleAddField = () => {
		setFieldsFormData([initialField, ...fieldsFormData]) //Agrega un nuevo campo personalizado
	}

	//Elimina un campo personalizado
	const handleRemoveField = index => {
		const updatedFields = [...fieldsFormData] //Copia el Array de Campos Personalizados
		updatedFields.splice(index, 1) //Elimina el Campo Personalizado
		setFieldsFormData(updatedFields) //Actualiza el Array de Campos Personalizados
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
			personalizedFields: fieldsFormData,
			newImages: imagesFormData
		}

		console.log( "Submitting this product: ", product);

	}


	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleClose}
				scroll="paper"
				maxWidth="md"
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<DialogContent dividers>
					<form onSubmit={handleSubmit}>
						<h3>Product Form</h3>
						<Grid container direction="column" spacing={4}>
							{/* Contiene 2 Columnas */}

							<Grid container item spacing={4} direction="row" xs>
								{/* Nombre de la Categoria */}
								<Grid container item spacing={4} xs>
									<Grid item xs={12}>
										<TextField
											label="Name"
											name="name"
											value={formData.name}
											onChange={e => handleNameChange(e)}
											fullWidth
										/>
									</Grid>

									{/* Descripción de la Categoría */}
									<Grid item xs={12}>
										<TextField
											label="Price"
											name="price"
											value={formData.price}
											onChange={e => handleDescriptionChange(e)}
											fullWidth
										/>
									</Grid>

									{/* Icono y Fondo de la Categoría */}
									<Grid item direction="row" spacing={2} container>
										
										<UploadProductImagesInput  productImages={formData.images} uploadImages={imagesFormData} handleAddImage={handleAddImage} handleRemoveImage={handleRemoveImage} />

									</Grid>
								</Grid>

								{/* Campos Personalizados */}
								<Grid container item spacing={2} xs>
									<Grid item xs={12}>
										<Button onClick={handleAddField} variant="outlined">
											Agregar Campo
										</Button>
									</Grid>

									<Grid container item xs={12} direction="row">
										{productCategory.personalizedFields.map((field, index) => (
											<Grid container item xs={12} key={index} direction="row">
												<Grid item xs={6}>
													<TextField
														label="Campo"
														name="name"
														value={field.name}
														onChange={e => handleInputChange(e, index)}
														fullWidth
													/>
												</Grid>

												<Grid item xs={4}>
													<FormControl fullWidth>
														<InputLabel>Tipo</InputLabel>
														<Select name="type" value={field.type} onChange={e => handleInputChange(e, index)}>
															<MenuItem value="text">Texto</MenuItem>
															<MenuItem value="number">Número</MenuItem>
															<MenuItem value="size">Tamaño</MenuItem>
														</Select>
													</FormControl>
												</Grid>

												<Grid item xs={2}>
													<IconButton onClick={() => handleRemoveField(index)} color="secondary" aria-label="Eliminar">
														<DeleteIcon />
													</IconButton>
												</Grid>
											</Grid>
										))}
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Button type="submit" variant="contained" color="primary">
									Enviar
								</Button>
							</Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default AdminProductForm
