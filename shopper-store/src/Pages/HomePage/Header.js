import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AdbIcon from '@mui/icons-material/Adb';
import CategoriesPage from './../Categories/CategoriesPage.jsx';
import Blog from './HomePage.js';
import logo from '../../imagenes/logo.png';

//Lista con las opciones del navbar
const sections = [

  { id: "Pedido", title: 'Realizar pedido', route: <Blog goTo={1} /> },
  { id: "About", title: 'Acerca de', route: <Blog goTo={2} /> },
  { id: "Contact", title: 'Contacto', route: <Blog goTo={3} /> },
  //{ id: "Categories", title: 'Categorías', route: <CategoriesPage /> },
];

const Header = (props) => {
  const { navOptions } = props;

  const handleNavoptions = (route, title) => {
    navOptions(route, title);
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '50px', // Tamaño del círculo
            height: '40px', // Tamaño del círculo
            borderRadius: '50%', // Forma circular
            backgroundColor: 'lightgray', // Color del círculo
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px', // Espacio entre el círculo y el texto
          }}
        >
          <img
            src={logo} // Reemplaza con la URL o la ruta de tu imagen
            style={{
              width: '100%', // Tamaño de la imagen dentro del círculo
              height: 'auto', // Altura automática para mantener la proporción
              borderRadius: '50%', // Hace que la imagen sea circular
            }}
          />
        </div>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            sx={{ flex: 1 , color: "#457B9D"}}
          >
            Verocam_shop
          </Typography>
        </div>
        <div>
          <Button
            size="small"
            onClick={() => handleNavoptions(<Blog />, "Inicio")}
            sx={{color: "#457B9D",
            '&:hover': {
              backgroundColor: 'white',
            },}}
          >
            Inicio
          </Button>
          <Button variant="outlined" size="small" 
          sx={{
            border: '1px solid #457B9D',
            color: "#457B9D",
            marginLeft: '5px',
            '&:hover': {
              backgroundColor: '#6C98B4',
              color: 'white',
              border: '1px solid #6C98B4',
            }, }}>

            Iniciar Sesión
          </Button>
        </div>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'center', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Button
            key={section.id}
            color="inherit"
            onClick={() => handleNavoptions(section.route, section.title)}
            sx={{marginRight: "50px", color:"#6C98B4",
            '&:hover': {
              color: '#457B9D',
            },}}
          >
            {section.title}
          </Button>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;