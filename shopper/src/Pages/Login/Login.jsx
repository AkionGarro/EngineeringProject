import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* Material imports */
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
/* Styles imports */
import "./Login.css";
import Swal from "sweetalert2";
import LogoVeroShop from "../../components/Logo/Logo";
import googleIcon from "../../googleIcon/GoogleIcon.png";
import Register from "../Register/Register";
import { useFirebase } from "../../context/DatabaseContext";
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const firebase = useFirebase();
  const [userInfoFlag, setUserFlag] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const goToHomePageAdmin = () => {
    navigate("/HomePageAdmin");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogle = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.loginWithGoogle();
      if (await response) {
        console.log("----------------");
        const userData = {
          email: response.user.email,
          displayName: response.user.displayName,
        };

        await firebase.userIsRegistered(userData).then((res) => {
          if (res) {
            console.log("Usuario registrado");
          } else {
            console.log("Usuario no registrado");
          }
          setUserFlag(true);
        });

        try {
          await firebase.checkUserIsAdmin(userData.email).then((res) => {
            if (res == "admin") {
              console.log(res);
              goToHomePageAdmin();
            } else {
              Swal.fire({
                icon: "error",
                title: "No es administrador",
                text: "No tienes permisos para acceder, comunicarse con VeroCamShop",
              });
            }
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    let data = {
      email: dataForm.get("email"),
      password: dataForm.get("password"),
    };
    if (data.email === "" || data.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, complete todos los campos",
      });
      return;
    } else {
      try {
        await auth.login(data.email, data.password).then((res) => {
          if (res.user) {
            console.log("Usuario encontrado");
          } else {
            console.log("Usuario no encontrado");
          }
        });

        try {
          await firebase.checkUserIsAdmin(data.email).then((res) => {
            if (res == "admin") {
              setEmail("");
              setPassword("");
              goToHomePageAdmin();
            } else {
              Swal.fire({
                icon: "error",
                title: "No es administrador",
                text: "No tienes permisos para acceder, comunicarse con VeroCamShop",
              });
            }
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usuario o contraseña incorrectos",
        });
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  value={email}
                  variant="outlined"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  value={password}
                  type="password"
                  size="medium"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className="register__info">
                <Link href="/Register" variant="body2">
                  {"¿No tienes cuenta? ¡Regístrate!"}
                </Link>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className="google__container">
                <div
                  onClick={(e) => {
                    handleGoogle(e);
                  }}
                >
                  <div className="google-btn">
                    <div className="google-icon-wrapper">
                      <img className="google-icon" src={googleIcon} />
                    </div>
                    <p className="btn-text">
                      <b>Inicio con google</b>
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
