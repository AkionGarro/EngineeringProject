// EditModal.jsx

import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useFirebase } from '../../context/DatabaseContext';

import './EditModal.css'; // Importa tu archivo de estilos CSS

const EditModal = ({ isOpen, onClose, idOrderModal, getIdFunc}) => {
  const [newState, setNewState] = useState('');
  const [order, setOrder] = useState(null);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.getOrder(idOrderModal).then((data) => {setOrder(data); console.log("DATOS EN MODAL", data)});
   
  }, [idOrderModal]);


  const handleSave = () => {
    // Aquí puedes realizar la lógica para guardar el nuevo estado del producto
    // Puedes usar newState para obtener el nuevo estado del producto
    // Luego, cierra el modal utilizando onClose()
    onClose();
  };

  return (
    <div>
      {isOpen && <div className="modal-background" onClick={onClose} />}
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth='lg' maxHeight='lg'>
        <DialogTitle style={{}}>Editar Pedido ID: {idOrderModal}</DialogTitle>
        
        <DialogContent>
          <div>Nombre del cliente: <span >{console.log("ORDEN EN SPAN", order)}</span></div>
          {/* <div>Estado del pedido: <input id='estado' type="text" value={order == null ?  'Estado no disponible': order.pedido.estado}/></div>
          <div>Celular: <span ><input id='celular' type="text" value={order == null ?  'Celular no disponible': order.pedido.telefono} /></span></div> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditModal;
