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
        <div>
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
    );
}

export default SearchInputField;

{/* <div className="col-6" style={{backgroundColor:'bisque', width:'50%'}}>
                <TextField
                    
                    type="text"
                    placeholder={placeholder}
                    onKeyPress={handleKeyPress}
                    inputRef={textFieldRef}
                    style={{
                        height: '3rem',
                        width: '15rem',
                        padding: '0px',
                        margin: '0px',
                        marginRight: '1rem',
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" onClick={handleAdornmentClick}>
                                <SearchIcon className="search-icon" />
                            </InputAdornment>
                        ),
                    }}
                />
                <div className='col' style={{backgroundColor:'green', height:'3rem', width:'50%'}}>11/09/2023</div>
                </div> */}