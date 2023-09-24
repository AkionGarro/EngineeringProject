import React, { memo, useEffect, useState } from "react"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AdminCategoryForm from './AdminCategoryForm';


import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const AdminCategoryComponent = (props) => {


  const fields = [{name:'name', type:'text'}, {name:'description',type:'text'}, {name:'icon',type:'image'},{name:'backgroundImage',type:'image'} , {name:'personalizedFields',type:'arrayCategoryFields'}]

  const handleClose = () => props.setOpen(false);

  console.log("props", props.category);



  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        scroll="paper"
        maxWidth="md"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent dividers>
          <AdminCategoryForm inputArray={fields} category={props.category} />
        </DialogContent>

      </Dialog>
    </>
  )


}


export default AdminCategoryComponent
