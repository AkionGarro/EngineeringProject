import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFirebase } from "../../context/DatabaseContext";
import Loader from "./Loader";
import "./Carrito.css";

const Carrito = () => {
  const api = useFirebase();
  const [carrito, setCarrito] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);

  const agregarAlCarrito = (elemento) => {
    setCarrito([...carrito, elemento]);
  };

  const eliminarDelCarrito = (indice) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(indice, 1);
    setCarrito(nuevoCarrito);
  };

  const calcularMonto = () => {
    let monto = 0;
    for (let i = 0; i < carrito.length; i++) {
      let product = carrito[i];
      monto += product.price;
    }
    console.log("Monto");
    console.log(monto);
    setMontoTotal(monto);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productosCarro = await api.getAllProducts();
      console.log("productos de funcion al firebase");
      console.log(productosCarro);
      setCarrito(productosCarro);
    };
    fetchProducts();
    calcularMonto();
  }, [carrito]);

  return (
    <div className="carrito">
      <h2>Carrito de Compras</h2>
      <div className="carrito-items">
        {carrito.map((product, index) => (
          <Card className="card" key={index}>
            <CardContent>
              <h3>Nombre: {product.name}</h3>
              <h3>Color: {product.personalizedFields.Color}</h3>
              <p>Precio: ${product.price}</p>
              <img
                className="image-product"
                src={product.images[0]}
                alt={`producto ${product.name}`}
              />
              <div className="card-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => agregarAlCarrito(product)}
                >
                  Agregar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<RemoveIcon />}
                  onClick={() => eliminarDelCarrito(index)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="carrito-resumen">
        <h3>Resumen de Compra</h3>
        <p>Total de Productos: {carrito.length}</p>
        <p>Total a Pagar: ${montoTotal}</p>
        <Button variant="contained" color="primary">
          Realizar Compra
        </Button>
      </div>
    </div>
  );
};

export default Carrito;
