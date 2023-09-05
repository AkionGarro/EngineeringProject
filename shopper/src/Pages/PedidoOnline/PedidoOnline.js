import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import "./PedidoOnline.css";

const PedidoOnline = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("mando data");
  };

  const [linkFields, setLinkFields] = useState([{ link: "", description: "" }]);
  const [direction, setDirection] = useState("");

  const addFields = () => {
    setLinkFields([...linkFields, { link: "", description: "" }]);
  };

  const handleLinkChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].link = event.target.value;
    setLinkFields(updatedFields);
  };

  const handleDescriptionChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].description = event.target.value;
    setLinkFields(updatedFields);
  };

  const removeFields = (index) => {
    const updatedFields = [...linkFields];
    updatedFields.splice(index, 1);
    setLinkFields(updatedFields);
  };

  const handleDirectionOnSelect = (event) => {
    setDirection(event.target.value);
    console.log(event.target.value);
  };

  return (
    <Container className="container">
      <h2>Pedido Online</h2>
      <h4>
        Envía los links de los productos que deseas comprar y estos llegaran a
        tu puerta
      </h4>
      {linkFields.map((field, index) => (
        <Grid container spacing={2} key={index} className="grid-container">
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Link"
              variant="outlined"
              value={field.link}
              onChange={(e) => handleLinkChange(e, index)}
              id="link"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Comentario"
              variant="outlined"
              value={field.description}
              onChange={(e) => handleDescriptionChange(e, index)}
              id="comentario"
            />
          </Grid>
          <Grid item xs={12} className="button-container">
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeFields(index)}
            >
              Eliminar
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addFields}
        className="add-button"
      >
        + Agregar otro producto
      </Button>

      <div className="opciones-direccion">
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

      <div className="botones-opciones">
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
