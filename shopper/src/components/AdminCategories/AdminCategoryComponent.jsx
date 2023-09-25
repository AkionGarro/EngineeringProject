import React, { memo, useEffect, useState } from "react"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AdminCategoryForm from './AdminCategoryForm';


import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const AdminCategoryComponent = (props) => {


  const handleClose = () => props.setOpen(false);

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
          <AdminCategoryForm category={props.category} />
        </DialogContent>

      </Dialog>
    </>
  )


}


export default AdminCategoryComponent
