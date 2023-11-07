import React, { useEffect, useState } from 'react';
import './VerPedido.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFirebase } from "../../context/DatabaseContext.jsx";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";

const defaultTheme = createTheme();

function VerPedido(props) {
    //recibe la funcion getPedido de props
    const { idPedido } = props;
    const { estado } = props;
    const [order, setOrder] = useState(null);
    const [nombre, setNombre] = useState("");
    const firebase = useFirebase();

    const verProducto = (producto) => {
        
        
    };

    let indiceProdcutos = 0;

    const getIndeceProcto = (producto) => {
        console.log("producto", producto);
       
        indiceProdcutos++;
        return indiceProdcutos;
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
                  onClick={() => verProducto(params.row.producto)}
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
                producto.nombre = producto.producto.name;
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
                        
                        <div >
    
                {order.productos.length > 0 ? (
                  <div style={{ overflowX: "auto", display: 'block' }}>
                    <DataGrid
                      rows={order.productos}
                      sx={{ maxWidth: '100%', width: { xs: '99vw', sm: '99vw', md: '99vw', lg: '99vw' }, textAlign: 'center' }}
                      columns={columns}
                      getRowId={(row) => getIndeceProcto(row.producto)}
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
