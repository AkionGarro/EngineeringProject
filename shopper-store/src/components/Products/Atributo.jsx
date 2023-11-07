import React from "react"

import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Grid from "@mui/material/Unstable_Grid2" // Grid version 2

import { convertLength } from "@mui/material/styles/cssUtils"
import { SliderValueLabel } from "@mui/material"

import "./Atributo.css"

const Atributo = props => {
	let { name, values, value } = props.info

	const [option, setOption] = React.useState(value)

	const handleChangeOption = (e, optionValue) => {
		e.preventDefault()

		if (optionValue !== null) {
			setOption(optionValue)
		}
	}

	return (
		<>
			<Grid xs={12}>{name}</Grid>

      <div className="toggle-button-scroll-container">

      <ToggleButtonGroup required value={option} exclusive onChange={handleChangeOption} aria-label="text alignment">
				{values.map(attribute => {
					return (
						<ToggleButton value={attribute} aria-label="centered">
							{attribute}
						</ToggleButton>
					)
				})}

{/* 
				<Grid container spacing={1}>
					{values.map((attribute, index) => (
						<Grid xs={12} sm={6} md={6} key={"attr_" + index}>
							<ToggleButton value={attribute}>{attribute}</ToggleButton>
						</Grid>
					))}
				</Grid> */}

			</ToggleButtonGroup>


      </div>

			
		</>
	)
}

export default Atributo
