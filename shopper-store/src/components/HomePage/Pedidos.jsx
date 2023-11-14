import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import { useAuth } from "../../context/AuthContext";
import { useFirebase } from "../../context/DatabaseContext";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
function Pedidos(props) {
  const { pedido } = props;
  const api = useAuth();
  const firebase = useFirebase();
  const navigate = useNavigate();
  const { setComponentToRender } = useGlobalContext();

  const handleNavoptions = async () => {
    setComponentToRender(pedido.route);
    const userAuth = localStorage.getItem("currentUser");
    if (userAuth == null || userAuth == undefined) {
      Swal.fire({
        icon: "error",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para realizar un pedido",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ir a Login",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        } else {
          console.log("Operación cancelada");
        }
      });
    } else {
      const flagUserInfo = await firebase.checkCompleteUserInfo(userAuth);
      if (await flagUserInfo) {
        console.log("User is logged in");
        setComponentToRender(pedido.route);
      } else {
        Swal.fire({
          icon: "error",
          title: "Perfil incompleto",
          text: "Falta información en tu perfil, por favor completa tu información",
        });
      }
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea
        component="a"
        href={pedido.direccion}
        onClick={handleNavoptions}
      >
        <Card sx={{ display: "flex", height: 200 }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography
              component="h2"
              variant="h5"
              sx={{
                textAlign: "left",
                marginBottom: "1rem",
                color: "#457B9D;",
              }}
            >
              {pedido.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              paragraph
              sx={{ textAlign: "left", fontSize: "1rem" }}
            >
              {pedido.description}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{
              width: 220,
              height: 300,
              display: { xs: "none", sm: "block" },
              marginLeft: 2,
            }}
            image={pedido.image}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default Pedidos;
