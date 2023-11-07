import React from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Contacto.css";
const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.currentTarget);
    var phoneNumber = "+50685045830";
    const data = {
      nombre: dataForm.get("nombre"),
      mensaje: dataForm.get("mensaje"),

    }
    var url = "https://wa.me/" + phoneNumber + "?text="
      + "*Nombre: " + data.nombre + "%0a"
      + "*Mensaje: " + data.mensaje + "%0a%0a"
      + "*Enviado desde la página web de Shopper*";
    window.open(url, '_blank').focus();

    //e.currentTarget.reset();
   
   
  };

  return (
    <Grid container spacing={3}>
      {/* Columna Izquierda */}
      <Grid item xs={12} sm={6}>
        <Paper
          style={{ padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
        >
          <Typography variant="h6" gutterBottom style={{ color: "#457B9D" }}>
            Contacta directamente a Vero por medio de WhatsApp
          </Typography>
          <Typography variant="p" gutterBottom style={{ color: "gray" }}>
            Envíale un mensaje a Vero y pide tus productos favoritos
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              fullWidth
              variant="outlined"
              margin="normal"
              id="nombre"
              name="nombre"
            />
            <TextField
              label="Mensaje"
              fullWidth
              variant="outlined"
              margin="normal"
              id="mensaje"
              name="mensaje"
              multiline
              rows={4}
            />
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#457B9D" }}
              >
                Enviar
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>

      {/* Columna Derecha */}
      <Grid item xs={12} sm={6}>
        <Paper
          id="contactInfo"
          style={{
            padding: "20px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#457B9D",
          }}
        >
          <Typography
            className="contact__title"
            variant="h6"
            gutterBottom
            color="white"
          >
            ¡Contáctanos!
          </Typography>

          <div>
            <Typography variant="body1" paragraph color="white">
              Estamos aquí para ayudarte. Si tienes alguna pregunta o consulta,
              no dudes en contactarnos.
            </Typography>
            <Typography variant="body1" paragraph color="white">
              Puedes encontrarnos en nuestras redes sociales y cuentas
              oficiales.
            </Typography>
            <Divider style={{ marginBottom: "20px" }} />
            <div className="social">
              <Link href="https://www.facebook.com/" target="_blank">
                <IconButton style={{ color: "white" }}>
                  <FacebookIcon />
                </IconButton>
              </Link>
              <Link href="https://twitter.com/" target="_blank">
                <IconButton style={{ color: "white" }}>
                  <TwitterIcon />
                </IconButton>
              </Link>
              <Link href="https://www.linkedin.com/" target="_blank">
                <IconButton style={{ color: "white" }}>
                  <LinkedInIcon />
                </IconButton>
              </Link>
            </div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ContactForm;
