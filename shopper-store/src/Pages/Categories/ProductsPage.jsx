import React, { Component } from 'react'
import Categories from '../../components/Categories/Categories';
import Products from '../../components/Products/Products';






const ProductsPage = () => {

  
  return (

    <>  
      <h2>Filtros</h2>
      <Categories />

      <h2>Productos</h2>
      <Products />
    </>
  
    )
  
}

export default ProductsPage;
