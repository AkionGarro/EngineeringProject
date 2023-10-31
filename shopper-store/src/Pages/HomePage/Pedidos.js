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
  const { post } = props;

  const { setComponentToRender } = useGlobalContext()

  const handleNavoptions = () => {

		setComponentToRender(post.route)

	}

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href={post.direccion} onClick={handleNavoptions}>
        <Card sx={{ display: 'flex' , height:200}}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 200, padding:'20px',display: { xs: 'none', sm: 'block' } }}
            image={post.image}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}

Pedidos.propTypes = {
  post: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Pedidos;