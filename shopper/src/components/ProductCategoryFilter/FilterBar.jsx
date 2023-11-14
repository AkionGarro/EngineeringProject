import React, { useEffect, useState } from "react"


import Chip from "@mui/material/Chip"
import Paper from '@mui/material/Paper';

//Los filtros deben venir de la manera:
// listaFiltros = [
//   {key: 0, label: "Todos"},
//   {key: 1, label: "Pendiente de confirmación"},
//   {key: 2, label: "En proceso"},
// ]

import "./FilterBar.css"

const FilterBar = props => {
	//props.handleFilterChange(filter) Para cambiar el filtro en el padre


	return (
		<div id="fiter_bar_component">
			<p>Filtros</p>
			<Paper
				id="filter_bar_paper"
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
						return <Chip id="chip_filled" variant="filled" key={data.key} label={data.label} value={data.label} onClick={props.handleFilterChange} sx={{ ml: 2 }}/>
						
					}else{
						return <Chip id="chip_outlined" variant="outlined" key={data.key} label={data.label} value={data.label} onClick={props.handleFilterChange} sx={{ ml: 2 }}/>
					}

					
				})}
			</Paper>
		</div>
	)
}

export default FilterBar
