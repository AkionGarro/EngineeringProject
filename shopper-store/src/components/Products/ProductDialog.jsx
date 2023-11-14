import React, { useState, useEffect, forwardRef, useRef } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import Carousel from "react-material-ui-carousel"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2
import CloseIcon from "@mui/icons-material/Close"
import Atributo from "./Atributo"
import TextField from "@mui/material/TextField"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const ProductDialog = props => {
	const [userAuthenticated, setUserAuthenticated] = useState(false)
	const auth = useAuth()
	const navigate = useNavigate()

	const { open, setOpen, product } = props

	const [attributeList, setAttributeList] = useState([])

	const descriptionElementRef = useRef(null)

	const [commentValue, setCommentValue] = useState("")

	const handleChangeAttributeList = (optionValue, name) => {
		console.log("optionValue", optionValue)

		let newAttributeList = attributeList.map(attr => {
			if (attr.name === name) {
				attr.value = optionValue
			}
			return attr
		})

		setAttributeList(newAttributeList)

		console.log("attributeList", attributeList)
	}

	const handleCommentValueChange = e => {
		const value = e.target.value

		// Check if the input value exceeds the character limit
		if (commentValue.length <= 250) {
			setCommentValue(value)
		}
	}

	useEffect(() => {
		if (auth.user) {
			setUserAuthenticated(true)
		} else {
			setUserAuthenticated(false)
		}

		if (open) {
			const { current: descriptionElement } = descriptionElementRef

			if (descriptionElement !== null) {
				descriptionElement.focus()
			}

			//Verificar que el producto no esté en el carrito, si esta carga el attribute list y el comentario
			var carritoComprasJSON = localStorage.getItem("carritoCompras")
			var carritoCompras = JSON.parse(carritoComprasJSON)

			var foundProduct = carritoCompras.findIndex(function (elemento) {
				return elemento.id === product.id
			})

			if (foundProduct !== -1) {
				setAttributeList(carritoCompras[foundProduct].valorAtributos)
				setCommentValue(carritoCompras[foundProduct].comentario)
			} else {
				//Obtiene atributos del producto
				var atributos = []

				Object.keys(product.personalizedFields).map(key => {
					let valueList = product.personalizedFields[key].split(",")

					let atributo = {
						name: key,
						values: valueList,
						value: valueList[0]
					}
					atributos.push(atributo)
				})
				setAttributeList(atributos)
			}
		}
	}, [open])

	const handleClose = () => {
		setCommentValue("")
		setAttributeList([])
		setOpen(false)
	}

	const updateCarritoCompras = product => {
		var carritoComprasJSON = localStorage.getItem("carritoCompras")
		var carritoCompras = JSON.parse(carritoComprasJSON)

		console.log("valorAtributos", attributeList)
		console.log("comentario", commentValue)
		
		product.producto = product
		product.comentario = commentValue
		product.valorAtributos = attributeList
		

		carritoCompras.push(product)
		var carritoComprasActualizadoJSON = JSON.stringify(carritoCompras)
		localStorage.setItem("carritoCompras", carritoComprasActualizadoJSON)
	}

	const handleAddItem = async e => {
		e.preventDefault()

		console.log("product", product)

		//Obtiene carrito del localStorage
		var carritoComprasJSON = localStorage.getItem("carritoCompras")
		var carritoCompras = JSON.parse(carritoComprasJSON)

		//Encuentra el indice del producto ya existente, contrairo devuelve -1

		var foundProduct = carritoCompras.findIndex(function (elemento) {
			return elemento.id === product.id
		})

		if (foundProduct === -1) {
			updateCarritoCompras(product)
			handleClose()
		} else {
			var productoAumentar = carritoCompras[foundProduct]

			//Comparar los atributos del producto que se quiere agregar con los atributos del producto que ya está en el carrito
			var atributosIguales = true

			productoAumentar.valorAtributos.map(atributo => {

				let atributoNuevo = attributeList.find(attr => attr.name === atributo.name)

				if (atributoNuevo.value !== atributo.value) {
					atributosIguales = false
				}

			})

			if (commentValue !== productoAumentar.comentario) atributosIguales = false


			if (atributosIguales) {
				Swal.fire({
					target: document.getElementById("product-dialog-form"),
					title: "Este producto ya está en el carrito",
					text: "¿Desea aumentar la cantidad de este producto?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonText: " ¡Sí, quiero aumentar la cantidad! ",
					cancelButtonText: "Cancelar"
				}).then(result => {
					if (result.isConfirmed) {
						productoAumentar.cantidad += 1
						localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras))
						handleClose()
					} else {
						handleClose()
					}
				})
			} else {
				Swal.fire({
					target: document.getElementById("product-dialog-form"),
					title: "Este producto ya está en el carrito",
					text: "¿Desea actualizar los atributos del producto en el carrito?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonText: " ¡Sí, quiero actualizar! ",
					cancelButtonText: "Cancelar"
				}).then(result => {
					if (result.isConfirmed) {
						productoAumentar.valorAtributos = attributeList
						productoAumentar.comentario = commentValue
						localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras))
						handleClose()
					} else {
						handleClose()
					}
				})

				// var productoAumentar = carritoCompras[foundProduct]
				// productoAumentar.cantidad += 1
				// localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras))
			}
		}
		//handleClose()
	}

	const handleLogin = () => {
		handleClose()
		navigate("/Login")
	}

	return (
		<Dialog
			id="product-dialog-form"
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby="scroll-dialog-title"
			aria-describedby="scroll-dialog-description"
			fullWidth={true}
			maxWidth="md"
			scroll="paper">
			<DialogTitle id="scroll-dialog-title">
				{product.name}

				<IconButton onClick={handleClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1} dividers={true}>
				<form id="product_information_dialog_form" onSubmit={handleAddItem}>
					<Grid container spacing={2} className="dialog_grid_container">
						<Grid xs={12} md={5} className="izq">
							<Carousel className="dialog_carousel">
								{product.images.map((image, i) => (
									<img className="dialog_carousel_image" key={`carousel_image_${i}_${image}`} src={image} alt="" />
								))}
							</Carousel>
						</Grid>

						<Grid xs={12} md={7} className="der">
							<>
								<Grid container spacing={2}>
									<Grid xs={12}>Precio: ${product.price}</Grid>

									{attributeList.map(attr => (
										<Grid key={`attr-dialog-${attr.name}`} xs={12}>
											<Atributo info={attr} changeAttribute={handleChangeAttributeList} />
										</Grid>
									))}

									<Grid xs={12}>Agregar comentario al pedido (Opcional)</Grid>
									<Grid xs={12}>
										<TextField
											label="Comentario (250 caracteres)"
											multiline
											rows={4}
											value={commentValue}
											onChange={handleCommentValueChange}
											inputProps={{ maxLength: 250 }}
											variant="outlined"
											fullWidth
										/>
									</Grid>
								</Grid>
							</>
						</Grid>
					</Grid>
				</form>
			</DialogContent>

			<DialogActions>
				{userAuthenticated ? (
					<Button type="submit" form="product_information_dialog_form" variant="contained" color="primary">
						Añadir al Carrito
					</Button>
				) : (
					<Button onClick={handleLogin} variant="contained" color="primary">
						Iniciar Sesión para agregar al carrito
					</Button>
				)}
			</DialogActions>
		</Dialog>
	)
}

export default ProductDialog
