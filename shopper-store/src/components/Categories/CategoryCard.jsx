import React from "react"

// Componentes para el Card
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

const CategoryCard = props => {

	const {categoryInfo, onCategoryClick} = props


	return (
		<Card key={categoryInfo.id} sx={{ maxWidth: 345 }} onClick={() => onCategoryClick(categoryInfo)}>
			<CardActionArea>
				<CardMedia
					component="img"
					height="100"
					image={categoryInfo.icon}
					alt="Category Icon"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{categoryInfo.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{categoryInfo.description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)


}

export default CategoryCard
