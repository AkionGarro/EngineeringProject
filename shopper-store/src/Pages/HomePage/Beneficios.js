import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import Ahorro from "../../imagenes/ahorro.png";
import Ahorro2 from "../../imagenes/ahorro2.jpg";
import Personal from "../../imagenes/personal.png"
import Personal2 from "../../imagenes/personal2.jpg"
import Personal3 from "../../imagenes/personal3.jpg" 
import Internacional from "../../imagenes/internacional.png"
import Internacional2 from "../../imagenes/international2.jpg"


const cardsData = [
    {
        title: 'Ahorro',
        description: 'Ahorra dinero en tus compras con ofertas exclusivas y descuentos especiales en una amplia gama de productos.',
        cta: '¡Empieza a ahorrar ahora!',
        image: Ahorro2,
    },
    {
        title: 'Personalización',
        description: 'Te ofrecemos una experiencia de compra totalmente personalizada, recomendándote productos que se ajusten a tus gustos y estilo.',
        cta: '¡Descubre la personalización!',
        image: Personal2,
    },
    {
        title: 'Compras internacionales',
        description: 'Accede a productos de todo el país y amplía tus opciones de compra en Estados Unidos de forma sencilla y segura.',
        cta: '¡Explora compras en USA!',
        image: Internacional2,
    },

];

function CardGrid() {

    const handleCTAClick = () => {
        console.log("HandleClick")
    }
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{ marginTop: "40px" }}>
                <Grid container spacing={2}>
                    {cardsData.map((card, index) => (
                        <Grid item key={index} xs={12} sm={12} md={4}>
                            <Card
                                sx={{
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                   
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{height: 250, display: { xs: 'none', sm: 'block' } }}
                                    image={card.image}
                                />
                                <CardContent style={{ textAlign: "center" }}>
                                    <Typography variant="h6" component="div">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ textAlign: "center",marginTop:'1rem' }}>
                                        {card.description}
                                    </Typography>

                                    <Button variant="contained"  color="primary" style={{ margin:'1rem' ,backgroundColor:'#457B9D' }}>
                                    {card.cta}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
}

export default CardGrid;