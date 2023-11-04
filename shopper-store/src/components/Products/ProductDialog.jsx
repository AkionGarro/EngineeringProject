import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import Carousel from "react-material-ui-carousel"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />
})

const ProductDialog = props => {
	const { open, setOpen, product } = props

	console.log(product)

	const descriptionElementRef = React.useRef(null)

	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef
			if (descriptionElement !== null) {
				descriptionElement.focus()
			}
		}
	}, [open])

	const handleClose = () => {
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

		console.log("dkjhadkljahkdlna");

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
			<DialogTitle id="scroll-dialog-title">{product.name}</DialogTitle>
			<DialogContent id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1} dividers={true}>


				<form id="product_information_dialog_form" onSubmit={handleAddItem}>

				<Grid container spacing={2} className="dialog_grid_container">
					<Grid xs={12} md={4} className="izq">
						<Carousel className="dialog_carousel">
							{product.images.map((image, i) => (
								<img className="dialog_carousel_image" key={i} src={image} alt="" />
							))}
						</Carousel>
					</Grid>

					<Grid xs={12} md={8} className="der">
						Precio: ${product.price}
						{Object.keys(product.personalizedFields).map((key, i) => (
							<div key={"attr_" + i}>
								{key}: {product.personalizedFields[key]}
							</div>
						))}
					</Grid>
				</Grid>


				</form>
				


			</DialogContent>

			<DialogActions>
				<Button type="submit" form="product_information_dialog_form" variant="contained" color="primary">
					Añadir al Carrito
				</Button>

				<Button onClick={handleClose}>Salir</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ProductDialog
