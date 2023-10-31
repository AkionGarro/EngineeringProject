import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Ahorro from "../../imagenes/ahorro.png"
import Personal from "../../imagenes/personal.png"
import Internacional from "../../imagenes/internacional.png"


const cardsData = [
    {
        title: 'Ahorro',
        description: 'Con VeroCam puedes ahorrrar dinero en tus compras',
        image: Ahorro, 
    },
    {
        title: 'Personalización',
        description: 'VeroCam te ofrece una expereicnia totalmnete personalizada para tus compras',
        image: Personal, 
    },
    {
        title: 'Compras internacionales',
        description: 'Con VeroCam puedes acceder a productos que estén en otro país',
        image: Internacional,
    },
];

function CardGrid() {
    return (
        <div justifyContent="center" alignItems="center" style={{marginTop:"40px"}}>
            <Grid container spacing={25} >
                {cardsData.map((card, index) => (
                    <Grid item key={index} xs={4}>
                        <Card
                            sx={{
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                backgroundColor: 'white',
                                display: 'flex', // Usamos flex para centrar el contenido
                                flexDirection: 'column', // Contenido centrado verticalmente
                                justifyContent: 'space-between', // Espacio igual arriba y abajo
                                alignItems: 'center', // Centramos el contenido horizontalmente
                                width: 300, 
                                height: 300
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{ width: 180, height: 180, display: { xs: 'none', sm: 'block' } }}
                                image={card.image}
                            />
                            <CardContent style={{textAlign :"center"}}>
                                <Typography variant="h6" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </div>
    );
}

export default CardGrid;