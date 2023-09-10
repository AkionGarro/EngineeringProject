import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./pedido_personal.css";
import {firestore} from "../../firebase";
import { addDoc,collection } from "firebase/firestore";
import { useState } from 'react';

function Pedido_Personal() {

    const [fields, setFields] = useState([{ description: '', image: null }]);

    const handleAddField = () => {
        const newFields = [...fields, { description: '', image: null }];
        setFields(newFields);
    };
  
    const handleFieldChange = (index, fieldName, value) => {
        const updatedFields = [...fields];
        updatedFields[index][fieldName] = value;
        setFields(updatedFields);
      };
    
      const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        handleFieldChange(index, 'image', file);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes manejar los datos de los campos según tus necesidades.
        console.log('Campos:', fields);
      };


  return (
    <div className="container__form__pedido">
    <h2>Pedido Personalizado</h2>
    <h4>Envía la descripción e imágenes de los productos que quieras buscar</h4>
    <form className="two-column-form" onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <div key={index}>
            <div>
              <label htmlFor={`description${index}`}>Descripción:</label>
              <input
                type="text"
                id={`description${index}`}
                name={`description${index}`}
                placeholder="Descripción"
                value={field.description}
                onChange={(e) =>
                  handleFieldChange(index, 'description', e.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor={`image${index}`}>Imagen:</label>
              <input
                type="file"
                id={`image${index}`}
                name={`image${index}`}
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e)}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddField}>Agregar un producto</button>
        <button type="submit">Enviar</button>
    </form>
  </div>
  );
}

export default Pedido_Personal;