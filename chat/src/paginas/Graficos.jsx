import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const data = [
  { nombre: 'arroz', valor: 5 },
  { nombre: 'pan', valor: 10 },
  { nombre: 'chocolate', valor: 20 }
];

function Grafico() {
  return (
    <BarChart width={300} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="nombre" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="valor" fill="#8884d8" />
    </BarChart>
  );
}

export default Grafico;