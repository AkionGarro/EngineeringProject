import React, { useEffect, useState } from "react"
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Paper } from "@mui/material"

import OutlinedInput from "@mui/material/OutlinedInput"
import InputAdornment from "@mui/material/InputAdornment"

import Grid from "@mui/material/Unstable_Grid2"
import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import Autocomplete from "@mui/material/Autocomplete"
import Alert from "@mui/material/Alert"

import UploadProductImagesInput from "./UploadProductImagesInput"
import { useFirebase } from "../../context/DatabaseContext"

import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import CircularProgress from "@mui/material/CircularProgress"

import { styled } from "@mui/material/styles"
import Swal from "sweetalert2"

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
	const [productCategory, setProductCategory] = useState(null)
	//Actualiza los datos del formulario

	
	//Para cambair categorias
	const [openCategoryBox, setOpenCategoryBox] = useState(false)
	const [categoryOptions, setCategoryOptions] = useState([])
	const loadingCategory = openCategoryBox && categoryOptions.length === 0

	useEffect(() => {
		let active = true

		if (!loadingCategory) {
			return undefined
		}

		;(async () => {
			const categories = await api.getCategoriesByStatus(1)
			if (active) {
				setCategoryOptions(categories)
			}
		})()

		return () => {
			active = false
		}
	}, [loadingCategory])

	useEffect(() => {
		if (!openCategoryBox) {
			setCategoryOptions([])
		}
	}, [openCategoryBox])

	useEffect(() => {
		console.log("Producto:", props.product)

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

			if (props.product.images.length > 0) {
				const imageList = props.product.images.map(image => {
					return {
						url: image,
						file: null
					}
				})

				setImagesFormData(imageList)
			}


			setFormData({
				id: props.product.id,
				name: props.product.name,
				category: props.product.category,
				price: props.product.price,
				status: props.product.status,
				personalizedFields: props.product.personalizedFields
			})

			fetchProductCategory(props.product.category)
		} else {
			setFormData(initialFormData)
			setImagesFormData([])
			setProductCategory(null)
			setCategoryOptions([])
			setOpenCategoryBox(false)
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
	const handlePriceChange = e => {
		const { value } = e.target //Toma el Valor del Input
		setFormData({
			//Actualiza el Estado del Formulario
			...formData,
			price: value
		})
	}

	const handleAddImage = e => {
		const files = e.target.files

		//add multipe files
		if (files) {
			const newImages = Array.from(files).map(file => {
				return {
					url: URL.createObjectURL(file),
					file: file
				}
			})
			setImagesFormData([...imagesFormData, ...newImages])
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
			...formData,
			personalizedFields: {
				...formData.personalizedFields,
				[attribute]: value
			}
		})

		console.log(productCategory)
	}

	//Envia los datos del formulario
	const handleSubmit = async e => {
		e.preventDefault()

		const result = await Swal.fire({
			target: document.getElementById("form-modal"),
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#d33",
			confirmButtonColor: "#3085d6",
			cancelButtonText: "Cancel",
			confirmButtonText: "Yes, save it!"
		})

		if (result.isConfirmed) {

			//Upload Images to Firebae Storage

			
			console.log("Product Category: ", productCategory)

			//Filter images with a file
			const imagesWithFile = imagesFormData.filter(image => image.file !== null).map(image => image.file)

			//filter images without a file but get only the url 
			const imagesWithoutFile = imagesFormData.filter(image => image.file === null).map(image => image.url)

			

			//Upload images to firebase storage
			const imagesURL = await api.uploadProductImages(imagesWithFile).then(urls => {
				return urls
			})

			//Add the new images to the images array
			const newImages = [...imagesURL, ...imagesWithoutFile]


			const newProduct = {
				id: formData.id,
				name: formData.name,
				category: api.getCategoryReference(productCategory),
				images: newImages,
				price: Number(formData.price),
				status: formData.status,
				personalizedFields: formData.personalizedFields,
				categoryName: productCategory.name
			}

			console.log("Submitting this product: ", newProduct)

			if (newProduct.id) {
				//Edita el producto
				await api.updateProductData(newProduct)
			} else {
				//Crea el producto
				await api.addNewProduct(newProduct)
			}

			props.closeForm()
		}
	}

	const checkKeyDown = e => {
		if (e.code === "Enter") {
			e.preventDefault()
			e.stopPropagation()
		}
	}

	const handleClose = () => {
		Swal.fire({
			target: document.getElementById("form-modal"),
			title: "You have unsaved changes!",
			text: "Are you sure you want to leave without saving?",
			icon: "warning",
			showCancelButton: true,
			cancelButtonColor: "#3085d6",
			confirmButtonColor: "#d33",
			cancelButtonText: "Stay on this Page",
			confirmButtonText: "Discard Changes"
		}).then(result => {
			if (result.isConfirmed) {
				props.closeForm()
			}
		})
	}

	const handleCategoryChange = category => {
		console.log("Category ID: ", category)

		//Hacer un json con los atributos de name de personalized fields de la categroy
		const personalizedFields = {}
		category.personalizedFields.forEach(field => {
			personalizedFields[field.name] = ""
		})

		//Setea los datos del Producto
		setFormData({
			...formData,
			category: category.id,
			personalizedFields: personalizedFields
		})

		//Setea los datos de la categoria
		setProductCategory(category)
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
					<form onSubmit={handleSubmit} onKeyDown={e => checkKeyDown(e)}>
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
										required
										key="nameInput"
										InputLabelProps={{ shrink: true }}
										label="Name"
										name="name"
										value={formData.name}
										onChange={e => handleNameChange(e)}
										fullWidth
										margin="normal"
									/>

									<FormControl required fullWidth margin="normal">
										<InputLabel id="price-adornment">Price</InputLabel>
										<OutlinedInput
											key="priceInput"
											id="price-adornment"
											name="Price"
											onChange={e => handlePriceChange(e)}
											startAdornment={<InputAdornment position="start">$</InputAdornment>}
											label="price"
											inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
											value={formData.price}
										/>
									</FormControl>

									<FormControl required fullWidth margin="normal">
										<InputLabel id="status-adornment">Status</InputLabel>
										<Select
											id="statusSelect"
											value={formData.status}
											label="status"
											onChange={e => handleStatusChange(e)}>
											<MenuItem value={1}>Active</MenuItem>
											<MenuItem value={0}>Inactive</MenuItem>
										</Select>
									</FormControl>

									<Autocomplete
										disableClearable
										id="async-categories"
										open={openCategoryBox}
										onOpen={() => {
											setOpenCategoryBox(true)
										}}
										onClose={() => {
											setOpenCategoryBox(false)
										}}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										getOptionLabel={option => option.name}
										options={categoryOptions}
										loading={loadingCategory}
										value={productCategory ? productCategory : null}
										onChange={(event, newValue) => {
											handleCategoryChange(newValue)
										}}
										renderInput={params => (
											<TextField
												{...params}
												fullWidth
												margin="normal"
												InputLabelProps={{ shrink: true }}
												required
												label="Category"
												InputProps={{
													...params.InputProps,
													endAdornment: (
														<React.Fragment>
															{loadingCategory ? <CircularProgress color="inherit" size={20} /> : null}
															{params.InputProps.endAdornment}
														</React.Fragment>
													)
												}}
											/>
										)}
									/>
								</Grid>

								<Grid xs={12}>
									<p>Product Attributes</p>
									{!productCategory ? (
										<Alert severity="error">
											{" "}
											We can't show you the product attributes until you select a category.
											<br /> Please choose a category first.{" "}
										</Alert>
									) : (
										productCategory.personalizedFields.map((field, index) => (
											<TextField
												required
												key={index}
												InputLabelProps={{ shrink: true }}
												label={field.name}
												name={field.name}
												value={formData.personalizedFields[field.name]}
												onChange={e => handleInputChange(e, field.name)}
												fullWidth
												margin="normal"
											/>
										))
									)}
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

export default AdminProductForm
