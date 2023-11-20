import React from "react";
import { useEffect } from "react";
import { firestore } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebase } from "../../context/DatabaseContext";
import "./PersonalOrderStore.css";
import UploadImageInput from "../../components/UploadImageInput";
import { useGlobalContext } from "../../GlobalContext/GlobalContext";
import Blog from "../HomePage/HomePage.jsx";

function Personal_Order() {
  const firebase = useFirebase();
  const { setComponentToRender } = useGlobalContext();
  const [direccionSeleccionada, setDireccionSeleccionada] = useState({});
  const [label, setLabel] = useState();
  const [address, setAddress] = useState([]);
  const [fields, setFields] = useState([
    { description: "", image: null, url_file: null, url_fire: null },
  ]);
  const [imagenes, setImagenes] = useState([]);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const referencia = collection(firestore, "pedidosPersonales");
  const auth = useAuth();
  const email = auth.user.email;
  const [actualName, setActualName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("currentUser");

      const data = await firebase.getUserData(email);
      setDireccionSeleccionada(data.direccionEnvio);
      if (data == undefined) {
        let nameUser = auth.user.displayName;
        setActualName(nameUser);
      } else {
        setActualName(data.fullName);
      }

      const direcciones = await firebase.getUserAdress(email);
      setAddress(direcciones);
    };

    setFlagUpdate(false);

    fetchData();
  }, [flagUpdate, searchQuery]);

  const handleFieldChange = (index, fieldName, value) => {
    const updatedFields = [...fields];
    updatedFields[index][fieldName] = value;
    setFields(updatedFields);
  };

  const handleIconChange = (index, event) => {
    const archivo = event.target.files[0];

    if (archivo) {
      const iconImageUrl = URL.createObjectURL(archivo);
      const updatedFields = [...fields];
      updatedFields[index]["image"] = archivo.name;
      updatedFields[index]["url_file"] = iconImageUrl;
      const updatedImagenes = [...imagenes];
      updatedImagenes[index] = archivo;
      setFields(updatedFields);
      setImagenes(updatedImagenes);
    }
  };

  const addFields = () => {
    setFields([
      ...fields,
      { description: "", image: null, url_file: null, url_fire: null },
    ]);
  };

  const removeFields = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus pedidos se borrarán de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);
        const updatedImagenes = [...imagenes];
        updatedImagenes.splice(index, 1);
        setImagenes(updatedImagenes);
      }
    });
  };

  const deleteAll = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Todos tus pedidos se borrarán de la lista! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero eliminarlos!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setFields([
          { description: "", image: null, url_file: null, url_fire: null },
        ]);
      }
    });
  };

  const handleSelect = (event) => {
    setLabel(event.target.value);
    const jsonObject = JSON.parse(event.target.value);
    setDireccionSeleccionada(jsonObject);
    setLabel(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imagenes.length !== 0) {
      for (let i = 0; i < imagenes.length; i++) {
        const foto = imagenes[i];
        if (foto === undefined) {
          Swal.fire({
            icon: "error",
            title: "Información incompleta",
            text: "Revise que haya cargado una imagen de cada producto.",
          });
          return; // Se encontró un elemento vacío
        } else {
          const refArchivo = ref(storage, `pedidosPersonales/${foto.name}`);
          await uploadBytes(refArchivo, foto);
          const file = await getDownloadURL(refArchivo);
          const updatedFields = [...fields];
          updatedFields[i]["url_fire"] = file;
          setFields(updatedFields);
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Información incompleta",
        text: "Revise que haya cargado una imagen de cada producto.",
      });
      return;
    }

    for (var i = 0; i < fields.length; i++) {
      var objeto = fields[i];
      if (objeto.description === "") {
        Swal.fire({
          icon: "error",
          title: "Información incompleta",
          text: "Revise que haya escrito una descripción para cada producto.",
        });
        return;
      }
    }

    let data = {
      usuario: email,
      direccion: direccionSeleccionada,
      productos: fields,
      estado: 0,
    };

    try {
      await addDoc(referencia, data);
      Swal.fire({
        icon: "success",
        title: "¡Pedido Completado!",
        text: "Tu pedido se ha guardado de forma correcta.",
      });
      cleanData();
    } catch (e) {
      console.error("Error adding document: ", e);
      return;
    }

    //=========================================================

    const productos = fields.map((field) => {
      return `Descripcion: ${field.description} -- *Imagen referencia*: ${field.url_fire} `;
    });
    const message = productos.join("\n");
    const phoneNumber = "+50685045830";

    // Construye la URL de WhatsApp
    const url =
      "https://wa.me/" +
      phoneNumber +
      "?text=" +
      encodeURIComponent(
        `*Pedido Personal*\n\n` +
        `*Nombre:* ${actualName}\n\n` +
        `*Productos:*\n${message}\n\n` +
        `_[Enviado desde la página web de VeroCam Shop]_`
      );

    // Abre una nueva ventana o pestaña con la URL
    window.open(url, "_blank").focus();
    //=========================================================
    setComponentToRender(<Blog />);
  };

  const cleanData = () => {
    setFields([
      { description: "", image: null, url_file: null, url_fire: null },
    ]);
    setDireccionSeleccionada("");
    setLabel(null);
    setFlagUpdate(true);
  };

  return (
    <>
      <Container className="container_personal">
        <h2 className="texto">
          Envía descripción e imágenes de los productos que quieras adquirir
        </h2>
        {fields.map((field, index) => (
          <Grid container spacing={3} key={index} className="grid-container">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                variant="outlined"
                value={field.description}
                className="description"
                onChange={(e) =>
                  handleFieldChange(index, "description", e.target.value)
                }
                id="description"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <UploadImageInput
                imageUrl={fields[index]["url_file"]}
                buttonTitle={fields[index]["image"]}
                label={null}
                onChange={(e) => handleIconChange(index, e)}
              />
            </Grid>
            <Grid item xs={12} className="button-container">
              <DeleteIcon
                className="iconoEliminar"
                onClick={() => removeFields(index)}
              >
                Icono de Eliminación
              </DeleteIcon>
            </Grid>
          </Grid>
        ))}

        <div className="opciones-botones">
          <Button
            variant="contained"
            color="primary"
            onClick={addFields}
            className="add-button"
          >
            + Agregar otro producto
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteAll}
            className="add-button"
          >
            Vaciar pedido
          </Button>
        </div>

        <div className="users_container">
          <div className="opciones-direccion">
            <TextField
              InputLabelProps={{ shrink: true }}
              id="direccionEnvio"
              label="Direccion de envio"
              name="direccionEnvio"
              variant="outlined"
              value={
                direccionSeleccionada.country +
                " , " +
                direccionSeleccionada.province +
                " , " +
                direccionSeleccionada.canton +
                " , " +
                direccionSeleccionada.district +
                " , " +
                direccionSeleccionada.address
              }
              disabled={true}
              fullWidth
              className="direccionEnvio"
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="direccion-label">
                Selecciona una dirección
              </InputLabel>
              <Select
                labelId="direccion-label"
                id="direccion"
                value={label}
                onChange={handleSelect}
                label="Selecciona una dirección"
              >
                {address.map((option, index) => (
                  <MenuItem key={index} value={JSON.stringify(option)}>
                    {`${option.country}, ${option.province}, ${option.canton}, ${option.district}, ${option.address}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <InputLabel htmlFor="direccionEnvio" className="labelDireccion">
              *Selecciona una dirección de envío
            </InputLabel>
          </div>
        </div>

        <div className="botones-opciones">
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            className="send-button"
          >
            Realizar pedido
          </Button>
          <h4 className="advertencia">
            El precio final del pedido incluye gastos adicionales por servicio y
            peso. Para obtener más detalles sobre el monto total de su pedido,
            no dude en contactar a Veronica
          </h4>
        </div>
      </Container>
    </>
  );
}

export default Personal_Order;
