import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "../../components/HomePage/Navigator";
import Header from "../../components/HomePage/Header";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import "./HomePageAdmin.css";
import Orders from "../Orders/Orders.jsx";
import Products from "../Products/Products.jsx";
import Categories from "../Categories/Categories.jsx";
import NewAdmin from "../NewAdmin/NewAdmin.jsx";
import Account from "../Account/Account.jsx";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        VeroCamShop
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

function Home() {
  // Componente para la página de inicio
  return <div>{/* Contenido de la página de inicio */}</div>;
}

function About() {
  // Componente para la página "Acerca de"
  return <div>{/* Contenido de la página "Acerca de" */}</div>;
}

function Contact() {
  // Componente para la página de contacto
  return <div>{/* Contenido de la página de contacto */}</div>;
}

export default function HomePageAdmin(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [componentToRender, setComponentToRender] = React.useState(<Orders />);
  const [tittle, setTittle] = React.useState("Manage Orders");
  const auth = useAuth();
  const navigate = useNavigate();

  const { displayName } = auth.user;

  const goToLogin = () => {
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      goToLogin();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const navigatorOptions = (route, tittle) => {
    setComponentToRender(route);
    setTittle(tittle);
    handleDrawerToggle();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              navigatorOptions1={navigatorOptions}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            navigatorOptions1={navigatorOptions}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <AppBar position="sticky" elevation={0} className="appbar">
            <Toolbar>
              <Grid container spacing={1} alignItems="center">
                <Grid sx={{ display: { sm: "none", xs: "block" } }} item>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                <Typography color="inherit" variant="h5" component="h1">
                  {tittle}
                </Typography>
                <Grid item xs />
                {displayName}

                <IconButton
                  onClick={handleLogout}
                  color="inherit"
                  sx={{ p: 0.6 }}
                >
                  <LogoutIcon></LogoutIcon>
                </IconButton>
              </Grid>
            </Toolbar>
          </AppBar>

          <Box
            component="main"
            //quitar el padding de arriba
            padding={"0px"}
            margin={"0px"}
            sx={{
              flex: 1,
              py: 6,
              px: 4,
              bgcolor: "#eaeff1",
              marginTop: "0px",
              marginLeft: "0px",
              marginRight: "0px",
              marginBottom: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
              paddingBottom: "0px",
              paddingTop: "0px",
              backgroundColor: "#FFFF",
            }}
          >
            {componentToRender}
          </Box>

          <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
