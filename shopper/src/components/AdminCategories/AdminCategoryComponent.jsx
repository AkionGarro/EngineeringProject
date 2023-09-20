import PropTypes from 'prop-types'
import React, { memo, useEffect, useState } from "react"

import { firestore } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"

import { TextField, Button, FormControl, FormGroup, FormLabel } from '@mui/material';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DynamicForm from './AdminCategoryForm';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AdminCategoryComponent = memo((props) => {


  const fields = [{name:'name', type:'text'}, {name:'description',type:'text'}, {name:'icon',type:'image'},{name:'backgroundImage',type:'image'} , {name:'personalizedFields',type:'arrayCategoryFields'}]

  const handleClose = () => props.setOpen(false);

  console.log("props", props.category);



  return (
    <>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

          <DynamicForm inputArray={fields} />
          
        </Box>
      </Modal>
    </>
  )


})

AdminCategoryComponent.propTypes = {}

export default AdminCategoryComponent
