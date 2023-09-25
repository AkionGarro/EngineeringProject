import React, { useEffect, useState } from "react"
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import UploadImageInput from "./UploadImageInput"
//Campo Personalizado en blanco
const initialField = {
	name: "",
	type: "text"
}

const AdminCategoryForm = props => {
	//Guarda los datos del formulario
	const [formData, setFormData] = useState({
		id: "",
		name: "",
		description: "",
		icon: "",
		backgroundImage: "",
	})

	//Guarda los datos del icono
	const [ iconFormData, setIconFormData ] = useState(null)
	//Guarda los datos de la imagen de fondo
	const [ backgroundImageFormData, setBackgroundImageFormData ] = useState(null)
	//Guarda los datos de los campos personalizados
	const [fieldsFormData, setFieldsFormData] = useState([initialField])

	//Actualiza los datos del formulario
	useEffect(() => {
		if (props.category) {

			setFormData({
				id: props.category.id,
				name: props.category.name,
				description: props.category.description,
				icon: props.category.icon,
				backgroundImage: props.category.backgroundImage,
			})

			setIconFormData(props.category.icon)
			setBackgroundImageFormData(props.category.backgroundImage)
			setFieldsFormData(props.category.personalizedFields)
		}
	},[])


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

	//Actualiza el icono de la categoria
	const handleIconChange = e => {

		console.log("Icono de la categoria:", e.target.files);

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

		const updatedFields = fieldsFormData //Copia el Array de Campos Personalizados

		updatedFields[index] = {
			//Actualiza el Campo Personalizado
			...updatedFields[index],[name]: value //Copia el Campo Personalizado
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
	const handleSubmit = e => {
		e.preventDefault()
		// Aquí puedes enviar los datos del formulario a tu backend o realizar cualquier otra acción

		console.log("Form data", formData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>Formulario de Categorías</h3>

			Nombre y Descripcion de la categoria
			<Grid container direction="column" spacing={4}>
				{/* Contiene 2 Columnas */}

				<Grid container item spacing={4} direction="row" xs>
					{/* Nombre de la Categoria */}
					<Grid container item spacing={4} xs>
						<Grid item xs={12}>
							<TextField label="Name" name="name" value={formData.name} onChange={e => handleNameChange(e)} fullWidth />
						</Grid>

						{/* Descripción de la Categoría */}
						<Grid item xs={12}>
							<TextField
								label="Description"
								name="description"
								value={formData.description}
								onChange={e => handleDescriptionChange(e)}
								fullWidth
							/>
						</Grid>

						{/* Icono y Fondo de la Categoría */}
						<Grid item direction="row" spacing={2} container>
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

					{/* Campos Personalizados */}
					<Grid container item spacing={2} xs>
						<Grid item xs={12}>
							<Button onClick={handleAddField} variant="outlined">
								Agregar Campo
							</Button>
						</Grid>

						<Grid container item xs={12} direction="row">
							{fieldsFormData.map((field, index) => (
								<Grid container item xs={12} key={index} direction="row">
									<Grid item xs={6}>
										<TextField
											label="Campo"
											name="key"
											value={field.name}
											onChange={e => handleInputChange(e, index)}
											fullWidth
										/>
										
									</Grid>

									<Grid item xs={4}>
										<FormControl fullWidth>
											<InputLabel>Tipo</InputLabel>
											<Select name="value" value={field.type} onChange={e => handleInputChange(e, index)}>
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
	)
}

export default AdminCategoryForm
