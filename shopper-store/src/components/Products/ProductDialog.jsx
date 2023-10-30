import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDialog = (props) => {

  const {open, setOpen, product} = props 


  const handleClose = () => {
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
          <Button onClick={handleClose}>Añadir al Carrito</Button>
          <Button onClick={handleClose}>Salir</Button>
        </DialogActions>
      </Dialog>
  );
}


export default ProductDialog