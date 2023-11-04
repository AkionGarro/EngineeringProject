import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia , Paper, Box } from '@mui/material';
import Vero from "../../imagenes/Vero.jpg"
import "./AcercaDe.css";


function InfoVero() {

    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="containerStyle">
            {isMobileView ? (
                <Card variant="outlined" style={{ borderRadius: '30px' }}>
                    <CardMedia
                        component="img"
                        alt="Imagen"
                        height="80vh"
                        image={Vero}
                        style={{ objectFit: 'cover', }}
                    />
                    <CardContent style={{ textAlign: 'center' }}>
                        <Typography variant="h5" className='tituloInfoVero'>
                            Sobre mi
                        </Typography>
                        <Typography variant="body2" style={{ color: 'gray', textAlign: 'center' }}>
                            Hola, soy Verónica Camacho, dueña de VeroCam Shop.
                            <br /><br />
                            Soy una mujer fuerte, comprometida y responsable con mi trabajo y con mis clientes. Me gusta que las personas queden satisfechas con mis servicios y vuelvan a contactarme para realizar sus compras.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={0}>
                    <Grid item xs={5} >
                        <div className='leftSideStyle'>
                            <img
                                src={Vero} // Reemplaza con la ruta de tu imagen
                                alt="Imagen"
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'cover',
                                    borderRadius: '30px',
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={7}>
                        <div className='rightSideStyle'>
                            <Typography variant="h3" className='tituloInfoVero'>
                                Sobre mi
                            </Typography>
                            <Paper className='textoScroll' elevation={0}>
                                <Typography variant="body1" style={{ color: 'gray', paddingTop: '3vh', paddingBottom : '3vh',  paddingLeft : '1vh', textAlign: 'center' }}>
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
                            </Paper>
                        </div>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}

export default InfoVero;


