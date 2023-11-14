import React, {useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { firestore } from "../../firebase";
import { collection } from "firebase/firestore";
import { addDocument } from "../../firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { auth } from "../../firebase";
import "./PedidoNormal.css";
import AddProductForm from "./AddProductForm";
import { useFirebase } from "../../context/DatabaseContext"
import AddUserModal from "../PersonalOrders/AddUserModal"
const PedidoNormal = () => {
  const ref = collection(firestore, "pedidosTest");
  const [linkFields, setLinkFields] = useState([{ producto: null, cantidad: null, comentario:null }]);
  const [flagUpdate, setFlagUpdate] = useState(false)
  const user = auth.currentUser;
  const api = useFirebase()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")

  const cleanData = () => {
    setLinkFields([{ producto: null, cantidad: null, comentario:null }]);

  };
  const [searchQuery, setSearchQuery] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataUser = await api.getUserData(selectedUser.email);
    const direccion = dataUser.direccionEnvio;

    let data = {
      direccion: direccion,
      estado: "0",
      usuario: selectedUser.email,
      productos: linkFields,
      
    };

    console.log("PEDIDO COMÚN: ", data);

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
    setLinkFields([...linkFields, { producto: null, cantidad: null, comentario:null }]);
  };

  const handleCantidadChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].cantidad = event.target.value;
    setLinkFields(updatedFields);
  };

  const handleCommentaryChange = (event, index) => {
    const updatedFields = [...linkFields];
    updatedFields[index].comentario = event.target.value;
    setLinkFields(updatedFields);
  };

 
  const [loading, setLoading] = useState(true)

	const [open, setOpen] = useState(false)
	const [openUsersModal, setOpenUsersModal] = useState(false)

  
	

  const [indexField, setIndexField] = useState(null);
  

  const setProducttoField = (product) =>{
    const updatedFields = [...linkFields]
    updatedFields[indexField]["producto"] = product;
    setLinkFields(updatedFields);
  }

  const handleOpenModal = (index) => {
    setIndexField(index);

		setOpen(true);
	}

  const handleOpenModalUsers = () => {
		setOpenUsersModal(true)
	}

  const handleCloseModalUsers = () => {
		setOpenUsersModal(false)
	}

	const handleCloseModal = () => {
		setOpen(false)
		setLoading(true)
	}

  useEffect(() => {
		const fetchData = async () => {
			try {
				const querySnapshot = await api.getAllUsers()
				const userData = []

				for (const doc in querySnapshot) {
					userData.push(querySnapshot[doc])
				}
        
				const filteredUsers = userData.filter(user => user.email)
				setUsers(filteredUsers)
		
			} catch (error) {
				Swal.fire({
					icon: "error",
					title: "Error al obtener usuarios",
					text: error
				})
			}
		}
		setFlagUpdate(false)

		fetchData()
	}, [flagUpdate, searchQuery])

  return (
    <Container className="container">
      <h2 className="texto">Pedido Común</h2>
      <h4 className="texto">
        Crea una nueva orden de compra
      </h4>
      {linkFields.map((field, index) => (
        <Grid container spacing={3} key={index} className="grid-container">
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal(index)}
              className="add-button"
            >
              + Agregar un producto
            </Button>
          </Grid>
          {/* un grid com un TexField de Cantidad */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cantidad"
              variant="outlined"
              value={field.cantidad}
              onChange={(e) => handleCantidadChange(e, index)}
              className="cantidad"
              required
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Producto"
              variant="outlined"
              value={field.producto == null ? "No se ha seleccionado" : field.producto.name }
              className="comentario"
              disabled = {true}
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
          Selecciona un usuario asociado al pedido
        </h4>
        <Autocomplete
							options={users}
							getOptionLabel={user => user.email}
							
							onChange={(event, newValue) => {
              
								setSelectedUser(newValue)
							}}
							renderInput={params => (
								<TextField
									{...params}
									label="Buscar por correo electrónico"
                  placeholder="Escribe el correo electrónico del usuario"
									variant="outlined"
									fullWidth
									InputProps={{
										...params.InputProps,
										startAdornment: <SearchIcon position="start" fontSize="small" />
									}}
									onChange={e => setSearchQuery(e.target.value)}
                 
								/>
							)}
							isOptionEqualToValue={(option, value) => option.email === value.email}
							noOptionsText="No hay resultados"
							PopperProps={{
								anchorOrigin: {
									vertical: "top",
									horizontal: "right"
								},
								transformOrigin: {
									vertical: "bottom",
									horizontal: "right"
								}
							}}
						/>
					<div
						className="addUser__button"
						onClick={() => {
							handleOpenModalUsers()
						}}>
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
      <AddProductForm open={open} closeModal={handleCloseModal} setProduct={setProducttoField} />
      <AddUserModal open={openUsersModal} setOpen={setOpenUsersModal} setFlagUpdate={setFlagUpdate} />
    </Container>
  );
};

export default PedidoNormal;
