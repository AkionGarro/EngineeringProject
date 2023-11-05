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
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { useAuth } from "../../context/AuthContext";

import Swal from "sweetalert2";
import LogoVeroShop from "../../components/Logo/Logo";
import ResponsiveAppBar from "../../components/Navigation/Navigation";
import "./Login.css";

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const goToHomePageAdmin = () => {
    navigate("/");
  };

  const sections = [
    { title: "Realizar pedido", url: "#" },
    { title: "Acerca de", url: "#" },
    { title: "Contacto", url: "#" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogle = async () => {
    try {
      await auth.loginWithGoogle();
      if (auth.user) {
        goToHomePageAdmin();
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
        await auth.login(data.email, data.password);
        if (auth.user) {
          console.log(auth.user);
          setEmail("");
          setPassword("");
          goToHomePageAdmin();
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
      <ResponsiveAppBar />
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
          <div className="container__logo">
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
                  className="btn__login"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, backgroundColor: "#457B9D" }}
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className="register__info">
                <Link
                  href="/Register"
                  variant="body2"
                  sx={{ color: "#457B9D" }}
                >
                  {"¿No tienes cuenta? ¡Regístrate!"}
                </Link>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item className="google__container">
                <div onClick={handleGoogle}>
                  <div className="google-btn">
                    <div className="google-icon-wrapper">
                      <img
                        className="google-icon"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      />
                    </div>
                    <p className="btn-text">
                      <b>Sign in with google</b>
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
