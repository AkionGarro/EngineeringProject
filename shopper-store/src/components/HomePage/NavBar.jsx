import React from 'react'
import Button from "@mui/material/Button"
import Toolbar from "@mui/material/Toolbar"
import { useGlobalContext } from "../../GlobalContext/GlobalContext.js"
import PropTypes from "prop-types"
import Blog from "../../Pages/HomePage/HomePage.jsx"
import ProductsPage from "../../Pages/Categories/ProductsPage.jsx"

const sections = [
    { id: "Pedido", title: "Realizar pedido", route: <Blog goTo={1} /> },
    { id: "About", title: "Acerca de", route: <Blog goTo={2} /> },
    { id: "Contact", title: "Contacto", route: <Blog goTo={3} /> },
    { id: "Categories", title: "Tienda", route: <ProductsPage /> }
]

const Navbar = () => {

    const { setComponentToRender } = useGlobalContext()

    const handleNavoptions = (route) => {
        setComponentToRender(route)
    }

    return (
        <div>
            <Toolbar component="nav" variant="dense" sx={{ justifyContent: "center", overflowX: "auto"}}>
                {sections.map(section => (
                    <Button
                        key={section.id}
                        color="inherit"
                        onClick={() => handleNavoptions(section.route)}
                        sx={{
                            marginRight: "10px",
                            color: "#6C98B4",
                            "&:hover": {
                                color: "#457B9D"
                            }
                        }}
                    >
                        {section.title}
                    </Button>
                ))}
            </Toolbar>
        </div>
    )
}

Navbar.propTypes = {
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    title: PropTypes.string.isRequired
}

export default Navbar;

