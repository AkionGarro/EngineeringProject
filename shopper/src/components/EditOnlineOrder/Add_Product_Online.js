import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { firestore } from "../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Container, Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./Add_Product_Online.css";
import Swal from "sweetalert2";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Add_Product({ visibleModal, onCancelModal, id }) {
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const VisuallyHiddenInput = styled("input")`
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

  const cleanData = () => {
    setDescription("");
    setLink("");
  };

  const closeModal = () => {
    cleanData();
    onCancelModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let data = {
      comentario: description,
      link: link,
    };

    try {
      const documentoRef = doc(firestore, "pedidosOnline", id);
      await updateDoc(documentoRef, {
        productos: arrayUnion(data),
      });
      Swal.fire({
        icon: "success",
        title: "¡Producto agregado!",
        text: "El producto se ha agregado al pedido.",
        customClass: {
          container: "swal-custom", // Aplica la clase personalizada
        },
      });
      cleanData();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "¡Error al guardar el producto!",
      });
    }
  };

  return (
    <Container>
      <Modal
        open={visibleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Container style={{ textAlign: "right" }}>
            <Button onClick={closeModal} startIcon={<CancelIcon />}></Button>
          </Container>
          <h3 style={{ textAlign: "center" }}>
            Agregar un nuevo producto al pedido
          </h3>
          <Grid container spacing={3} className="grid-container2">
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Descripción"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="descripcion"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Link"
                variant="outlined"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                id="link"
              />
            </Grid>
            <Grid item xs={2}>
              <DeleteIcon className="iconoEliminar" onClick={cleanData}>
                Icono de Eliminación
              </DeleteIcon>
            </Grid>
          </Grid>
          <Container className="button_container">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="add-button"
            >
              {" "}
              Agregar producto
            </Button>
          </Container>
        </Box>
      </Modal>
    </Container>
  );
}
