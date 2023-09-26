import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { firestore } from "../../firebase";
import { collection } from "firebase/firestore";
import { addDocument } from "../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "./PedidoOnline.css";

const PedidoOnline = () => {
  const ref = collection(firestore, "pedidosOnline");
  const [linkFields, setLinkFields] = useState([{ link: "", comentario: "" }]);
  const [direction, setDirection] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("mando data");
    console.log(linkFields);
    let data = {
      usuario: "Chen",
      productos: linkFields,
      direccion: direction,
      estado: 1,
      telefono: 85627272,
    };
    addDocument(ref, data);
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

  const handleDirectionOnSelect = (event) => {
    setDirection(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Container className="container">
      <h2 className="texto">Pedido Online</h2>
      <h4 className="texto">
        Envía los links de los productos que deseas comprar y estos llegaran a
        tu puerta
      </h4>
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

      <div className="opciones-direccion">
        <h4 className="texto">
          Selecciona la dirección en la cual se entregaran tus productos
        </h4>
        <Select
          fullWidth
          variant="outlined"
          value={direction}
          onChange={handleDirectionOnSelect}
          displayEmpty
          id="seleccionar"
        >
          <MenuItem value="" disabled>
            Seleccionar dirección
          </MenuItem>
          <MenuItem value="rojo">Rojo</MenuItem>
          <MenuItem value="azul">Azul</MenuItem>
          <MenuItem value="verde">Verde</MenuItem>
        </Select>
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
