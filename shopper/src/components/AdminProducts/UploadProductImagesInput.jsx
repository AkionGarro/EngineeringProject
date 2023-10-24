import React from "react"
import { styled } from "@mui/material/styles"
import { Button, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material"
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
		<Grid container direction="column" justifyContent="center" alignItems="center">
			<Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth sx={{ mt: 2 }}>
				Add Image
				<VisuallyHiddenInput type="file" multiple accept="image/*" onChange={props.handleAddImage} />
			</Button>

			<ImageList style={{ height: "70vh", minWidth: "100%", overflow: "auto" }} cols={3} rowHeight={250}>

			{/* <ImageList xs={12} cols={4} sx={{ mt: 2 }}> */}
				{props.images.map(item => (
					<ImageListItem key={item.url}>
						<img
							src={item.url}
							alt={item.title}
							loading="lazy"
						/>

						<ImageListItemBar
							title=""
							actionIcon={
								<IconButton
									sx={{ color: "rgba(255, 255, 255, 0.54)" }}
									aria-label={`info about ${"imagen"}`}
									onClick={() => props.handleRemoveImage(item)}>
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
