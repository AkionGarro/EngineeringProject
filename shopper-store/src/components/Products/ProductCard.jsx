import React from 'react'

// Componentes para el Card
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

const ProductCard = (props) => {

  const {productInfo, onClickHandler} = props

	const onProductClick = () => {
		onClickHandler(productInfo)
	}



  return (

    <Card key={productInfo.id} sx={{ maxWidth: 345 }} onClick={onProductClick}>
			<CardActionArea>
				<CardMedia
					component="img"
					height="100"
					image={productInfo.images[0]}
					alt="Category Icon"
				/>
				<CardContent>
					

					<Typography gutterBottom variant="h5" component="div">
						{productInfo.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						${productInfo.price}
					</Typography>



				</CardContent>
			</CardActionArea>
		</Card>
  )


}

export default ProductCard