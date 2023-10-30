import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFirebase } from "../../context/DatabaseContext";
import Swal from "sweetalert2";
import Loader from "./Loader";
import "./Carrito.css";

const Carrito = () => {
  const api = useFirebase();
  const [carrito, setCarrito] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [cantidadArt, setCantidadArt] = useState(0);
  const [cantidadFlag, setCantidadFlag] = useState(true);
  const [loading, setLoading] = useState(true);

  const agregarAlCarrito = (product) => {
    console.log("Entro a agregarAlCarrito");
    const nuevoCarrito = [...carrito];

    for (let i = 0; i < nuevoCarrito.length; i++) {
      if (nuevoCarrito[i].id === product.id) {
        const productoAumentando = nuevoCarrito[i];
        console.log("Entra condicion id iguales");
        productoAumentando.cantidad += 1;
        console.log(productoAumentando);
        console.log("productoAumentando con cantd 2");
        break;
      }
    }
    setCarrito(nuevoCarrito);
    calcularArticulos(nuevoCarrito);
  };

  const eliminarDelCarrito = (indice) => {
    const nuevoCarrito = [...carrito];
    const elementoParaEliminar = nuevoCarrito[indice];

    if (elementoParaEliminar.cantidad === 1) {
      Swal.fire({
        title: "Quitar producto",
        text: "¿Estás seguro de que quieres eliminar el producto de tu carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, quiero eliminarlo!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          nuevoCarrito.splice(indice, 1);
          setCarrito(nuevoCarrito);
        }
      });
    } else {
      elementoParaEliminar.cantidad -= 1;
      setCarrito(nuevoCarrito);
    }
  };

  const setCantidad = () => {
    for (let i = 0; i < carrito.length; i++) {
      let product = carrito[i];
      product["cantidad"] = 1;
    }
  };

  const calcularMonto = () => {
    let monto = 0;
    for (let i = 0; i < carrito.length; i++) {
      let product = carrito[i];
      monto += product.price * product.cantidad;
    }
    setMontoTotal(monto);
  };

  const calcularArticulos = () => {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
      let product = carrito[i];
      total += product.cantidad;
    }
    setCantidadArt(total);
  };

  const deleteAll = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus productos se borrarán del carrito! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCarrito([]);
      }
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productosCarro = await api.getAllProducts();
      setCarrito(productosCarro);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (carrito.length > 0 && cantidadFlag) {
      setCantidad();
      setCantidadFlag(false);
      setLoading(false);
    }
    calcularMonto();
    calcularArticulos();
  }, [carrito]);

  return (
    <div className="carrito">
      {loading === true ? (
        <Loader />
      ) : carrito.length === 0 ? (
        <div>
          <h2>Carrito de Compras Vacío</h2>
        </div>
      ) : (
        <>
          <h2>Carrito de Compras</h2>
          <div className="carrito-resumen">
            <h3>Detalle de Compra</h3>
            <p className="parrafo-resumen">
              Total de artículos: <strong>{cantidadArt}</strong>
            </p>
            <p className="parrafo-resumen">
              Total a Pagar: <strong>${montoTotal} </strong>
            </p>
            <div className="opciones-button-carrito">
              <Button
                variant="contained"
                color="error"
                onClick={deleteAll}
                className="buttons-carrito"
              >
                Vaciar carrito
              </Button>
              <Button
                variant="contained"
                color="success"
                className="buttons-carrito"
              >
                Realizar Compra
              </Button>
            </div>
          </div>
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
                      id="circle_btn"
                      variant="contained"
                      color="secondary"
                      onClick={() => eliminarDelCarrito(index)}
                    >
                      <RemoveIcon />
                    </Button>
                    <h3>{product.cantidad}</h3>
                    <Button
                      id="circle_btn"
                      variant="contained"
                      color="primary"
                      onClick={() => agregarAlCarrito(product)}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
