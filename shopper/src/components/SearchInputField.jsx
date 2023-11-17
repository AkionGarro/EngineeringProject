import React, { useState, useEffect, useRef } from "react";
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


import "./SearchInputField.css";

function SearchInputField({ placeholder, searchFunc }) {
    const [searchText, setSearchText] = useState("Nada aún");
    const textFieldRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed: ', event.target.value);
            searchFunc(event.target.value);
        }
    };

    const handleAdornmentClick = () => {
        // Enfocar el TextField
        textFieldRef.current.focus();

        // Disparar manualmente el evento 'Enter'
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
        });
        textFieldRef.current.dispatchEvent(enterEvent);
        // Llamar a handleKeyPress manualmente
        handleKeyPress(enterEvent);
    };

    return (
        <div className="container">
            <div className="search-input-container">
                <div className="div-izq">
                <TextField
                    className="search-input"
                    type="text"
                    placeholder={placeholder}
                    onKeyPress={handleKeyPress}
                    inputRef={textFieldRef}
                   
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" onClick={handleAdornmentClick}>
                                <SearchIcon className="search-icon" />
                            </InputAdornment>
                        ),
                    }}
                />
                </div>
               
                </div>

        </div>
    );
}

export default SearchInputField;