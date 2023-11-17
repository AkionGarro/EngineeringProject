import React, { useEffect, useState } from "react"
import { Card, CardContent, CardMedia, Typography, ListItem, ListItemText, Checkbox, TextField, List, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Stack, Menu } from "@mui/material"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2"

import DeleteIcon from "@mui/icons-material/Delete"
import CloseIcon from "@mui/icons-material/Close"
import UploadImageInput from "../../components/AdminCategories/UploadImageInput"
import { useFirebase } from "../../context/DatabaseContext"
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

import Swal from "sweetalert2"

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

const AddProductForm = props => {
	const api = useFirebase()

	//Guarda los datos del formulario
	const [formData, setFormData] = useState(initialFormData)
	//Guarda los datos del icono
	const [iconFormData, setIconFormData] = useState(null)
	//Guarda los datos de la imagen de fondo
	const [backgroundImageFormData, setBackgroundImageFormData] = useState(null)
	//Guarda los datos de los campos personalizados
	const [fieldsFormData, setFieldsFormData] = useState([initialField])

	const [categories, setCategories] = useState([]);
	const [productos, setProducts] = useState([])

	//Actualiza los datos del formulario
	useEffect(() => {
		const fetchData = async () => {
			try {
				let querySnapshot = null

				querySnapshot = await api.getCategoriesByStatus(1)

				setCategories(querySnapshot)
				console.log("Query:", querySnapshot.data())

			} catch (error) {
				console.log("Error al Obtener Datos de Categorias de Firebase", error)
			}
			try {
				let querySnapshot2 = null;

				querySnapshot2 = await api.getAllProducts()
				console.log("Products:", querySnapshot2)
				setProducts(querySnapshot2)
			} catch (error) {
				console.log("Error al obtener productos: ", error)
			}
		}

		fetchData()
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
		console.log(".>", e.target.value);
		let querySnapshot2 = null;

		const fetchData = async () => {
			try {

				if (e.target.value == "Todas") {
					querySnapshot2 = await api.getAllProducts()
				} else {
					querySnapshot2 = await api.getProductsByCategory(e.target.value);
				}

				console.log("Products by category:", querySnapshot2)
				setProducts(querySnapshot2)
			} catch (error) {
				console.log("Error al obtener productos: ", error)
			}
		}

		fetchData();
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

		// console.log("El name es ", name)
		// console.log("El value es ", value)

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


			//Limpiamos los datos del formulario
			setFormData(initialFormData)
			setIconFormData(null)
			setBackgroundImageFormData(null)
			setFieldsFormData([initialField])

			props.closeModal()
		}
	}

	const handleClose = () => {

		props.closeModal()

	}
	const [productosSeleccionados, setProductosSeleccionados] = useState([]);

	const handleProductoSeleccionado = (productoId) => {
		if (productosSeleccionados.includes(productoId)) {
			// Si el producto ya está seleccionado, lo deseleccionamos.
			setProductosSeleccionados(productosSeleccionados.filter((id) => id !== productoId));
		} else {
			// Si el producto no está seleccionado, lo agregamos a la lista de seleccionados.
			setProductosSeleccionados([...productosSeleccionados, productoId]);
		}
	};

	// Agregar un estado para el producto seleccionado y el modal
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [productDetailsOpen, setProductDetailsOpen] = useState(false);

	const openProductDetails = (producto) => {
		setSelectedProduct(producto);
		setProductDetailsOpen(true);
	};

	// Función para cerrar el modal de detalles del producto
	const closeProductDetails = () => {
		setSelectedProduct(null);
		setProductDetailsOpen(false);
	};

	const closeDetailsProduct = (product) => {
		props.setProduct(product);
		closeProductDetails();
		props.closeModal();
	};

	return (

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
								<h1>Agregar Producto</h1>
							</Grid>

							<Grid id="Exit_Button" xs={2} display="flex" justifyContent="end" alignItems="center">
								<IconButton onClick={handleClose}>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>

						<Grid container id="InputContainer" xs={12} sm={12} spacing={0}>
							<Grid xs={14}>
								<h4>Selecciona el producto a agregar</h4>

								<TextField
									InputLabelProps={{ shrink: true }}
									label="Filtrar producto por categoría"
									name="categoria"
									
									onChange={e => handleStatusChange(e)}
									select
									fullWidth
									margin="normal">
									<MenuItem value="Todas">Todas las categorías</MenuItem>
									{categories.map((item, index) => (
										<MenuItem value={item.name}>{item.name}</MenuItem>
									))}

								</TextField>

							</Grid>

							<Grid container xs={12} id="ImagesInput" spacing={0}>
								<Grid xs={12}>
									<p style={{ fontSize: "17px" }}>Productos</p>
								</Grid>

								<List sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
  {productos.map((producto) => (
    <Card
      key={producto.id}
      sx={{ flex: '1', minWidth: '300px', margin: '10px', cursor: 'pointer' }}
      onClick={() => openProductDetails(producto)}
    >
      <CardMedia
        component="img"
        alt={producto.name}
        height="140px"
        image={producto.images[0]}
      />
      <CardContent>
        <Typography variant="h6">{producto.name}</Typography>
        <Typography variant="subtitle1">Precio: {"$" + producto.price}</Typography>
      </CardContent>
    </Card>
  ))}
</List>

								{/* Modal para mostrar detalles del producto */}
								<Dialog
									open={productDetailsOpen}
									onClose={closeProductDetails}
									scroll="paper"
									maxWidth="lg"
								>
									<DialogContent dividers>
										{selectedProduct && (
											<div>
												<Typography justifyContent={"center"} variant="h5">{selectedProduct.name}</Typography>
												<Typography justifyContent={"center"} variant="subtitle2">Categoría: {selectedProduct.categoryName}</Typography>
												<Typography variant="subtitle1">Precio: {"$" + selectedProduct.price}</Typography>
												<Carousel showThumbs={false}>
													{selectedProduct.images.map((imageUrl, index) => (
														<div key={index}>
															<img src={imageUrl} style={{ height: '350px', width: 'auto' }} alt={`Imagen ${index}`} />
														</div>
													))}
												</Carousel>
												<div>
													<Typography variant="h6">Datos Personalizados</Typography>
													<TableContainer component={Paper}>
														<Table>
															<TableHead>
																<TableRow>
																	<TableCell colSpan={2} style={{ textAlign: "center" }}>Características</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{Object.keys(selectedProduct.personalizedFields).map((field, index) => (
																	<TableRow key={index}>
																		<TableCell>{field}</TableCell>
																		<TableCell>{selectedProduct.personalizedFields[field]}</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</TableContainer>
												</div>
												{/* Agrega más detalles aquí según tus necesidades */}
											</div>
										)}
										<div className="row" style={{ display: "flex" }}>
											<div className="col">
												<Button style={{ marginTop: "5px", width: "45%", marginRight: "5%" }} color="warning" onClick={closeProductDetails} variant="outlined">
													Cerrar
												</Button>
												<Button style={{ marginTop: "5px", width: "45%" }} color="success" onClick={() => closeDetailsProduct(selectedProduct)} variant="outlined">
													Agregar producto
												</Button>
											</div>
										</div>
									</DialogContent>
								</Dialog>

							</Grid>
						</Grid>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>

	)
}

export default AddProductForm
