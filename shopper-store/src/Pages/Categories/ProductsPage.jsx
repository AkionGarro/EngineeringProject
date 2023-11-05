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

const ProductsPage = () => {
	const [category, setCategory] = useState("all")
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
			{/* <h2>Filtros</h2>
      <Categories handleCategoryChange={handleCategoryChange}/>

      <h2>Productos</h2>
      <Products  category={category} handleProductClick={handleProductChange}/>

      MODAL DEL PRODUCTO
      <ProductDialog open={open} setOpen={setOpen} product={product} /> */}

			<Grid container spacing={2} className="products-page">
				<Grid xs={12} sm={3} md={3} lg={3} xl={3} className="categories_products_page">

					<Grid xs={12}>
						<TextField id="outlined-basic" label="Buscar Producto" variant="outlined" fullWidth/>
					</Grid>

          <Categories handleCategoryChange={handleCategoryChange}/>


				</Grid>

				<Grid xs={12} sm={9} md={9} lg={9} xl={9} className="products_products_page">

        <Grid xs={12}>
          <h2>Productos</h2>

				</Grid>

        <Products  category={category} handleProductClick={handleProductChange}/>

      
        </Grid>
			</Grid>

    <ProductDialog open={open} setOpen={setOpen} product={product} /> 

		</>
	)
}

export default ProductsPage
