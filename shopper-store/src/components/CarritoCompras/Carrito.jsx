import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Swal from "sweetalert2";
import Loader from "./Loader";
import { useAuth } from "../../context/AuthContext";
import { firestore } from "../../firebase";
import { addDocument } from "../../firebase";
import { collection } from "firebase/firestore";
import "./Carrito.css";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [cantidadArt, setCantidadArt] = useState(0);
  const [cantidadFlag, setCantidadFlag] = useState(true);
  const ref = collection(firestore, "pedidosTienda");
  const [loading, setLoading] = useState(true);
  const auth = useAuth();
  const email = auth.user.email;

  const agregarAlCarrito = (product, id) => {
    const nuevoCarrito = [...carrito];
    var carritoComprasJSON = localStorage.getItem("carritoCompras");
    var carritoCompras = JSON.parse(carritoComprasJSON);
    var indiceLocalSt = carritoCompras.findIndex(function (elemento) {
      return elemento.id === id;
    });
    var productoLocalSt = carritoCompras[indiceLocalSt];

    for (let i = 0; i < nuevoCarrito.length; i++) {
      if (nuevoCarrito[i].id === product.id) {
        const productoAumentando = nuevoCarrito[i];
        productoAumentando.cantidad += 1;
        productoLocalSt.cantidad += 1;
        localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
        break;
      }
    }
    setCarrito(nuevoCarrito);
    calcularArticulos(nuevoCarrito);
  };

  const eliminarDelCarrito = (indice, id) => {
    const nuevoCarrito = [...carrito];
    const elementoParaEliminar = nuevoCarrito[indice];
    var carritoComprasJSON = localStorage.getItem("carritoCompras");
    var carritoCompras = JSON.parse(carritoComprasJSON);

    var productoEliminar = carritoCompras.findIndex(function (elemento) {
      return elemento.id === id;
    });

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
          //Actualiza carrito de compras en aplicacion y en el localStorage
          nuevoCarrito.splice(indice, 1);
          setCarrito(nuevoCarrito);
          carritoCompras.splice(productoEliminar, 1);
          localStorage.setItem(
            "carritoCompras",
            JSON.stringify(carritoCompras)
          );
        }
      });
    } else {
      elementoParaEliminar.cantidad -= 1;
      setCarrito(nuevoCarrito);
    }
  };

  const setCantidad = () => {
    let flag = false;
    for (let i = 0; i < carrito.length; i++) {
      let product = carrito[i];
      if (!product.hasOwnProperty("cantidad")) {
        flag = true;
      } else {
        flag = false;
      }
      if (flag) {
        product["cantidad"] = 1;
      }
    }
    localStorage.setItem("carritoCompras", JSON.stringify(carrito));
    console.log("carrito con cant");
    var carritoComprasJSON = localStorage.getItem("carritoCompras");
    var carritoCompras = JSON.parse(carritoComprasJSON);
    console.log(carritoCompras);
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
        localStorage.setItem("carritoCompras", JSON.stringify([]));
      }
    });
  };

  const buyItems = async () => {
    let data = {
      usuario: email,
      direccion: "",
      productos: carrito,
      estado: 1,
    };

    try {
      await addDocument(ref, data);
      Swal.fire({
        icon: "success",
        title: "¡Pedido Completado!",
        text: "Tu pedido se ha guardado de forma correcta.",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      var carritoComprasJSON = localStorage.getItem("carritoCompras");

      if (carritoComprasJSON !== null) {
        var carritoCompras = JSON.parse(carritoComprasJSON);
        console.log("Objetos carrito Compras");
        console.log(carritoCompras);

        setCarrito(carritoCompras);

        //Si carritoCompras no esta definido, se estable CarritoCompras como array vacio
      } else {
        setCarrito([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (carrito.length > 0 && cantidadFlag) {
      setCantidad();
      setCantidadFlag(false);
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
                onClick={buyItems}
              >
                Comprar
              </Button>
            </div>
          </div>
          <div className="carrito-items">
            {carrito.map((product, index) => (
              <Card className="card" key={index}>
                <CardContent className="card-Content">
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
                      onClick={() => eliminarDelCarrito(index, product.id)}
                    >
                      <RemoveIcon />
                    </Button>
                    <h3>{product.cantidad}</h3>
                    <Button
                      id="circle_btn"
                      variant="contained"
                      color="primary"
                      onClick={() => agregarAlCarrito(product, product.id)}
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
