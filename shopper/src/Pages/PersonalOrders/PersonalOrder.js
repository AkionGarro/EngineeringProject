import React from "react";
import { useEffect } from "react";

import { firestore } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { storage } from "../../firebase";
import SearchIcon from "@mui/icons-material/Search";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Button,
  Container,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth } from "../../firebase";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebase } from "../../context/DatabaseContext";
import AddUserModal from "./AddUserModal";
import "./PersonalOrder.css";

function Personal_Order() {
  const api = useFirebase();
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState([{ description: "", image: null }]);
  const [direction, setDirection] = useState("");
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const referencia = collection(firestore, "pedidosPersonales");
  const [open, setOpen] = useState(false);
  const user = auth.currentUser;

  const VisuallyHiddenInput = styled("input")`
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

  const handleAddNewUser = () => {
    console.log("se abrio");
  
  };


  const handleImageUpload = async (index, event) => {
    const archivo = event.target.files[0];
    const refArchivo = ref(storage, `pedidosPersonales/${archivo.name}`);
    await uploadBytes(refArchivo, archivo);
    const file = await getDownloadURL(refArchivo);
    handleFieldChange(index, "image", file, archivo.name);
  };

  const addFields = () => {
    setFields([...fields, { description: "", image: null }]);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = {
      usuario: user.email,
      direccion: direction,
      productos: fields,
      estado: 0,
    };

    try {
      const docRef = await addDoc(referencia, data);
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

  const cleanData = () => {
    setFields([{ description: "", image: null }]);
    setDirection("");
  };

  const handleOpenModal = () => {
		setOpen(true)
	}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await api.getAllUsers();
        const userData = [];
        for (const doc in querySnapshot) {
          userData.push(querySnapshot[doc]);
        }
        const filteredUsers = userData.filter((user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUsers(filteredUsers);
        console.log(userData);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al obtener usuarios",
          text: error,
        });
      }
    };
    setFlagUpdate(false);

    fetchData();
  }, [flagUpdate, searchQuery]);

  return (
    <>
    <Container className="container_personal">
      <h2 className="texto">
        Envía descripción e imágenes de los productos que quieras adquirir
      </h2>
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
                handleFieldChange(index, "description", e.target.value)
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
              {fields[index].image ? fields[index].img_name : "Upload a file"}
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

      <div className="users_container">
        <div className="opciones-direccion">
          <Autocomplete
            options={users}
            getOptionLabel={(user) => user.email}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar por correo electrónico"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <SearchIcon position="start" fontSize="small" />
                  ),
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.email === value.email
            }
            noOptionsText="No hay resultados"
            PopperProps={{
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
            }}
          />
        </div>

        <div className="addUser__button"onClick={() => {handleOpenModal()}}>
          <PersonAddIcon></PersonAddIcon>
          <p>Agregar usuario</p>
        </div>
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

 <AddUserModal open={open} setOpen={setOpen} setFlagUpdate={setFlagUpdate} />
 </>
  );
}

export default Personal_Order;
