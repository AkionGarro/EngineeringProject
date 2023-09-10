import PropTypes from 'prop-types'
import React, { memo } from 'react'
import AdminProductsTableComponent from '../AdminProductsTableComponent'

const AdminProductsContainer = memo((props) => {
  return (

    <>
      <AdminProductsTableComponent />
    </>
  )
})

AdminProductsContainer.propTypes = {}

export default AdminProductsContainer