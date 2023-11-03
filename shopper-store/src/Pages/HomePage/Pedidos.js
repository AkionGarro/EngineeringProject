import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {useGlobalContext} from "../../GlobalContext/GlobalContext"

function Pedidos(props) {
  const { pedido } = props;

  const { setComponentToRender } = useGlobalContext()

  const handleNavoptions = () => {
		setComponentToRender(pedido.route)
	}

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href={pedido.direccion} onClick={handleNavoptions}>
        <Card sx={{ display: 'flex' , height:200}}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {pedido.title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {pedido.description}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 200,backgroundColor:'#b8d4e5',padding:'20px',display: { xs: 'none', sm: 'block' } }}
            image={pedido.image}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default Pedidos;