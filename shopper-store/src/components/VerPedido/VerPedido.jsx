import React, { useEffect, useState } from 'react';
import './VerPedido.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFirebase } from "../../context/DatabaseContext.jsx";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { Table, TableBody, TableCell, Typography,TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"

const defaultTheme = createTheme();

function VerPedido(props) {
    //recibe la funcion getPedido de props
    const { idPedido } = props;
    const { estado } = props;
    const [order, setOrder] = useState(null);
    const [nombre, setNombre] = useState("");
    // Agregar un estado para el producto seleccionado y el modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetailsOpen, setProductDetailsOpen] = useState(false);
    const firebase = useFirebase();

    const [atributos, setAtributos] = useState([]);


    const closeProductDetails = () => {
        setSelectedProduct(null);
        setProductDetailsOpen(false);
    };

    const closeDetailsProduct = (product) => {
        props.setProduct(product);
        closeProductDetails();
        props.closeModal();
    };
    const verProducto = (producto) => {


    };

    let indiceProdcutos = 0;

    const getIndeceProcto = () => {
        indiceProdcutos++;
        return indiceProdcutos;
    };

    const openProductModal = (product, row) => {
        console.log("PRODUCTO FOR M0DAL: ", product);
        console.log("Row FOR M0DAL: ", row);

        if(row.valorAtributos !== undefined){
            setAtributos(row.valorAtributos)
            console.log("tiene esa vara")
        }else{
            console.log("no tiene esa vara")
        }

        setProductDetailsOpen(!productDetailsOpen);
        setSelectedProduct(product);
    };

    const columns = [
        { field: "nombre", headerName: "Nombre", width: 300 },
        { field: "cantidad", headerName: "Cantidad", width: 100 },
        { field: "comentario", headerName: "Comentario", width: 300 },
        {
            headerName: "Ver producto",
            width: 300,
            renderCell: (params) => (
                <div>
                    <Stack direction="row" spacing={2}>

                        <Button
                            variant="outlined"
                            id={params.row.id}
                            onClick={() => openProductModal(params.row.producto, params.row )}
                            startIcon={<VisibilityIcon />}
                        ></Button>
                    </Stack>
                </div>
            ),
        },
    ];


    useEffect(() => {
        firebase.getOrder(idPedido).then((doc) => {

            // hacer que en doc.productos en cada producto se guarde el nombre del producto ubicado en producto.name

            doc.productos.forEach((producto) => {
                console.log("PRODUCTO: ", producto);
                try {
                    producto.nombre = producto.producto.name;
                } catch (error) {
                    producto.nombre = producto.name;
                }
            }
            );

            setOrder(doc);

        });

    }, []);
    return (
        <ThemeProvider theme={defaultTheme}>
            <div className="VerPedido">
                {order !== null ? (
                    <div>
                        <h3>El pedido #{order.id} se realizó el {order.fecha} y está actualmente {estado}.</h3>
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

                                        <div>
                                            <Typography variant="h6">Atributos</Typography>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={2} style={{ textAlign: "center" }}>Atributos del Usuario</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {atributos.map((field, index) => (
                                                            <TableRow key={"att-"+index}>
                                                                <TableCell>{field.name}</TableCell>
                                                                <TableCell>{field.value}</TableCell>
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
                        <p>El pedido no existe</p>

                    )}



            </div>
        </ThemeProvider>
    );
}

export default VerPedido;
