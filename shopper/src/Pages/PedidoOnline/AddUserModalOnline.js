import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFirebase } from "../../context/DatabaseContext";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
const AddUserModalOnline = (props) => {
  const auth = useAuth();
  const firebase = useFirebase();

  const handleClose = () => props.setOpen(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [identification, setIdentification] = useState("");

  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [canton, setCanton] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const handleAddress = async (data) => {
    try {
      await firebase.addAddressToUser(data);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    const data = {
      email: dataForm.get("email"),
      password: dataForm.get("password"),
      fullname: dataForm.get("fullName"),
      phone: dataForm.get("phone"),
      identification: dataForm.get("identification"),
    };

    const dataAddress = {
      email: dataForm.get("email"),
      country: dataForm.get("country"),
      province: dataForm.get("province"),
      canton: dataForm.get("canton"),
      district: dataForm.get("district"),
      address: dataForm.get("address"),
    };

    try {
      await auth.register(data.email, data.password);

      try {
        await firebase
          .registerDataUser(
            data.fullname,
            data.email,
            data.phone,
            data.identification
          )
          .finally(() => {
            try {
              handleAddress(dataAddress);
              props.setFlagUpdate(true);
              handleClose();
              Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "Se ha registrado correctamente",
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          });
      } catch (e) {
        console.error("Error adding user: ", e);
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se ha registrado correctamente",
      });
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Registrar Usuario</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label="Correo electrónico"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="fullName"
            name="fullName"
            label="Nombre completo"
            type="text"
            fullWidth
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="phone"
            name="phone"
            label="Teléfono"
            type="text"
            fullWidth
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            margin="dense"
            id="identification"
            name="identification"
            label="Cédula"
            type="text"
            fullWidth
            onChange={(e) => setIdentification(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="country"
            name="country"
            label="País"
            type="text"
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            id="province"
            name="province"
            label="Provincia"
            type="text"
            fullWidth
            required
            onChange={(e) => setProvince(e.target.value)}
          />
          <TextField
            margin="dense"
            id="canton"
            name="canton"
            label="Cantón"
            type="text"
            fullWidth
            onChange={(e) => setCanton(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="district"
            name="district"
            label="Distrito"
            type="text"
            fullWidth
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="address"
            name="address"
            label="Dirección exacta"
            type="text"
            fullWidth
            required
            onChange={(e) => setAddress(e.target.value)}
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit">Registrar</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddUserModalOnline;
