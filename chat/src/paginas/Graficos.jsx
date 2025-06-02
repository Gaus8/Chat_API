
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';

import React from 'react';

function Grafico({ productos }) {
  // Calculamos el valor máximo de cantidad para definir el dominio
  const maxCantidad = Math.max(...productos.map(p => p.cantidad));

  // Redondeamos hacia arriba al múltiplo de 5 más cercano
  const maxTick = Math.ceil(maxCantidad / 5) * 5;

  // Generamos los ticks de 0 hasta maxTick, de 5 en 5
  const ticks = [];
  for (let i = 0; i <= maxTick; i += 5) {
    ticks.push(i);
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Productos y Cantidades</h2>
      <BarChart width={300} height={300} data={productos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" interval={0} angle={-30} textAnchor="end" height={60} />
        <YAxis ticks={ticks} domain={[0, maxTick]} />
        <Tooltip />
        <Bar dataKey="cantidad" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Grafico;
