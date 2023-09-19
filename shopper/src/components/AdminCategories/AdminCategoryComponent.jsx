import PropTypes from 'prop-types'
import React, { memo, useEffect, useState } from "react"

import { firestore } from "../../firebase"
import { collection, getDocs } from "firebase/firestore"

import { TextField, Button, FormControl, FormGroup, FormLabel } from '@mui/material';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AdminCategoryComponent = memo((props) => {

  const h = {
    backgroundImage: "url",
    description: "description",
    name: "name",
    icon: "icon",
    personalizedFields: [{name: "name", type: "text"}, {name: "description", type: "number"}]
  }

  

  const myForm = () => {
    return (
      <form>
        <FormControl>
          <TextField label="Nombre" variant="outlined" />
        </FormControl>
  
        <FormControl>
          <TextField label="Correo Electrónico" variant="outlined" />
        </FormControl>
  
        <Button variant="contained" color="primary" type="submit">
          Enviar
        </Button>
      </form>
    )
  }


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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.category?.name}
          </Typography>
          {myForm()}
        </Box>
      </Modal>
    </>
  )


})

AdminCategoryComponent.propTypes = {}

export default AdminCategoryComponent
