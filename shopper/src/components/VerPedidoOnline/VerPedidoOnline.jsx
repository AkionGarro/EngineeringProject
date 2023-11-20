import React, { useEffect, useState } from 'react';
import './VerPedidoOnline.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFirebase } from "../../context/DatabaseContext.jsx";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { Table, TableBody, TableCell, Typography,TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from '@mui/material/Grid';

const defaultTheme = createTheme();

const VerPedidoOnline = ({isOpen,  closeModal, idOnline, estado}) => {
    //recibe la funcion getPedido de props
    const [order, setOrder] = useState(null);
    const [estadoString, setEstadoString] = useState("");
    // Agregar un estado para el producto seleccionado y el modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetailsOpen, setProductDetailsOpen] = useState(false);
    const firebase = useFirebase();

    const closeProductDetails = () => {
        setSelectedProduct(null);
        setProductDetailsOpen(false);
    };

    const closeDetailsProduct = (product) => {
        closeProductDetails();
        closeModal();
    };


    const handleClose = () => {

		closeModal()

	}

    let indiceProdcutos = 0;

    const getIndeceProcto = () => {
        indiceProdcutos++;
        return indiceProdcutos;
    };

    const openProductModal = (product) => {
        setProductDetailsOpen(!productDetailsOpen);

        setSelectedProduct(product);
    };

    const columns = [
        
        { field: "comentario", headerName: "Comentario", width: 600 },
        {
            field: "url",
            headerName: "Link del producto",
            width: 600,
            renderCell: (params) => (
                <RouterLink to={params.row.url} target="_blank">
                    {params.row.url}
                </RouterLink>
            ),
        },
    ];


    useEffect(() => {
        console.log("ID ORDER ONLINE: ",  idOnline);
        firebase.getOrder(idOnline).then((doc) => {

            // hacer que en doc.productos en cada producto se guarde el nombre del producto ubicado en producto.name

            try {
                doc.productos.forEach((producto) => {
                    try {
                        producto.nombre = producto.producto.name;
                    } catch (error) {
                        producto.nombre = producto.name;
                    }
                }
                );
    
                setOrder(doc);
            } catch (error) {
                
            }
            switch (estado) {
                case 0:
                    setEstadoString("En espera")
                    break;
                case 1:
                    setEstadoString("En proceso")
                    break;
                case 2:
                    setEstadoString("Enviado")
                    break;
                case 3:
                    setEstadoString("Entregado")
                    break;
                case 4:
                    setEstadoString("Cancelado")
                    break;
                default:
                    break;
    
            }

        });

    }, [idOnline]);
    return (
        <Dialog
        id="form-modal"
        open={isOpen}
        onClose={handleClose}
        scroll="paper"
        maxWidth="lg"

        aria-labelledby="modal-modal-title"

        aria-describedby="modal-modal-description">
        <DialogContent dividers>
        <ThemeProvider theme={defaultTheme}>
            <div className="VerPedido">
                {order !== null ? (
                    <div>
                       <Grid> <Grid id="Exit_Button" xs={2} display="flex" justifyContent="end" alignItems="center">
                                    <IconButton onClick={handleClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Grid>
                                <Grid id="Title" xs={10}><h3>El pedido #{order.id} se realizó el {order.fecha} y está actualmente {estadoString}.</h3></Grid></Grid>
                        <h2>Detalles del pedido</h2>
                        {/* Modal para mostrar detalles del producto */}
                        <Dialog
                            open={productDetailsOpen}
                            onClose={closeProductDetails}
                            scroll="paper"
                            maxWidth="lg"
                        >
                            <DialogContent dividers>
                                {selectedProduct && (
                                    <div>
                                        <Typography justifyContent={"center"} variant="h5">{selectedProduct.name}</Typography>
                                        <Typography justifyContent={"center"} variant="subtitle2">Categoría: {selectedProduct.categoryName}</Typography>
                                        <Typography variant="subtitle1">Precio: {"$" + selectedProduct.price}</Typography>
                                        <Carousel showThumbs={false}>
                                            {selectedProduct.images.map((imageUrl, index) => (
                                                <div key={index}>
                                                    <img src={imageUrl} style={{ height: '350px', width: 'auto' }} alt={`Imagen ${index}`} />
                                                </div>
                                            ))}
                                        </Carousel>
                                        <div>
                                            <Typography variant="h6">Datos Personalizados</Typography>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{ textAlign: "center" }}>Características</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {Object.keys(selectedProduct.personalizedFields).map((field, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{field}</TableCell>
                                                                <TableCell>{selectedProduct.personalizedFields[field]}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                        {/* Agrega más detalles aquí según tus necesidades */}
                                    </div>
                                )}
                                <div className="row" style={{ display: "flex" }}>
                                    <div className="col">
                                        <Button style={{ marginTop: "5px" }} color="warning" onClick={closeProductDetails} variant="outlined">Cerrar</Button>

                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div >

                            {order.productos.length > 0 ? (
                                <div style={{ overflowX: "auto", display: 'block' }}>
                                    <DataGrid
                                        rows={order.productos}
                                        sx={{ maxWidth: '100%', width: { xs: '99vw', sm: '99vw', md: '99vw', lg: '99vw' }, textAlign: 'center' }}
                                        columns={columns}
                                        getRowId={(row) => getIndeceProcto()}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { page: 0, pageSize: 15 },
                                            },
                                        }}
                                        pageSizeOptions={[5, 10, 15]}
                                        autoHeight
                                    />
                                </div>


                            ) : (
                                <p>No hay órdenes para mostrar.</p>
                            )}



                        </div>

                    </div>
                ) :
                    (
                        <p>Cargando el pedido</p>

                    )}



            </div>
        </ThemeProvider>
        </DialogContent>
    </Dialog>
    );
}

export default VerPedidoOnline;
