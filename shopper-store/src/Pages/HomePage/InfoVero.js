import React from 'react';
import { Grid, Typography } from '@mui/material';
import logo from "../../imagenes/logo.png"


function InfoVero() {

    const containerStyle = {
        background: 'linear-gradient(90deg, transparent, white, transparent)',
        marginTop: '40px',
        marginBottom: '40px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        borderRadius: '30px', 
    };

    const leftSideStyle = {
        background: '#457B9D',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px', 
    };

    const rightSideStyle = {
        background: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '50px',
        borderRadius: '30px', 
    };

    const titleStyle = {
        color:"#457B9D",
    };

    return (
        <div className="acercaEd" style={containerStyle}>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div style={leftSideStyle}>
                        <img
                            src={logo} // Reemplaza con la ruta de tu imagen
                            alt="Imagen"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div style={rightSideStyle}>
                        <Typography variant="h4" style={titleStyle}>
                            Título en azul
                        </Typography>
                        <Typography variant="body1" style={{ color: 'gray' }}>
                            Texto en gris. Puedes ajustar este contenido según tus necesidades.
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default InfoVero;