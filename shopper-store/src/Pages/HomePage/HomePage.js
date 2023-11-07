import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Pedidos from "./Pedidos";
import Beneficios from "./Beneficios";
import InfoVero from "./AcercaDe.js";
import Contact from "./Contacto.js";

import Carrousel from "./Carrousel";
import Typography from "@mui/material/Typography";
import ProductsPage from "./../Categories/ProductsPage.jsx";

import online from "../../imagenes/online2.jpg";
import personal from "../../imagenes/pedidoPersonal4.jpg";
import tienda from "../../imagenes/tienda3.jpg";
import Personal_Order from "../PersonalOrdersStore/PersonalOrderStore";
import PedidoOnline from "../PedidoOnline/PedidoOnline.js";

import "./HomePage.css";

const tiposPedidos = [
  {
    title: "Pedido Online",
    description:
      "Envía los enlaces de los productos y nosotros los entregaremos directamente en tu casa.",
    image: online,
    route: <PedidoOnline />,
  },
  {
    title: "Pedido Personal",
    description:
      "Envía detalles y fotos de lo que buscas y nosotros lo encontraremos por ti.",
    image: personal,
    route: <Personal_Order />,
  },
  {
    title: "Pedido en la tienda",
    description: "Elige entre los productos disponibles de la tienda.",
    image: tienda,
    route: <ProductsPage />,
  },
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Blog = (props) => {
  const { goTo } = props;

  const section0 = React.useRef(null);
  const section1 = React.useRef(null);
  const section2 = React.useRef(null);
  const section3 = React.useRef(null);

  const scrollToSection = () => {
    let targetRef = null;
    switch (goTo) {
      case 0:
        targetRef = section0;
        break;
      case 1:
        targetRef = section1;
        break;

      case 2:
        targetRef = section2;
        break;

      case 3:
        targetRef = section3;
        break;

      default:
        targetRef = section1;
        break;
    }

    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme} ref={section0}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main >
          <div>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ mt: 3, textAlign: "center" }}
            >
              En Verocam_shop conseguimos los productos que necesitas de tus
              tiendas favoritas
            </Typography>
            <Carrousel />
          </div>

          <div ref={section1} className="pedidos">
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 3,
                textAlign: "center",
                color: "#457B9D",
                marginBottom: "40px",
              }}
            >
              Realiza tu pedido
            </Typography>
            <Grid container spacing={4}>
              {tiposPedidos.slice(0, 2).map((post) => (
                <Pedidos key={post.title} pedido={post} />
              ))}
              <Grid item xs={12} md={3}></Grid>{" "}
              {/* Espacio para centrar la tercera tarjeta */}
              {tiposPedidos.slice(2).map((post) => (
                <Pedidos key={post.title} pedido={post} />
              ))}
            </Grid>
          </div>

          <div ref={section2}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 3,
                textAlign: "center",
                color: "#457B9D",
                marginTop: "100px",
              }}
            >
              Acerca de Vero
            </Typography>
            <InfoVero />
          </div>

          <div>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 3,
                textAlign: "center",
                color: "#457B9D",
                marginTop: "50px",
              }}
            >
              Beneficios
            </Typography>
            <Beneficios />
          </div>

          <div ref={section3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 3,
                textAlign: "center",
                color: "#457B9D",
                marginTop: "50px",
              }}
            >
              Contacto
            </Typography>
            <Contact />
          </div>
        </main>
      </Container>
      {scrollToSection()}
    </ThemeProvider>
  );
};

export default Blog;
