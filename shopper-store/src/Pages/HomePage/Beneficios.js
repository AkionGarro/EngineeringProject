import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Ahorro from "../../imagenes/ahorro.png"
import Personal from "../../imagenes/personal.png"
import Internacional from "../../imagenes/internacional.png"

const cardsData = [
    {
        title: 'Ahorro',
        description: 'Con VeroCam puedes ahorrar dinero al compraar esos productos que tanto deseas',
        image: Ahorro,
    },
    {
        title: 'Personalización',
        description: 'VeroCam te ofrece una experiencia totalmente personalizada para tus compras',
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
                                    sx={{ width: 180, height: 180, display: { xs: 'none', sm: 'block' } }}
                                    image={card.image}
                                />
                                <CardContent style={{ textAlign: "center" }}>
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
        </div>
    );
}

export default CardGrid;