import React, { useState } from "react";
import { useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { firestore } from "../../firebase";
import { collection } from "firebase/firestore";
import { addDocument } from "../../firebase";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { useFirebase } from "../../context/DatabaseContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { auth } from "../../firebase";
import AddUserModalOnline from "./AddUserModalOnline";
import "./PedidoOnline.css";

const PedidoOnline = () => {
  const api = useFirebase();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const ref = collection(firestore, "pedidosOnline");
  const [linkFields, setLinkFields] = useState([{ link: "", comentario: "" }]);
  const [direction, setDirection] = useState("");
  const user = auth.currentUser;

  const cleanData = () => {
    setLinkFields([{ link: "", comentario: "" }]);
    setDirection("");
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      usuario: selectedUser.email,
      direccion: direction,
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
          <Autocomplete
            options={users}
            getOptionLabel={(user) => user.email}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
              console.log("Usuario seleccionado");
              console.log(newValue);
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

        <div
          className="addUser__button"
          onClick={() => {
            handleOpenModal();
          }}
        >
          <PersonAddIcon></PersonAddIcon>
          <p>Agregar usuario</p>
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
      <AddUserModalOnline
        open={open}
        setOpen={setOpen}
        setFlagUpdate={setFlagUpdate}
      />
    </Container>
  );
};

export default PedidoOnline;
