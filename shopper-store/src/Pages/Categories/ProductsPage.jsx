import React, { useEffect, useState } from "react"
import Categories from '../../components/Categories/Categories';
import Products from '../../components/Products/Products';
import ProductCard from "../../components/Products/ProductCard";
import ProductDialog from "../../components/Products/ProductDialog";
import "./ProductsPage.css"


const emptyProduct = {
  id: "",
  name: "",
  price: "",
  images: [],
  personalizedFields: [],
  category: "",
  status: "",
}


const ProductsPage = () => {

  const [category, setCategory] = useState("all")
  const [product, setProduct] = useState(emptyProduct)
  const [open, setOpen] = useState(false)


  const handleProductChange = (product) => {
    setProduct(product)
    setOpen(true)
  }

  const handleCategoryChange = (category) => {
    setCategory(category)
  }
  
  return (

    <>  
      <h2>Filtros</h2>
      <Categories handleCategoryChange={handleCategoryChange}/>

      <h2>Productos</h2>
      <Products  category={category} handleProductClick={handleProductChange}/>

      {/* MODAL DEL PRODUCTO */}
      <ProductDialog open={open} setOpen={setOpen} product={product} />
    </>
  
    )
  
}

export default ProductsPage;
