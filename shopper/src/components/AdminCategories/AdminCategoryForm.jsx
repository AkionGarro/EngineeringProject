import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const initialField = {
  key: '',
  value: 'text',
};

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
    backgroundImage: null,
    arrayCategoryFields: [initialField],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedArrayCategoryFields = [...formData.arrayCategoryFields];
    updatedArrayCategoryFields[index] = {
      ...updatedArrayCategoryFields[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      arrayCategoryFields: updatedArrayCategoryFields,
    });
  };

  const handleAddField = () => {
    setFormData({
      ...formData,
      arrayCategoryFields: [...formData.arrayCategoryFields, initialField],
    });
  };

  const handleRemoveField = (index) => {
    const updatedArrayCategoryFields = [...formData.arrayCategoryFields];
    updatedArrayCategoryFields.splice(index, 1);

    setFormData({
      ...formData,
      arrayCategoryFields: updatedArrayCategoryFields,
    });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      icon: file,
    });
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      backgroundImage: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos del formulario a tu backend o realizar cualquier otra acción
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, -1)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange(e, -1)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
          />
        </Grid>
        <Grid item xs={6}>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleAddField} variant="outlined">
            Agregar Campo
          </Button>
        </Grid>
        {formData.arrayCategoryFields.map((field, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              label="Campo"
              name="key"
              value={field.key}
              onChange={(e) => handleInputChange(e, index)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="value"
                value={field.value}
                onChange={(e) => handleInputChange(e, index)}
              >
                <MenuItem value="text">Texto</MenuItem>
                <MenuItem value="number">Número</MenuItem>
                <MenuItem value="size">Tamaño</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => handleRemoveField(index)}
              color="secondary"
              aria-label="Eliminar"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default MyForm;
