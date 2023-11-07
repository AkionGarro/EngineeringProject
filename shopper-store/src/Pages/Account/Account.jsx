import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Paper, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Edit as EditIcon, CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material"; // Import icons
import "./Account.css";
import { useFirebase } from "../../context/DatabaseContext";
import { useAuth } from "../../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import AddAddress from "./AddAddress.jsx"

function Account() {
  const firebase = useFirebase();
  const [updateInfo, setUpdateInfo] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identification, setIdentification] = useState(0);
  const [address, setAddress] = useState([]);
  const [addressEnvio, setAddressEnvio] = useState({});
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(false);
  const auth = useAuth();
  const [flagUpdate, setFlagUpdate] = useState(false);

  const [label, setLabel] = useState();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (event) => {
    setLabel(event.target.value);
    const jsonObject = JSON.parse(event.target.value);
    setDireccionSeleccionada(jsonObject);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    const data = {
      fullName: dataForm.get("fullName"),
      email: dataForm.get("email"),
      phone: dataForm.get("phone"),
      identification: dataForm.get("identification"),
      direccionEnvio: direccionSeleccionada,
      role: dataForm.get("role"),
    };

    try {
      await firebase.updateUserData(data);
      setUpdateInfo(true);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (auth.user) {
      setUser(auth.user.email);
    }
    const fetchUserData = async () => {
      const data = await firebase.getUserData("josuedaniel.cha@gmail.com");
      setFullName(data.fullName);
      setEmail(data.email);
      setPhone(data.phone);
      setIdentification(data.identification);
      setAddressEnvio(data.direccionEnvio);
      const direcciones = await firebase.getUserAdress("josuedaniel.cha@gmail.com")
      setAddress(direcciones);
      setRole(data.userType);
      setUpdateInfo(false);
    };
    fetchUserData();
  }, [flagUpdate,updateInfo]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Paper className="profileInfo">
          <Grid container spacing={2} mt={2} ml={2}>
            <Grid item xs={11} sm={5}>
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
            <Grid item xs={11} sm={5}>
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
            <Grid item xs={11} sm={5}>
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
            <Grid item xs={11} sm={5}>
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
            <Grid item xs={11} sm={5}>
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
            <Grid item xs={11} sm={5}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="direccionEnvio"
                label="Direccion de envio"
                name="direccionEnvio"
                variant="outlined"
                value={addressEnvio.country + ' , ' + addressEnvio.province + ' , ' + addressEnvio.canton + ' , ' + addressEnvio.district + ' , ' + addressEnvio.address}
                disabled={true}
                fullWidth
              />
            </Grid>
            <Grid item xs={11} sm={5}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="direccion-label">Selecciona una dirección</InputLabel>
                <Select
                  disabled={!isEditing}
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
            </Grid>
            <Grid item xs={11}>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Agregar Direccion
              </Button>

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
      <AddAddress
        open={open}
        setOpen={setOpen}
        setFlagUpdate={setFlagUpdate}
      />
    </>
  );
}

export default Account;
