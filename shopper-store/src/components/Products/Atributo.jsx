import React from "react"

import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { convertLength } from "@mui/material/styles/cssUtils"

const Atributo = props => {
	let { name, values, value } = props.info

	const [option, setOption] = React.useState(value)

	const handleChangeOption = (e, optionValue) => {
    e.preventDefault()

    setOption(optionValue)
	}


	return (
		<>

      <Grid xs={12} >
      {name}
      </Grid> 


			<ToggleButtonGroup required value={option} exclusive onChange={handleChangeOption} aria-label="text alignment">
				
        {
        
        values.map((attribute) => {
          return <ToggleButton value={attribute} aria-label="centered">
                                {attribute}

            </ToggleButton>
        })
        
        }

			</ToggleButtonGroup>
		</>
	)
}

export default Atributo
