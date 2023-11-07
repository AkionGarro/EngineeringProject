import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import Carousel from "react-material-ui-carousel"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2
import CloseIcon from "@mui/icons-material/Close"
import Atributo from "./Atributo"

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})


const ProductDialog = props => {
	const { open, setOpen, product } = props

	const [attributeList, setAttributeList] = React.useState([])

	const descriptionElementRef = React.useRef(null)

	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef
			if (descriptionElement !== null) {
				descriptionElement.focus()
			}

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
	}, [open])

	const handleClose = () => {
		setAttributeList([])
		setOpen(false)
	}

	const updateCarritoCompras = product => {
		var carritoComprasJSON = localStorage.getItem("carritoCompras")
		var carritoCompras = JSON.parse(carritoComprasJSON)
		carritoCompras.push(product)
		var carritoComprasActualizadoJSON = JSON.stringify(carritoCompras)
		localStorage.setItem("carritoCompras", carritoComprasActualizadoJSON)
	}

	const handleAddItem = async e => {
		e.preventDefault()

		//Obtiene carrito del localStorage
		var carritoComprasJSON = localStorage.getItem("carritoCompras")
		var carritoCompras = JSON.parse(carritoComprasJSON)
		//Encuentra el indice del producto ya existente, contrairo devuelve -1
		var foundProduct = carritoCompras.findIndex(function (elemento) {
			return elemento.id === product.id
		})

		if (foundProduct === -1) {
			updateCarritoCompras(product)
		} else {
			var productoAumentar = carritoCompras[foundProduct]
			productoAumentar.cantidad += 1
			localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras))
		}
		setOpen(false)
	}

	return (
		<Dialog
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
									<img className="dialog_carousel_image" key={i} src={image} alt="" />
								))}
							</Carousel>
						</Grid>

						<Grid xs={12} md={7} className="der">
							<>
								<Grid container spacing={2}>
									<Grid xs={12}>Precio: ${product.price}</Grid>

									{attributeList.map(attr => (
										<Grid xs={12}>
											<Atributo info={attr} />
										</Grid>
									))}
								</Grid>
								
							</>
						</Grid>
					</Grid>
				</form>
			</DialogContent>

			<DialogActions>
				<Button type="submit" form="product_information_dialog_form" variant="contained" color="primary">
					Añadir al Carrito
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ProductDialog
