import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Register.css";
import LogoVeroShop from "../../components/Logo/Logo";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/DatabaseContext";
import Swal from "sweetalert2";

const defaultTheme = createTheme();
const Register = () => {
  const auth = useAuth();
  const firebase = useFirebase();
  const navigate = useNavigate();

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

  const goToLogin = () => {
    navigate("/");
  };

  const handleAddress = async (data) => {
    try {
      await firebase.addAddressToUser(data);

      setCountry("");
      setProvince("");
      setCanton("");
      setDistrict("");
      setAddress("");
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
    const direccion = {
      address: dataAddress.address,
      canton: dataAddress.canton,
      country: dataAddress.country,
      district: dataAddress.district,
      email: dataAddress.email,
      province: dataAddress.province,
    };
    try {
      await auth.register(data.email, data.password);

      try {
        await firebase
          .registerDataUser(
            data.fullname,
            data.email,
            data.phone,
            data.identification,
            direccion
          )
          .finally(() => {
            try {
              handleAddress(dataAddress);
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

      setEmail("");
      setPassword("");
      setFullname("");
      setPhone("");
      setIdentification("");

      goToLogin();
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
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="container">
            <LogoVeroShop />
          </div>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Nombre Completo"
                  autoFocus
                  onChange={(e) => setFullname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  id="phone"
                  label="Telefono"
                  name="phone"
                  type="number"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  id="identification"
                  label="Cédula"
                  name="identification"
                  type="number"
                  onChange={(e) => setIdentification(e.target.value)}
                />
              </Grid>
            </Grid>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Dirección de Envío <br />
            </Typography>

            <div className="container__address">
              <TextField
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                id="country"
                label="País"
                name="country"
                type="text"
                onChange={(e) => setCountry(e.target.value)}
              />

              <TextField
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                id="province"
                label="Provincia"
                name="province"
                type="text"
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>

            <div className="container__address">
              <TextField
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                id="canton"
                label="Cantón"
                name="canton"
                type="text"
                onChange={(e) => setCanton(e.target.value)}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                id="district"
                label="Distrito"
                name="district"
                type="text"
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>

            <div className="container__address">
              <TextField
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
                id="address"
                label="Dirección exacta"
                name="address"
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item className="login__info">
                <Link href="/" variant="body2">
                  ¿Ya tienes cuenta? ¡Inicia Sesión!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
