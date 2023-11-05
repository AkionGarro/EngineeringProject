import React from "react"

// Componentes para el Card

import Typography from "@mui/material/Typography"
import { CardActionArea, CardMedia, CardContent, Card } from "@mui/material"

const CategoryCard = props => {

	const {categoryInfo, onCategoryClick} = props


	return (


		<div className="categoryCard" key={categoryInfo.id} onClick={() => onCategoryClick(categoryInfo)}> 

			<img className="category-card-img" src={categoryInfo.icon} alt="" />
			<p>	{categoryInfo.name} </p>
			
				
		</div>
		

	)


}

export default CategoryCard
