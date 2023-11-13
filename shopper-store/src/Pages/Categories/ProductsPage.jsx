import React, { useEffect, useState } from "react"
import Categories from "../../components/Categories/Categories"
import Products from "../../components/Products/Products"
import ProductCard from "../../components/Products/ProductCard"
import ProductDialog from "../../components/Products/ProductDialog"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2
import TextField from "@mui/material/TextField"
import "./ProductsPage.css"

const emptyProduct = {
	id: "",
	name: "",
	price: "",
	images: [],
	personalizedFields: [],
	category: "",
	status: ""
}

const allCategory = {
	id: "all01",
	name: "Todos",
	backgroundImage:
		"https://firebasestorage.googleapis.com/v0/b/veroshopper-cbeb1.appspot.com/o/productCategories%2FbackgroundImages%2FtodosFondo.jpg?alt=media&token=fdf2d8f4-893f-4d77-b971-a37a72e6c974&_gl=1*1e2i2vy*_ga*MTY4ODU1Mzk3NS4xNjk4NDM1ODk0*_ga_CW55HF8NVT*MTY5OTMzMTI3MC44LjEuMTY5OTMzMjU2Ny4yNi4wLjA.",
	icon: "https://firebasestorage.googleapis.com/v0/b/veroshopper-cbeb1.appspot.com/o/productCategories%2Ficons%2FtodosIcon.jpg?alt=media&token=1ce341e9-4fb2-46a2-9146-d23d0eb8b986&_gl=1*1qnco9c*_ga*MTY4ODU1Mzk3NS4xNjk4NDM1ODk0*_ga_CW55HF8NVT*MTY5OTMzMTI3MC44LjEuMTY5OTMzMjQ4MS40My4wLjA."
}

const ProductsPage = () => {
	const [category, setCategory] = useState(allCategory)
	const [product, setProduct] = useState(emptyProduct)
	const [open, setOpen] = useState(false)

	const handleProductChange = product => {
		setProduct(product)
		setOpen(true)
	}

	const handleCategoryChange = category => {
		setCategory(category)
	}

	return (
		<>
			<Grid container spacing={2} className="products-page">

			<Grid xs={12} className="products-category-title-w-background">

						<div className="text-overlay">
							<h2>{category.name}</h2>
						</div>

						<img src={category.backgroundImage} alt="" />
					</Grid>


				<Grid xs={12} sm={3} md={3} lg={3} xl={3} className="categories_products_page">
	
					<Categories handleCategoryChange={handleCategoryChange} />
				</Grid>


				<Grid xs={12} sm={9} md={9} lg={9} xl={9} className="products_products_page">
					
					

					<Products category={category} handleProductClick={handleProductChange} />
				</Grid>
			</Grid>

			<ProductDialog open={open} setOpen={setOpen} product={product} />
		</>
	)
}

export default ProductsPage
