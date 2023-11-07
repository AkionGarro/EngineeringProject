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

const PedidoOnline = () => {
  const api = useFirebase();

  const [actualName, setActualName] = useState("");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [label, setLabel] = useState();
  const [address, setAddress] = useState([]);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const ref = collection(firestore, "pedidosOnline");
  const [linkFields, setLinkFields] = useState([{ link: "", comentario: "" }]);
  const auth = useAuth();
  const user = auth.currentUser;

  const cleanData = () => {
    setLinkFields([{ link: "", comentario: "" }]);
    setDireccionSeleccionada("");
    setLabel("");
  };

  const handleSelect = (event) => {
    setLabel(event.target.value);
    const jsonObject = JSON.parse(event.target.value);
    setDireccionSeleccionada(jsonObject);
  };

  useEffect(() => {
    const datosUser = async () => {
      //Direcciones
      //const direcciones = await api.getUserAdress("josuedaniel.cha@gmail.com");
      //setAddress(direcciones);
      //===================================================================================
      const usuario = await api.getUserData(auth.user.email);
      console.log(usuario);
      if (usuario == undefined) {
        let nameUser = auth.user.displayName;
        setActualName(nameUser);
      } else {
        setActualName(usuario.fullName);
      }
    };
    datosUser();

    // Realiza algún efecto secundario aquí, como una solicitud de red.
  }, []);

  const handleSubmit = (e) => {
    //=========================================================
    e.preventDefault();
    // Obtén los datos de linkFields
    const productos = linkFields.map((field) => {
      return `Producto: ${field.link} -- *Comentario*: ${field.comentario} `;
    });

    // Construye el mensaje con los productos
    const message = productos.join("\n");

    // Número de teléfono de WhatsApp
    const phoneNumber = "+50685045830";

    // Construye la URL de WhatsApp
    const url =
      "https://wa.me/" +
      phoneNumber +
      "?text=" +
      encodeURIComponent(
        `*Nombre:* ${actualName}\n\n` +
          `*Productos:*\n${message}\n\n` +
          `_[Enviado desde la página web de VeroCam Shop]_`
      );

    // Abre una nueva ventana o pestaña con la URL
    window.open(url, "_blank").focus();

    //=========================================================

    let data = {
      usuario: selectedUser.email,
      direccion: direccionSeleccionada,
      productos: linkFields,
      estado: 0,
    };

    try {
      addDocument(ref, data);
      Swal.fire({
        icon: "success",
        title: "¡Pedido Completado!",
        text: "Tu pedido se ha guardado de forma correcta.",
      });
      cleanData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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
        setLinkFields([{ link: "", comentario: "" }]);
      }
    });
  };

  const removeField = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus pedidos se borrarán de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
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
    setLinkFields([...linkFields, { link: "", comentario: "" }]);
  };

  const handleLinkChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].link = event.target.value;
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
              value={field.link}
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
          + Agregar otro producto
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
      </div>
    </Container>
  );
};

export default PedidoOnline;
