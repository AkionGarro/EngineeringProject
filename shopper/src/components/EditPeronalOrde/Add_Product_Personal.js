import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "./Add_Product_Personal.css";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Add_Product({ visibleModal, onCancelModal, id }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState("");

  const VisuallyHiddenInput = styled('input')`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const handleFieldChange = (value) => {
    setDescription(value)
    console.log("Fio")
  };

  const handleImageUpload = (event) => {
    const archivo = event.target.files[0];
    setFile(archivo);
    setSelectedFile(archivo.name);
  };

  const cleanData = () => {
    setDescription("");
    setSelectedFile("");
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const archivo = file;
    const refArchivo = ref(storage, `pedidosPersonales/${archivo.name}`)
    await uploadBytes(refArchivo, archivo)
    const fileURL = await getDownloadURL(refArchivo)

    let data = {
      description: description,
      image: fileURL,
      img_name: selectedFile
    }

    try {
      const documentoRef = doc(firestore, 'pedidosPersonales', id);
      await updateDoc(documentoRef, {
        productos: arrayUnion(data),
      });
      cleanData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <Modal
        open={visibleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCancelModal} startIcon={<CancelIcon />}></Button>
          </div>
          <h3 style={{ textAlign: 'center' }}>Agregar un nuevo producto al pedido</h3>
          <Grid container spacing={3} className="grid-container">
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Descripción"
                variant="outlined"
                value={description}
                onChange={(e) =>
                  handleFieldChange(e.target.value)
                }
                id="descripcion"
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                href="#file-upload"
                onChange={(e) => handleImageUpload(e)}
              >
                {selectedFile ? selectedFile : 'Upload a file'}
                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={cleanData}
              ></Button>
            </Grid>
          </Grid>
          <Container className="button_container">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="add-button"
            > Agregar producto
            </Button>
          </Container>
        </Box>
      </Modal>
    </div>
  );
}