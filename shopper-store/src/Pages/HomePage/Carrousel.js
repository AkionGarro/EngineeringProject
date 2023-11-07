import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@material-ui/core';
import imagen1 from '../../imagenes/carousel1.jpeg';
import imagen2 from '../../imagenes/carousel2.jpeg';
import imagen3 from '../../imagenes/carousel3.jpeg';
import imagen4 from '../../imagenes/carousel4.jpeg';
import imagen5 from '../../imagenes/carousel5.jpeg';
import imagen6 from '../../imagenes/carousel6.jpeg';
import './Carousel.css'

const AutoPlayCarousel = autoPlay(Carousel);


const images = [
  {
    imgPath: imagen1
  },
  {
    imgPath: imagen2
  },
  {
    imgPath: imagen3
  },
  {
    imgPath: imagen4
  },
  {
    imgPath: imagen5
  },
  {
    imgPath: imagen6
  }
];

function SwipeableTextMobileStepper() {
  return (
    <Carousel interval={7000} className='carousel'>
      {images.map((item, index) => (
        <img className='image_carousel' src={item.imgPath} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }} />
      ))}
    </Carousel>
  );
}

export default SwipeableTextMobileStepper;