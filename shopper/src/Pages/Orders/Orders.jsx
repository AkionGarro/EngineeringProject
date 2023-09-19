import * as React from 'react';
import { useState, useEffect } from 'react';
import SearchInputField from '../../components/SearchInputField.jsx';
import './Orders.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import OrdenesDeCompraTable from '../../components/OrdenesDeCompraTable.jsx'

function Orders() {
    const opcionesFiltro = [
        "Todos",
        "Pendiente de confirmación",
        "En proceso",
        "Pendiente de pago",
        "Pagado",
        "Enviado",
        "Recibido",
    ];
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("Todos");
    return (
        <div className='row container'>
            <div className="row filter-tittle">Filtros</div>
          <div className="row filtro-buttons">
            {opcionesFiltro.map((opcion) => (
            <button
                key={opcion}
                className={`filter-button ${
                    filtroSeleccionado === opcion ? "selected" : ""
                  }`}
                onClick={() => setFiltroSeleccionado(opcion)}
              >{opcion}
            </button>
            ))}
        </div>
            <div className="row row-search">
                <div className='div-search'><SearchInputField placeholder="Buscar por ID de orden"/></div>
                <div className='div-search'>
                  <div className="fecha">
                    <DateRangeIcon className="date-icon"/>07/10/2021 - 07/10/2021
                  </div>
                </div>
            </div>
            <div className="row-table">
                <OrdenesDeCompraTable className='table'/>
            </div>
    
        </div>
      );
}

export default Orders;