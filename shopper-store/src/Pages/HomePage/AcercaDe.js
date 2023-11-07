import React from "react";
import { Grid, Typography } from "@mui/material";
import Vero from "../../imagenes/Vero.jpg";

function InfoVero() {
  const containerStyle = {
    background: "linear-gradient(90deg, transparent, white, transparent)",
    marginTop: "40px",
    marginBottom: "40px",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
    borderRadius: "30px",
  };

  const leftSideStyle = {
    background: "#457B9D",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "30px",
    height: "80vh",
  };

  const rightSideStyle = {
    background: "white",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centra verticalmente
    borderRadius: "30px",
  };

  const titleStyle = {
    color: "#457B9D",
    marginBottom: "10px",
  };

  return (
    <div className="acercaEd" style={containerStyle}>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <div style={leftSideStyle}>
            <img
              src={Vero} // Reemplaza con la ruta de tu imagen
              alt="Imagen"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "30px",
              }}
            />
          </div>
        </Grid>
        <Grid item xs={7}>
          <div style={rightSideStyle}>
            <Typography variant="h3" style={titleStyle}>
              Sobre mi
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "gray",
                fontWeight: "bold",
              }}
            >
              <p textAlign="center">
                ¡Conoce a Verónica Camacho, la mente detrás de VeroCam Shop!
              </p>
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "gray",
                paddingLeft: "50px",
                paddingRight: "50px",
                textAlign: "justify",
              }}
            >
              Soy Verónica, una emprendedora apasionada, fuerte y comprometida
              que se enorgullece de satisfacer a sus clientes en cada compra.
              <br />
              <br />
              Mi objetivo es adaptar mis servicios a tus gustos y necesidades
              individuales. Puedes confiar en que obtendrás productos de alta
              calidad a precios asequibles, sin largos tiempos de espera.
              <br />
              <br />
              Mi misión es eliminar las barreras geográficas para que puedas
              comprar lo que desees desde la comodidad de tu hogar. ¿Estás
              pensando en realizar compras en Estados Unidos desde Costa Rica?
              ¡No dudes en contactarme! Estoy aquí para ayudarte a encontrar
              exactamente lo que necesitas.
              <br />
              <br />
              Bienvenido a una experiencia de compra en línea única con
              Verónica, tu Personal Shopper desde Estados Unidos hasta Costa
              Rica. ¡Confía en nosotros para hacer tus compras realidad!
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default InfoVero;
