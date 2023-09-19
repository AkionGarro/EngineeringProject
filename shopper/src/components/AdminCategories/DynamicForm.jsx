import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function DynamicForm({ inputArray }) {
  const [formData, setFormData] = useState({});
  const [arrayFields, setArrayFields] = useState({});

  const handleInputChange = (e, name) => {
    const { value } = e.target;
    if (
      inputArray.find((field) => field.name === name)?.type ===
      'arrayCategoryFields'
    ) {
      // Handle array-type fields separately
      setArrayFields((prevArrayFields) => ({
        ...prevArrayFields,
        [name]: prevArrayFields[name]?.map((item, index) => {
          if (index === formData[name]?.length) {
            // This is a new item being added
            return { key: value, value: '' };
          } else {
            // Update the current item based on its index
            return index === e.target.dataset.index
              ? { ...item, key: value }
              : item;
          }
        }),
      }));
    } else {
      // Handle other field types
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddField = (name) => {
    setArrayFields((prevArrayFields) => ({
      ...prevArrayFields,
      [name]: [...(prevArrayFields[name] || []), { key: '', value: '' }],
    }));
  };

  const handleRemoveField = (name, index) => {
    setArrayFields((prevArrayFields) => {
      const updatedArrayFields = { ...prevArrayFields };
      updatedArrayFields[name].splice(index, 1);
      return updatedArrayFields;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission with formData and arrayFields
    console.log('formData:', formData);
    console.log('arrayFields:', arrayFields);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {inputArray.map((field) => (
          <Grid item xs={12} key={field.name}>
            {field.type === 'image' ? (
              <input
                type="file"
                name={field.name}
                onChange={(e) => handleInputChange(e, field.name)}
              />
            ) : field.type === 'text' ? (
              <TextField
                fullWidth
                label={field.name}
                variant="outlined"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(e, field.name)}
              />
            ) : field.type === 'arrayCategoryFields' ? (
              <div>
                <Typography variant="h6">{field.name}</Typography>
                {arrayFields[field.name] &&
                  arrayFields[field.name].map((item, index) => (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Key"
                          value={item.key}
                          onChange={(e) =>
                            handleInputChange(
                              {
                                target: { value: e.target.value },
                                dataset: { index },
                              },
                              field.name
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Value"
                          value={item.value}
                          onChange={(e) =>
                            handleInputChange(
                              {
                                target: { value: e.target.value },
                                dataset: { index },
                              },
                              field.name
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <IconButton
                          color="secondary"
                          onClick={() => handleRemoveField(field.name, index)}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                <IconButton
                  color="primary"
                  onClick={() => handleAddField(field.name)}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </div>
            ) : null}
          </Grid>
        ))}
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default DynamicForm;
