import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useFirebase } from '../../context/DatabaseContext';

import './EditModal.css'; // Importa tu archivo de estilos CSS

const EditModal = ({ isOpen, onClose, idOrderModal, getIdFunc, getOrdersFunc, filter }) => {
  const [order, setOrder] = useState(null);
  const [idOrder, setOrderId] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(''); // Estado local para el valor seleccionado
  const firebase = useFirebase();

  useEffect(() => {
    console.log("ID que accede MODAL: ", idOrderModal);
    setOrderId(getIdFunc());
    console.log("ID que accede FB: ", idOrder);
    firebase.getOrder(idOrderModal).then((data) => {
      setOrder(data);
      console.log("DATOS EN MODAL para ID", idOrder, data);
      try {
        setSelectedStatus(data.pedido.estado);
      } catch (error) {
        
      }
    });
  }, [idOrderModal]);

  const handleStatusChange = (event) => {
    // Actualiza el estado local cuando cambia la selección del usuario
    setSelectedStatus(event.target.value);
  };

  const handleSave = async () => {
    // Accede al valor seleccionado desde el estado local
    console.log('Valor seleccionado:', selectedStatus);
    // Actualiza el estado del pedido en la base de datos
    await firebase.changeStateOrder(idOrderModal, selectedStatus);
    getOrdersFunc(filter);
    // Aquí puedes realizar la lógica para guardar el nuevo estado del producto
    // Puedes usar newState para obtener el nuevo estado del producto
    // Luego, cierra el modal utilizando onClose()
    onClose();
  };

  return (
    <div>
      {isOpen && <div className="modal-background" onClick={onClose} />}
      <Dialog open={isOpen} onClose={onClose} fullWidth={true} maxWidth="lg" maxHeight="lg">
        <DialogTitle className="modal-title">Editar Pedido ID: {idOrderModal}</DialogTitle>

        <DialogContent>
          <div className="client-name">
            Nombre del cliente: <span className="client-name-span">{order == null ? 'Estado no disponible' : order.pedido.cliente}</span>
          </div>
          {order !== null && (
            <div className="order-status">
              Estado del pedido:
              <select onChange={handleStatusChange} id="estado" className="order-status-select" value={order == null ? 'Estado no disponible' : selectedStatus}>
                {order && order.pedido.estado && (
                  <option value={order.pedido.estado}>{order.pedido.estado}</option>
                )}
                {["Pendiente de confirmación", "En proceso", "Pendiente de pago", "Pagado", "Enviado", "Recibido" /* Add more options as needed */].map((option) => (
                  option !== order.pedido.estado && (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                ))}
              </select>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} className="cancel-button">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="save-button">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditModal;
