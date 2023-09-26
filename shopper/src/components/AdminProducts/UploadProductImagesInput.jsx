import React from "react"
import { styled } from "@mui/material/styles"
import { Grid, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"

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
	let imageUrl = props.imageUrl
	let buttonTitle = props.buttonTitle
	let label = props.label

	if (imageUrl === null || imageUrl === "") {
		imageUrl = "https://via.placeholder.com/150"
	}
	
	console.log(props.productImages);

	return (

		<Grid item container
		direction="column"
		justifyContent="center"
		alignItems="center"
		xs>
{/* 
			<p>{label}</p>

			<img src={imageUrl} width={"150px"} height={"150px"} style={{objectFit: 'contain' }} alt="" />

			<Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
				{buttonTitle}
				<VisuallyHiddenInput type="file" accept="image/*" onChange={props.onChange} />
			</Button>  */}


			<ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
				{props.productImages.map((item) => (
					<ImageListItem key={item}>
						<img
							src={`${item}?w=164&h=164&fit=crop&auto=format`}
							srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
							// alt={item.title}
							loading="lazy"
						/>
						<ImageListItemBar
							title="titulo"
							actionIcon={
								<IconButton
									sx={{ color: "rgba(255, 255, 255, 0.54)" }}
									aria-label={`info about ${"imagen"}`}
								>
									<InfoIcon />
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
