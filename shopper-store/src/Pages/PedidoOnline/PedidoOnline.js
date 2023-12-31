import React, { useState } from "react";

import { useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { firestore } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { collection } from "firebase/firestore";
import { addDocument } from "../../firebase";
import { useFirebase } from "../../context/DatabaseContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./PedidoOnline.css";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import Blog from "../HomePage/HomePage.jsx";

const PedidoOnline = () => {
  const api = useFirebase();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState({});
  const [label, setLabel] = useState();
  const [address, setAddress] = useState([]);
  const ref = collection(firestore, "pedidosOnline");
  const [msgAdvertencia, setMsgAdvertencia] = useState("Advertencia de compra");
  const [linkFields, setLinkFields] = useState([{ url: "", comentario: "" }]);
  const auth = useAuth();
  const email = localStorage.getItem("currentUser");
  const { setComponentToRender } = useGlobalContext();
  const firebase = useFirebase();

  const cleanData = () => {
    setLinkFields([{ link: "", comentario: "" }]);
    setDireccionSeleccionada("");
    setLabel("");
  };

  const handleSelect = (event) => {
    setLabel(event.target.value);
    const jsonObject = JSON.parse(event.target.value);
    setDireccionSeleccionada(jsonObject);
    setLabel("");
  };

  useEffect(() => {
    //llamar a getAdvertenciaMessage en firebase para obtener el mensaje de advertencia
    const getAdvertenciaMessage = async () => {
      const message = await api.getAdvertenciaMessage("EgGnqTxznCwhCAsXVdsk");
      setMsgAdvertencia(message);
    };
    getAdvertenciaMessage();
    
    const datosUser = async () => {
      const email = localStorage.getItem("currentUser");
      //Direcciones
      const direcciones = await api.getUserAdress(email);
      setAddress(direcciones);
      //===================================================================================
      // Obtener información del usuario
      const userInfo = await firebase.getUserData(email);
      setDireccionSeleccionada(userInfo.direccionEnvio);
    };
    
    datosUser();
  }, []);

  const handleSubmit = async (e) => {
    //=========================================================
    e.preventDefault();
    for (let pedido of linkFields) {
      if (pedido.comentario === "" || pedido.link === "") {
        Swal.fire({
          icon: "error",
          title: "Información incompleta",
          text: "Porfavor, revisar que todos los campos en sus pedidos estén completos.",
        });
        return;
      }
    }

    const userInfo = await firebase.getUserData(email);

    let data = {
      usuario: email,
      direccion: direccionSeleccionada,
      productos: linkFields,
      estado: 0,
    };

    const productos = linkFields.map((field) => {
      return `Producto: ${field.link} -- *Comentario*: ${field.comentario} `;
    });

    const message = productos.join("\n");
    const phoneNumber = "+16892007520";

    await addDocument(ref, data);
    Swal.fire({
      icon: "success",
      title: "¡Pedido Completado!",
      text: "Tu pedido se ha guardado de forma correcta.",
    });

    cleanData();
    // Construye la URL de WhatsApp
    const url =
      "https://wa.me/" +
      phoneNumber +
      "?text=" +
      encodeURIComponent(
        `*Pedido Online*\n\n` +
          `*Nombre:* ${userInfo.fullName}\n\n` +
          `*Productos:*\n${message}\n\n` +
          `_[Enviado desde la página web de VeroCam Shop]_`
      );
    window.open(url, "_blank").focus();

    setComponentToRender(<Blog />);
  };

  const deleteAll = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus pedidos se borrarán de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLinkFields([{ url: "", comentario: "" }]);
      }
    });
  };

  const removeField = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Este pedido se borrará de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedFields = [...linkFields];
        updatedFields.splice(index, 1);
        setLinkFields(updatedFields);
      }
    });
  };

  const addFields = () => {
    setLinkFields([...linkFields, { url: "", comentario: "" }]);
  };

  const handleLinkChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].url = event.target.value;
    setLinkFields(updatedFields);
  };

  const handleCommentaryChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].comentario = event.target.value;
    setLinkFields(updatedFields);
  };

  return (
    <Container className="container">
      <h2 className="texto">
        Envía los links de los productos que deseas comprar y estos llegaran a
        tu puerta
      </h2>
      {linkFields.map((field, index) => (
        <Grid container spacing={2} key={index} className="grid-container">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Link"
              variant="outlined"
              value={field.url}
              onChange={(e) => handleLinkChange(e, index)}
              className="link"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comentario"
              variant="outlined"
              value={field.comentario}
              onChange={(e) => handleCommentaryChange(e, index)}
              className="comentario"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12} className="button-container">
            <DeleteIcon
              className="iconoEliminar"
              onClick={() => removeField(index)}
            >
              Icono de Eliminación
            </DeleteIcon>
          </Grid>
        </Grid>
      ))}
      <div className="opciones-botones">
        <Button
          variant="contained"
          color="primary"
          onClick={addFields}
          className="add-button"
        >
          + Agregar producto
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={deleteAll}
          className="add-button"
        >
          Vaciar pedido
        </Button>
      </div>

      <div className="users_container">
        <div className="opciones-direccion">
          <TextField
            InputLabelProps={{ shrink: true }}
            id="direccionEnvio"
            label="Direccion de envio"
            name="direccionEnvio"
            variant="outlined"
            value={
              direccionSeleccionada.country +
              " , " +
              direccionSeleccionada.province +
              " , " +
              direccionSeleccionada.canton +
              " , " +
              direccionSeleccionada.district +
              " , " +
              direccionSeleccionada.address
            }
            disabled={true}
            fullWidth
            className="direccionEnvio"
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="direccion-label">
              Selecciona una dirección
            </InputLabel>
            <Select
              labelId="direccion-label"
              id="direccion"
              value={label}
              onChange={handleSelect}
              label="Selecciona una dirección"
            >
              {address.map((option, index) => (
                <MenuItem key={index} value={JSON.stringify(option)}>
                  {`${option.country}, ${option.province}, ${option.canton}, ${option.district}, ${option.address}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InputLabel htmlFor="direccionEnvio" className="labelDireccion">
            *Selecciona una dirección de envío
          </InputLabel>
        </div>
      </div>

      <div className="boton-enviar">
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          className="send-button"
        >
          Realizar pedido
        </Button>

        <h4 className="advertencia">
          { msgAdvertencia }
        </h4>
      </div>
    </Container>
  );
};

export default PedidoOnline;
