import React from 'react'

// Componentes para el Card
import {Card,CardContent,CardMedia, CardActionArea,Typography  } from "@mui/material"

const ProductCard = (props) => {

  const {productInfo, onClickHandler} = props

	const onProductClick = () => {
		onClickHandler(productInfo)
	}



  return (



    <Card key={productInfo.id}  onClick={onProductClick}>
			<CardActionArea>

				<CardMedia
					component="img"
					sx={{ height: 200}}
					image={productInfo.images[0]}
					alt={productInfo.name}

					style={{ objectFit: "contain" }}
				/>

				
				<CardContent
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "flex-start",
						height: 100
					}}
				>
					<Typography gutterBottom variant="h6" component="div">
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