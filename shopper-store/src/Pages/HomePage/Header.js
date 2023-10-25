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
import Blog from './HomePage.jsx';


//Lista con las opciones del navbar
const sections = [

  { id: "Pedido", title: 'Realizar pedido', route: <Blog goTo={2}/> },
  { id: "About", title: 'Acerca de', route: <Blog goTo={3} /> },
  { id: "Contact", title: 'Contacto', route: <Blog goTo={1}/> },
  { id: "Categories", title: 'Categorías', route: <CategoriesPage /> },

];



const Header = (props) => {
  
  

  const {navOptions } = props;

  const handleNavoptions = (route, title) => {
    navOptions(route, title);
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }}} />
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        sx={{ flex: 1 }}
        >
          Verocam_shop
        </Typography>
        <Button
         variant="outlined" 
         size="small"
         onClick={() => handleNavoptions(<Blog />, "Inicio")}
         >
          Inicio
        </Button>
        <Button variant="outlined" size="small">
          Iniciar Sesion
        </Button>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (

          // <Link
          //   color="inherit"
          //   noWrap
          //   key={section.title}
          //   variant="body2"
          //   href={section.url}
          //   sx={{ p: 1, flexShrink: 0 }}
          // >
          //   {section.title}
          // </Link>

          <Button
            key={section.id}
            color="inherit"
            onClick={() => handleNavoptions(section.route, section.title)}  
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