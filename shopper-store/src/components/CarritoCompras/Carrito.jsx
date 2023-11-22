import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFirebase } from "../../context/DatabaseContext";
import Swal from "sweetalert2";
import Loader from "./Loader";
import { firestore } from "../../firebase";
import { addDocument } from "../../firebase";
import { collection } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";

import "./Carrito.css";

const Carrito = (props) => {
  const [carrito, setCarrito] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [cantidadArt, setCantidadArt] = useState(0);
  const [cantidadFlag, setCantidadFlag] = useState(true);
  const { onClose } = props;
  const [isOpen, setOpen] = useState(true); // Agrega el estado isOpen
  const ref = collection(firestore, "pedidosTest");
  const [loading, setLoading] = useState(true);
  const firebase = useFirebase();

  const email = localStorage.getItem("currentUser");

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
        handleClose();
      }
    });
  };

  const buyItems = async () => {
    let noErrors = true;

    try {
      // Verificar la cantidad de productos en el carrito
      for (let producto of carrito) {
        if (producto.cantidad == null) {
          await Swal.fire({
            title: "Tenemos un problema",
            text: "Hay un problema con la cantidad de uno de tus productos dentro del carrito de compras",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Revisar manualmente mis productos",
          });

          noErrors = false;
          // Lanza una excepción si hay un problema con la cantidad
          throw new Error(
            "Problema con la cantidad de productos en el carrito"
          );
        }
      }

      if (noErrors) {
        // Obtener información del usuario
        const userInfo = await firebase.getUserData(email);

        const productos = carrito.map((producto) => {
          return `Producto: ${producto.name} -- *Comentario*: ${producto.comentario} `;
        });
        const message = productos.join("\n");
        const phoneNumber = "+16892007520";

        // Construir el objeto de datos
        let data = {
          usuario: email,
          direccion:
            userInfo && userInfo.direccionEnvio !== null
              ? userInfo.direccionEnvio
              : "Direccion no especificada",
          productos: carrito,
          estado: "1",
        };

        Swal.fire({
          title: "Advertencia",
          text: "El precio final del pedido incluye gastos adicionales por servicio y peso. Para obtener más detalles sobre el monto total de su pedido, no dude en contactar a Veronica",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, quiero realizar mi pedido",
          cancelButtonText: "No, quiero cancelar mi pedido",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await addDocument(ref, data);

            // Mostrar mensaje de éxito
            await Swal.fire({
              icon: "success",
              title: "¡Pedido Completado!",
              text: "Tu pedido se ha guardado de forma correcta.",
            });

            // Limpiar el carrito y cerrar el diálogo
            setCarrito([]);
            localStorage.setItem("carritoCompras", JSON.stringify([]));

            //===============================================================

            // Construye la URL de WhatsApp
            const url =
              "https://wa.me/" +
              phoneNumber +
              "?text=" +
              encodeURIComponent(
                `*Pedido en Tienda*\n\n` +
                  `*Nombre:* ${userInfo.fullName}\n\n` +
                  `*Productos:*\n${message}\n\n` +
                  `_[Enviado desde la página web de VeroCam Shop]_`
              );

            try {
              // Abre una nueva ventana o pestaña con la URL
              window.open(url, "_blank").focus();
            } catch (error) {
              console.log(error);
            }
          }
        });
        handleClose();
      }
    } catch (error) {
      // Manejar la excepción, si se lanzó
      console.error("Error:", error.message);
    } finally {
      if (!noErrors) {
        console.error("Error: no se ha realizado la compra");
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      var carritoComprasJSON = localStorage.getItem("carritoCompras");

      if (carritoComprasJSON !== null) {
        var carritoCompras = JSON.parse(carritoComprasJSON);

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

  const handleClose = () => {
    setOpen(false); // Usa setOpen para actualizar el estado
    onClose(); // Llama a la función handleClose proporcionada por props
  };

  return (
    <Dialog
      className="containerCarrito"
      open={isOpen}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="scroll-dialog-title" className="button-cerrar-carrito">
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading === true ? (
          <Loader />
        ) : carrito.length === 0 ? (
          <div>
            <h2>Carrito de Compras Vacío</h2>
          </div>
        ) : (
          <>
            <h1>Carrito de Compras</h1>
            <div className="carrito-resumen">
              <h2>Detalle de Compra</h2>
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
      </DialogContent>
    </Dialog>
  );
};

export default Carrito;
