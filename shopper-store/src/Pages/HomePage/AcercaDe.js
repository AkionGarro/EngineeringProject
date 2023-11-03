import React from 'react';
import { Grid, Typography } from '@mui/material';
import Vero from "../../imagenes/Vero.jpg"


function InfoVero() {

    const containerStyle = {
        background: 'linear-gradient(90deg, transparent, white, transparent)',
        marginTop: '40px',
        marginBottom: '40px',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        borderRadius: '30px',
    };

    const leftSideStyle = {
        background: '#457B9D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '30px',
        height: '80vh',
    };

    const rightSideStyle = {
        background: 'white',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // Centra verticalmente
        borderRadius: '30px',
    };

    const titleStyle = {
        color: "#457B9D",
        marginBottom:"10px"
    };

    return (
        <div className="acercaEd" style={containerStyle}>
            <Grid container spacing={0}>
                <Grid item xs={5} >
                    <div style={leftSideStyle}>
                        <img
                            src={Vero} // Reemplaza con la ruta de tu imagen
                            alt="Imagen"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '30px',
                            }}
                        />
                    </div>
                </Grid>
                <Grid item xs={7}>
                    <div style={rightSideStyle}>
                        <Typography variant="h3" style={titleStyle}>
                            Sobre mi
                        </Typography>
                        <Typography variant="body1" style={{ color: 'gray', paddingLeft: '50px',paddingRight: '50px', textAlign:'center'}}>
                            Hola, soy Verónica Camacho, dueña de VeroCam Shop.
                            <br /><br />
                            Soy una mujer fuerte, comprometida y responsable con mi trabajo y con mis clientes. Me gusta que las personas queden satisfechas con mis servicios y vuelvan a contactarme para realizar sus compras.
                            <br /><br />
                            En mi emprendimiento, me esfuerzo por brindar un servicio personalizado. Entiendo que cada persona es única, y mi objetivo es adaptar mis servicios a tus gustos y necesidades individuales. Con mi ayuda obtendrás productos de alta calidad, a un precio cómodo y sin largos tiempos de espera.
                            <br /><br />
                            Me encanta lo que hago, y mi misión es hacer que puedas obtener todos los productos que desees sin que la distancia sea un problema.
                            <br /><br />
                            Así que, si están pensando en realizar compras en Estados Unidos desde la comodidad de tu casa ¡No dudes en contactarme y hablemos sobre cómo puedo ayudarte a lograr a encontrar lo que estás buscando!
                            <br /><br />
                            ¡Bienvenida a la experiencia de compras en línea única con Verónica, tu Personal Shopper desde Estados Unidos hasta Costa Rica!
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default InfoVero;


