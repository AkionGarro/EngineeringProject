import * as React from 'react';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from '@mui/icons-material/Cancel';
import {
    Select,
    MenuItem,
    Container,
} from "@mui/material";
import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import Add_product from "./Add_Product_Personal";
import "./Order_Details.css";
import { useFirebase } from "../../context/DatabaseContext";

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

export default function DetallePedidoModal({ visible, onCancel, idModal }) {
    const firebase = useFirebase();
    const [estado, setEstado] = useState("");
    const estados = ['Pendiente de confirmación', 'En proceso', 'Pendiente de pago', 'Cancelado', 'Pagado', 'Enviado', 'Recibido'];
    const [pedido, setPedido] = useState([]);
    const [productos, setProductos] = useState([]);
    const rows = productos;
    const columns = [
        { field: 'description', headerName: 'Descripción', width: 200 },
        { field: 'image', headerName: 'Link de la imagen', width: 250 },
    ]
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleEstadonOnSelect = (event) => {
        setEstado(event.target.value);
    };
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const getCollection = async () => {
            try {
                const pedidoRef = doc(firestore, 'pedidosPersonales', idModal);
                const pedidoSnapshot = await getDoc(pedidoRef);
                const pedidoData = pedidoSnapshot.data();
                const products = pedidoData.productos;
                setPedido(pedidoData);
                setProductos(products);
            } catch (error) {
                console.error('Error al obtener el documento:', error);
            }
        };

        const fetchUserData = async () => {
            const data = await firebase.getUserData(pedido.usuario);
            setUsuario(data);
        };

        getCollection();
    });

    useEffect(() => {
        const getCollection = async () => {
            try {
                const pedidoRef = doc(firestore, 'pedidosPersonales', idModal);
                const pedidoSnapshot = await getDoc(pedidoRef);
                const pedidoData = pedidoSnapshot.data();
                const products = pedidoData.productos;
                setProductos(products);
            } catch (error) {
                console.error('Error al obtener el documento:', error);
            }
        };
        getCollection();
    }, [isModalOpen == false]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal2 = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Dialog
                open={visible}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth maxWidth="md"
                PaperProps={{
                    style: {
                        maxHeight: "80vh",
                    },
                }}
            >
                <DialogContent>
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={onCancel} startIcon={<CancelIcon />}></Button>
                    </div>
                    <h2 className="titlle_details" >Información del Pedido</h2>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1}}>
                            <h3 className="info">Estado del pedido</h3>
                        </div>
                        <div className="opciones-estados">
                            <Select
                                fullWidth
                                variant="outlined"
                                value={estado}
                                onChange={handleEstadonOnSelect}
                                displayEmpty
                                id="seleccionar"
                                style={{ width: "250px" }}
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
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <h3 className="subtitlle_details">Información del cliente y entrega</h3>
                            <h4 className="info">Nombre del cliente: <p className="info_client"> {usuario ? usuario.fullName : ''}</p></h4>
                            <h4 className="info">Correo:<p className="info_client"> {usuario ? usuario.email : ''}</p></h4>
                            <h4 className="info">Telefono: <p className="info_client">{usuario ? usuario.phone : ''}</p></h4>
                        </div>
                        <div style={{ flex: 1}}>
                            <h3 className="subtitlle_details">Dirección</h3>
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
                    <Container className="button_container">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={openModal}
                            className="add-button"
                        >
                            + Agregar otro producto
                        </Button>
                    </Container>
                    <Add_product
                        visibleModal={isModalOpen}
                        onCancelModal={closeModal2}
                        id={idModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}