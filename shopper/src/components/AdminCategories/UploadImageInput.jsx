import React, { Component } from "react"
import { styled } from "@mui/material/styles"
import { Button, Grid } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	width: 1
})

const UploadImageInput = props => {
	let imageUrl = props.imageUrl
	let buttonTitle = props.buttonTitle
	let label = props.label

	if (imageUrl === null || imageUrl === "") {
		imageUrl = "https://via.placeholder.com/150"
	}

	if (buttonTitle === null || buttonTitle === "") {
		buttonTitle = "Cargar Imagen"
	}

	return (

		<Grid item container
		direction="column"
		justifyContent="center"
		alignItems="center"
		xs>
			{label !== null && (
				<p>{label}</p>
			)}
			<img src={imageUrl} width={"150px"} height={"150px"} style={{objectFit: 'contain' }} alt="" />
			<Button component="label" style={{marginTop:"7px"}} variant="contained" startIcon={<CloudUploadIcon />}>
				{buttonTitle}
				<VisuallyHiddenInput type="file" accept="image/*" onChange={props.onChange} />
			</Button> 
		</Grid>
	)
}

export default UploadImageInput
