import React from "react";
import "./personal_order.css";
import {firestore} from "../../firebase";
import { addDoc,collection } from "firebase/firestore";
import {storage} from "../../firebase";
import { ref,uploadBytes,getDownloadURL } from "firebase/storage";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { auth } from "../../firebase"; 
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";

function Personal_Order() {

  const [fields, setFields] = useState([{ description: '', image: null }]);
  const [direction, setDirection] = useState("");
  const referencia =  collection(firestore, "pedidosPersonales");
  const user = auth.currentUser;

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;


  const handleFieldChange = (index, fieldName, value, nombre) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    updatedFields[index]["img_name"] = nombre;
    setFields(updatedFields);
  };
  
  const handleImageUpload = async(index, event) => {
    const archivo = event.target.files[0];
    const refArchivo = ref(storage,`pedidosPersonales/${archivo.name}` )
    await uploadBytes(refArchivo, archivo)
    const file = await getDownloadURL(refArchivo)
    handleFieldChange(index, 'image', file, archivo.name);
  };

  const addFields = () => {
    setFields([...fields, { description: '', image: null }]);
  };

  const removeFields = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus pedidos se borrarán de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
      }
    });
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
        setFields([{ description: "", image: "" }]);
      }
    });
  };
  
  const handleDirectionOnSelect = (event) => {
    setDirection(event.target.value);
    console.log(event.target.value);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    let data = {
      usuario : user.email,
      direccion : direction,
      productos : fields,
      estado : 0
    }

    try {
      const docRef = await addDoc(referencia, data);
      Swal.fire({
        icon: "success",
        title: "¡Pedido Completado!",
        text: "Tu pedido se ha guardado de forma correcta.",
      });
      cleanData();
    }   catch (e) {
        console.error("Error adding document: ", e);
    }
  };
  
  const cleanData = () => {
    setFields([{ description: '', image: null }]);
    setDirection("");
  }
  
  return (
    <Container className="container">
      <h2 className="texto">Pedido Personalizado</h2>
      <h4 className="texto">Envía la descripción e imágenes de los productos que quieras buscar</h4>
      {fields.map((field, index) => (
        <Grid container spacing={3} key={index} className="grid-container">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              value={field.description}
              className="description"
              onChange={(e) =>
                handleFieldChange(index, 'description', e.target.value)
              }
              id="description"
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              name={`image${index}`}
              href="#file-upload"
              onChange={(e) => handleImageUpload(index, e)}
            >
              {fields[index].image ? fields[index].img_name : 'Upload a file'}
              <VisuallyHiddenInput type="file" />
            </Button>  
          </Grid>
          <Grid item xs={12} className="button-container">
            <DeleteIcon
              className="iconoEliminar"
              onClick={() => removeFields(index)}
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
}

export default Personal_Order;