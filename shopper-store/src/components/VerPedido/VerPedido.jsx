import React, { useEffect, useState } from 'react';
import './VerPedido.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFirebase } from "../../context/DatabaseContext.jsx";

const defaultTheme = createTheme();

function VerPedido(props) {
    //recibe la funcion getPedido de props
    const {idPedido} = props;
    const {estado} = props;
    const [order, setOrder] = useState(null);
    const firebase = useFirebase();

    useEffect(() => {
        firebase.getOrder(idPedido).then((doc) => {
           
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
                    <p>Estado: {order.estado}</p>
               
                    <p>Productos:</p>
                    <ul>
                        {order.productos.map((product) => (
                            <li>{product.name} - ${product.price}</li>
                        ))}
                    </ul>
                  
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
