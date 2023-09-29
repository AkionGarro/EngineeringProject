import React, { useEffect, useState } from "react"
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Menu } from "@mui/material"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"

import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from '@mui/icons-material/Close';
import UploadImageInput from "./UploadImageInput"
import { useFirebase } from "../../context/DatabaseContext"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

import Swal from "sweetalert2";


//Campo Personalizado en blanco
const initialField = {
	name: "",
	type: ""
}

const initialFormData = {
	id: "",
	name: "",
	description: "",
	icon: "",
	backgroundImage: "",
	status: 1
}

const AdminCategoryForm = props => {
	

	const api = useFirebase()

	//Guarda los datos del formulario
	const [formData, setFormData] = useState(initialFormData)
	//Guarda los datos del icono
	const [iconFormData, setIconFormData] = useState(null)
	//Guarda los datos de la imagen de fondo
	const [backgroundImageFormData, setBackgroundImageFormData] = useState(null)
	//Guarda los datos de los campos personalizados
	const [fieldsFormData, setFieldsFormData] = useState([initialField])

	//Actualiza los datos del formulario
	useEffect(() => {
		console.log("Abriendo el modal de productrossjkhasdjk;hask")

		if (props.category) {
			setFormData({
				id: props.category.id,
				name: props.category.name,
				description: props.category.description,
				icon: props.category.icon,
				backgroundImage: props.category.backgroundImage,
				status: props.category.status
			})
			setFieldsFormData(props.category.personalizedFields)
		} else {
			setFormData(initialFormData)
			setFieldsFormData([initialField])
			setIconFormData(null)
			setBackgroundImageFormData(null)
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

	//Actualiza el Status de la categoria
	const handleStatusChange = e => {
		const { value } = e.target //Toma el Valor del Input
		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			status: value
		})
	}

	//Actualiza el icono de la categoria
	const handleIconChange = e => {
		const file = e.target.files[0]

		if (file) {
			setIconFormData(file)
			const iconImageUrl = URL.createObjectURL(file)
			setFormData({
				//Actualiza el Estado del Formulario
				...formData,
				icon: iconImageUrl
			})
		}
	}

	//Actualiza la imagen de fondo de la categoria
	const handleBackgroundImageChange = e => {
		const file = e.target.files[0]

		if (file) {
			setBackgroundImageFormData(file)
			const bgImageUrl = URL.createObjectURL(file)
			setFormData({
				//Actualiza el Estado del Formulario
				...formData,
				backgroundImage: bgImageUrl
			})
		}
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
		let iconUrl = formData.icon
		let bgUrl = formData.backgroundImage

		if (iconFormData != null) {
			iconUrl = await api.uploadCategoryImage(iconFormData, "icon").then(iconUrl => {
				return iconUrl
			})
		}

		if (backgroundImageFormData != null) {
			bgUrl = await api.uploadCategoryImage(backgroundImageFormData, "backgroundImage").then(bgUrl => {
				return bgUrl
			})
		}

		const newFormData = {
			id: formData.id,
			name: formData.name,
			description: formData.description,
			icon: iconUrl,
			backgroundImage: bgUrl,
			personalizedFields: fieldsFormData,
			status: formData.status
		}

		//Si el id esta vacio, crea una nueva categoria
		//Si no la actualiza
		if (newFormData.id === "") {
			//console.log("Creando nueva categoria")
			await api.addNewCategory(newFormData).then(() => {
				// props.onClose()
			})
		} else {
			//console.log("Actualizando categoria");
			//Si el id no esta vacio, actualiza la categoria
			await api.updateCategoryData(newFormData).then(() => {
				// props.onClose()
			})
		}

		//Limpiamos los datos del formulario
		setFormData(initialFormData)
		setIconFormData(null)
		setBackgroundImageFormData(null)
		setFieldsFormData([initialField])

		props.setLoading(true)
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
						<Grid id="FormContainer" container spacing={1}>

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

							<Grid container id="InputContainer" xs={12} sm={6} spacing={0}>
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

									<TextField
										InputLabelProps={{ shrink: true }}
										label="Description"
										name="description"
										value={formData.description}
										onChange={e => handleDescriptionChange(e)}
										fullWidth
										margin="normal"
									/>

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

								<Grid container xs={12} id="ImagesInput" spacing={0}>
									<Grid xs={12}>
										<p>Category Images</p>
									</Grid>

									<UploadImageInput
										imageUrl={formData.icon}
										buttonTitle={"Upload Icon"}
										label={"Icon"}
										onChange={handleIconChange}
									/>
									<UploadImageInput
										imageUrl={formData.backgroundImage}
										buttonTitle={"Upload Background"}
										label={"Background Image"}
										onChange={handleBackgroundImageChange}
									/>
								</Grid>
							</Grid>

							<Grid id="AttributesContainer" xs={12} sm={6}>
								<p>Category Attributes</p>

								<Button onClick={handleAddField} variant="outlined" fullWidth sx={{ mt: 2 }}>
									Add Attribute
								</Button>

								<Paper xs={12} style={{ height: "50vh", minWidth: "100%", overflow: "auto" }} sx={{ mt: 2 }}>
									{fieldsFormData.map((field, index) => (
										<Stack direction="row" spacing={2} key={index} sx={{ mt: 2 }}>
											<TextField
												label="Attribute"
												name="name"
												value={field.name}
												onChange={e => handleInputChange(e, index)}
												InputLabelProps={{ shrink: true }}
												margin="normal"
												fullWidth
											/>

											<TextField
												InputLabelProps={{ shrink: true }}
												label="Attribute Type"
												name="attributeType"
												value={field.type}
												onChange={e => handleInputChange(e, index)}
												select
												fullWidth
												margin="normal">
												<MenuItem value="text">Text</MenuItem>
												<MenuItem value="number">Number</MenuItem>
												<MenuItem value="size">Size</MenuItem>
											</TextField>

											<IconButton onClick={() => handleRemoveField(index)} color="secondary" aria-label="Eliminar">
												<DeleteIcon />
											</IconButton>

											{/* <Grid container xs={12} key={index} >
										<Grid  xs={6}>
											<TextField
												label="Attribute"
												name="name"
												value={field.name}
												onChange={e => handleInputChange(e, index)}
												fullWidth
											/>
										</Grid>

										<Grid  xs={4}>
											<FormControl fullWidth>
												<InputLabel>Type</InputLabel>
												<Select name="type" value={field.type} onChange={e => handleInputChange(e, index)}>
													<MenuItem value="text">Texto</MenuItem>
													<MenuItem value="number">Número</MenuItem>
													<MenuItem value="size">Tamaño</MenuItem>
												</Select>
											</FormControl>
										</Grid>

										<Grid  xs={2}>
											<IconButton onClick={() => handleRemoveField(index)} color="secondary" aria-label="Eliminar">
												<DeleteIcon />
											</IconButton>
										</Grid>
									</Grid> */}
										</Stack>
									))}
								</Paper>
							</Grid>

							<Grid container id="Action Buttons" xs={12}>
								<Grid xs={6}>
									<Button onClick={handleClose} variant="contained" color="error" fullWidth>
										Discard Changes
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

export default AdminCategoryForm
