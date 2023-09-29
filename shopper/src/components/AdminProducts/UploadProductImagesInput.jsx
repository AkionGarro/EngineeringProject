import React from "react"
import { styled } from "@mui/material/styles"
import { Button,Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
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

const UploadProductImagesInput = props => {

	return (

		<Grid item container
		direction="column"
		justifyContent="center"
		alignItems="center"
		xs>
			<Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth >
				Add Image
				<VisuallyHiddenInput type="file" accept="image/*" onChange={props.handleAddImage} />
			</Button> 

			<ImageList xs={12} cols={3} rowHeight={150}>
				{props.images.map((item) => (
					<ImageListItem key={item.url}>
						<img
							// srcSet={`${item.url}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
							// src={`${item.url}?w=150&h=150&fit=crop&auto=format`}
							src={item.url}
							width="10px"
							height="10px"
							loading="lazy"
						/>

						<ImageListItemBar
							title=""
							actionIcon={
								<IconButton
									sx={{ color: "rgba(255, 255, 255, 0.54)" }}
									aria-label={`info about ${"imagen"}`}
									onClick={() => props.handleRemoveImage(item)}
								>
									<DeleteIcon />
								</IconButton>
							}
						/>
					</ImageListItem>
				))}
			</ImageList>

			
			
		</Grid>
	)
}

export default UploadProductImagesInput
