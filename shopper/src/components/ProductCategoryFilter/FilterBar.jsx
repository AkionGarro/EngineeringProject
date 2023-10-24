import React, { useEffect, useState } from "react"


import Chip from "@mui/material/Chip"
import Paper from '@mui/material/Paper';

//Los filtros deben venir de la manera:
// listaFiltros = [
//   {key: 0, label: "Todos"},
//   {key: 1, label: "Pendiente de confirmación"},
//   {key: 2, label: "En proceso"},
// ]

const FilterBar = props => {
	//props.handleFilterChange(filter) Para cambiar el filtro en el padre


	return (
		<>
			<p>Filters</p>
			<Paper
				sx={{
					display: "flex",
					justifyContent: "flex-start",
					flexDirection: "row",
					p: 0.5,
					m: 0
				}}>
					
				{props.FilterList.map(data => {
					console.log("El filtro es ", props.filter);
					console.log("El data es ", data);

					if (data.label === props.filter) {
						return <Chip variant="filled" key={data.key} label={data.label} value={data.label} onClick={props.handleFilterChange} sx={{ ml: 2 }}/>
						
					}else{
						return <Chip variant="outlined" key={data.key} label={data.label} value={data.label} onClick={props.handleFilterChange} sx={{ ml: 2 }}/>
					}

					
				})}
			</Paper>
		</>
	)
}

export default FilterBar
