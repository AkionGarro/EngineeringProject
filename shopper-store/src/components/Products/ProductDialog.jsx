import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDialog = (props) => {
  const { open, setOpen, product } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const updateCarritoCompras = (product) => {
    var carritoComprasJSON = localStorage.getItem("carritoCompras");
    var carritoCompras = JSON.parse(carritoComprasJSON);
    carritoCompras.push(product);
    var carritoComprasActualizadoJSON = JSON.stringify(carritoCompras);
    localStorage.setItem("carritoCompras", carritoComprasActualizadoJSON);
  };

  const handleAddItem = () => {
    //Obtiene carrito del localStorage
    var carritoComprasJSON = localStorage.getItem("carritoCompras");
    var carritoCompras = JSON.parse(carritoComprasJSON);
    //Encuentra el indice del producto ya existente, contrairo devuelve -1
    var foundProduct = carritoCompras.findIndex(function (elemento) {
      return elemento.id === product.id;
    });

    if (foundProduct === -1) {
      updateCarritoCompras(product);
    } else {
      var productoAumentar = carritoCompras[foundProduct];
      productoAumentar.cantidad += 1;
      localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{product.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Precio: ${product.price}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddItem}>Añadir al Carrito</Button>
        <Button onClick={handleClose}>Salir</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
