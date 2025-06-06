//Importacion de dependencias de la libreria Recharts
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';

//Se pasa como props los productos, los cuales se buscan desde el backend
function GraficosUsuarios ({ productos }) {
  // Calculamos el valor máximo de cantidad para definir el dominio
  const maxCantidad = Math.max(...productos.map(p => p.cantidad));

  const maxTick = Math.ceil(maxCantidad / 5) * 5;

  // Ticks de 0 hasta maxTick, de 5 en 5, este es el intervalo que se muestra en el eje Y
  const ticks = [];
  for (let i = 0; i <= maxTick; i += 5) {
    ticks.push(i);
  }

  //Renderizado de las grafica, para la cantidad de mensajes enviados por un usuario
  return (
    <div>
      <BarChart width={300} height={300} data={productos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" interval={0} angle={-30} textAnchor="end" height={60} />
        <YAxis ticks={ticks} domain={[0, maxTick]} />
        <Tooltip />
        <Bar dataKey="cantidad" fill="#3498db" />
      </BarChart>
    </div>
  );
}

export default GraficosUsuarios;
