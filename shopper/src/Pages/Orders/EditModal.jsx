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
      let filtro = null;
      try {
        switch (data.estado) {
          case "0":
            filtro = "Pendiente de confirmación";
            break;
          case "1":
            filtro = "En proceso";
            break;
          case "2":
            filtro = "Pendiente de pago";
            break;
          case "3":
            filtro = "Cancelado";
            break;
          case "4":
            filtro = "Pagado";
            break;
          case "5":
            filtro = "Enviado";
            break;
          case "6":
            filtro = "Recibido";
            break;
          default:
            filtro = null;
            break;
        }
        setSelectedStatus(filtro);
      } catch (error) {
        
      }
    });
  }, [idOrderModal]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSave = async () => {
    // Accede al valor seleccionado desde el estado local
    console.log('Valor seleccionado:', selectedStatus);
    let finalStatus = null;
    switch (selectedStatus) {
      case "Pendiente de confirmación":
        finalStatus = "0";
        break;
      case "En proceso":
        finalStatus = "1";
        break;
      case "Pendiente de pago":
        finalStatus = "2";
        break;
      case "Cancelado":
        finalStatus = "3";
        break;
      case "Pagado":
        finalStatus = "4";
        break;
      case "Enviado":
        finalStatus = "5";
        break;
      case "Recibido":
        finalStatus = "6";
        break;
      default:
        finalStatus = null;
        break;
    }
    // Actualiza el estado del pedido en la base de datos
    await firebase.changeStateOrder(idOrderModal, finalStatus);
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
            Nombre del cliente: <span className="client-name-span">{order == null ? 'Estado no disponible' : order.cliente}</span>
          </div>
          {order !== null && (
            <div className="order-status">
              Estado del pedido:
              <select onChange={handleStatusChange} id="estado" className="order-status-select" value={order == null ? 'Estado no disponible' : selectedStatus}>
                {order && order.estado && (
                  <option value={selectedStatus}>{selectedStatus}</option>
                )}
                {["Pendiente de confirmación", "En proceso", "Pendiente de pago", "Cancelado", "Pagado", "Enviado", "Recibido"].map((option) => (
                  option !== selectedStatus && (
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
