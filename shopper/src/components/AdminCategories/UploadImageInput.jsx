import React from "react"
import { styled } from "@mui/material/styles"
import { Button } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
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

	return (
		<Grid xs={6}>
			<div id="uploadCategoryImageContainer">
				<p>{label}</p>
				<img src={imageUrl} width={"100%"} height={"100px"} style={{ objectFit: "contain" }} alt="" />
				<Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth>
					{buttonTitle}
					<VisuallyHiddenInput type="file" accept="image/*" onChange={props.onChange} />
				</Button>
			</div>
		</Grid>
	)
}

export default UploadImageInput
