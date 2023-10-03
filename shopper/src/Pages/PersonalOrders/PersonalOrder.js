import React from "react";
import "./PersonalOrder.css";
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
import { useState } from 'react';
import { auth } from "../../firebase"; 
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadImageInput from "../../components/AdminCategories/UploadImageInput"

function Personal_Order() {

  const [fields, setFields] = useState([{ description: '', image: null , url_file:null, url_fire: null}]);
  const [imagenes, setImagenes] = useState([]);
  const [direction, setDirection] = useState("");
  const referencia =  collection(firestore, "pedidosPersonales");
  const user = auth.currentUser;

  const handleFieldChange = (index , fieldName,value ) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    setFields(updatedFields);
  };

  const handleIconChange = (index, event) => {
		const archivo = event.target.files[0]

		if (archivo) {
			const iconImageUrl = URL.createObjectURL(archivo)
			const updatedFields = [...fields];
      updatedFields[index]["image"] = archivo.name;
      updatedFields[index]["url_file"] = iconImageUrl;
      const updatedImagenes = [...imagenes];
      updatedImagenes[index] = archivo;
      setFields(updatedFields);
      setImagenes(updatedImagenes);
		}
	}

  const addFields = () => {
    setFields([...fields, { description: '', image: null , url_file:null, url_fire: null }]);
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
        const updatedImagenes = [...imagenes];
        updatedImagenes.splice(index, 1);
        setImagenes(updatedImagenes);
        console.log(fields);
        console.log(imagenes);
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
        setFields([{ description: '', image: null , url_file: null, url_fire: null }]);
      }
    });
  };
  
  const handleDirectionOnSelect = (event) => {
    setDirection(event.target.value);
    console.log(event.target.value);
  };

  const handleSubmit = async(event) => {
    console.log(fields)
    event.preventDefault();

    for (let i = 0; i < imagenes.length; i++) {
      const foto = imagenes[i];
      const refArchivo = ref(storage,`pedidosPersonales/${foto.name}` )
      await uploadBytes(refArchivo, foto)
      const file = await getDownloadURL(refArchivo)
      const updatedFields = [...fields];
      updatedFields[i]["url_fire"] = file;
      setFields(updatedFields);
    }

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
    setFields([{ description: '', image: null ,url_file: null, url_fire: null }]);
    setDirection("");
  }
  
  return (
    <Container className="container_personal">
      <h2 className="texto">Envía descripción e imágenes de los productos que quieras adquirir</h2>
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
            <UploadImageInput
              imageUrl={fields[index]["url_file"]}
              buttonTitle={fields[index]["image"]}
              label={null}
              onChange={(e) =>
                handleIconChange(index, e)}
            />
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