import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Select,
    MenuItem,
  } from "@mui/material";
import { useState , useEffect} from "react";
import {firestore} from "../firebase";
import { getDocs, getDoc,collection, doc } from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function DetallePedidoModal({ visible,onCancel, id}) {
    const [estado, setEstado] = useState("");
    const estados = ['Pendiente de confirmación','En proceso','Pendiente de pago','Cancelado','Pagado','Enviado','Recibido'];
    const [pedido, setPedido] = useState([]);
    const [productos, setProductos] = useState([]);
    const rows = productos;
    const columns = [
        { field: 'description', headerName: 'Descripción', width: 200 },
        { field: 'image', headerName: 'Link de la imagen', width: 250},
    ]

    const handleEstadonOnSelect = (event) => {
        setEstado(event.target.value);
    };

    useEffect(() => {
        const obtenerColeccion = async () => {
            try {
                const pedidoRef = doc(firestore, 'pedidosPersonales', id);
                const pedidoSnapshot = await getDoc(pedidoRef);
                if (pedidoSnapshot.exists()) {
                const pedidoData = pedidoSnapshot.data();
                const products = pedidoData.productos;
                setPedido(pedidoData);
                setProductos(products);
                } else {
                console.log('El documento no existe');
                }
            } catch (error) {
                console.error('Error al obtener el documento:', error);
            }
        };
        obtenerColeccion();
    },[]);

    const agregarProducto = (event) => {
        setEstado(event.target.value);
    };

  return (
    <div>
        <Modal
            open={visible}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onCancel} startIcon={<CancelIcon />}></Button>
            </div>
            <h3 style={{ textAlign: 'center' }}>Información del Pedido</h3>
            <div style={{display: 'flex'}}>
                <div style={{flex: 1,padding: '16px',}}>
                    <h3>Estado del pedido</h3>
                </div>
                <div className="opciones-direccion">
                    <Select
                        fullWidth
                        variant="outlined"
                        value={estado}
                        onChange={handleEstadonOnSelect}
                        displayEmpty
                        id="seleccionar"
                        >
                        <MenuItem value="" disabled>
                            {estados[pedido.estado]}
                        </MenuItem>
                        <MenuItem value="0">Pendiente de confirmación</MenuItem>
                        <MenuItem value="1">En proceso</MenuItem>
                        <MenuItem value="2">Pendiente de pago</MenuItem>
                        <MenuItem value="3">Cancelado</MenuItem>
                        <MenuItem value="4">Pagado</MenuItem>
                        <MenuItem value="5">Enviado</MenuItem>
                        <MenuItem value="6">Recibido</MenuItem>
                    </Select>
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{flex: 1,padding: '16px',}}>
                    <h3>Información del cliente y entrega</h3>
                    <h4>Nombre del cliente:<p style={{ display: 'inline',margin: '0',padding: '0'}}>  {pedido.usuario}</p></h4>
                    <h4>Correo:</h4>
                    <h4>Telefono: </h4>
                </div>
                <div style={{flex: 1,padding: '16px',}}>
                    <h3>Dirección</h3>
                </div>
            </div>
            <h3>Productos</h3>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.description}
                initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10, 15]}
                autoHeight 
            />
            <Button
                variant="contained"
                color="primary"
                onClick={agregarProducto}
                className="add-button"
                >
                + Agregar otro producto
                </Button>
        </Box>
      </Modal>
    </div>
  );
}