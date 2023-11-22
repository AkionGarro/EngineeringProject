import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material"; // Import icons
import "./Account.css";
import { useFirebase } from "../../context/DatabaseContext";
import Swal from "sweetalert2";
function Account() {
  const firebase = useFirebase();
  const [updateInfo, setUpdateInfo] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [msgAdvertencia, setMsgAdvertencia] = useState("");
  const [identification, setIdentification] = useState(0);
  const [address, setAddress] = useState({});
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const actualizarMsgAdvertencia = async (msg) => {
    setMsgAdvertencia(msg);
    await firebase.updateUserMessage("EgGnqTxznCwhCAsXVdsk", msg);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    const data = {
      fullName: dataForm.get("fullName"),
      email: dataForm.get("email"),
      phone: dataForm.get("phone"),
      identification: dataForm.get("identification"),
      address: dataForm.get("address"),
      role: dataForm.get("role"),
    };

    try {
      await firebase.updateUserData(data);
      setUpdateInfo(true);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("currentUser");
      const data = await firebase.getUserData(email);

      //llamar a getAdvertenciaMessage para actualizar el mensaje de advertencia
      const msg = await firebase.getAdvertenciaMessage("EgGnqTxznCwhCAsXVdsk");
      setMsgAdvertencia(msg);


      if (
        data.identification == "empty" ||
        data.identification == null ||
        data.identification == undefined ||
        data.phone == "empty" ||
        data.phone == null ||
        data.phone == undefined ||
        data.address == "empty" ||
        data.address == null ||
        data.address == undefined
      ) {
        Swal.fire({
          title: "Por favor completa tu perfil",
          text: "Para poder realizar compras debes completar tu perfil",
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }

      setFullName(data.fullName);
      setEmail(data.email);
      setPhone(data.phone);
      setIdentification(data.identification);
      setAddress(data.direccionEnvio);

      setRole(data.userType);
      setUpdateInfo(false);
    };
    fetchUserData();
  }, [updateInfo]);

  return (
    <div>
      <div className="row">
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} className="profileInfo">
            <Grid container spacing={2} mt={2} ml={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  variant="outlined"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="email"
                  label="Email"
                  name="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="identification"
                  label="Identification"
                  name="identification"
                  variant="outlined"
                  value={identification}
                  onChange={(e) => setIdentification(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="address"
                  label="Address"
                  name="address"
                  variant="outlined"
                  value={address.country + ' , ' + address.province + ' , ' + address.canton + ' , ' + address.district + ' , ' + address.address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="role"
                  label="Role"
                  name="role"
                  variant="outlined"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>

                <IconButton type="submit">
                  <CheckCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </div>
      <div className="row">
 
    <Button
      variant="contained"
      color="primary"
      //aancho 50% y centrado
      style={{ width: "50%", margin: "auto", marginTop: "20px" }}
      onClick={() => {
        Swal.fire({
          title: "Editar mensaje de advertencia",
          input: "textarea",
          inputValue: msgAdvertencia,
          inputLabel: "Nuevo mensaje de advertencia",
          inputPlaceholder: "Nuevo mensaje de advertencia",
          showCancelButton: true,
          confirmButtonText: "Guardar",
          cancelButtonText: "Cancelar",
          showLoaderOnConfirm: true,
          preConfirm: (msg) => {
            actualizarMsgAdvertencia(msg);
          },
          allowOutsideClick: () => !Swal.isLoading(),
          inputAttributes: {
            style: 'resize: vertical; height: 200px;', // Ajusta el estilo según sea necesario
          },
        });
      }}
    >
      Editar mensaje de advertencia de compra
    </Button>

</div>

    </div>
  );
}

export default Account;
