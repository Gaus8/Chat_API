//Importacion de dependencias de la libreria Recharts
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function GraficoPuntos({ mensajes }) {
  const maxCantidad = Math.max(...mensajes.map(p => p.cantidadMensajes));
  const maxTick = Math.ceil(maxCantidad / 5) * 5;
  const ticks = [];
  for (let i = 0; i <= maxTick; i += 5) ticks.push(i);

  return (
    <div>
      <LineChart width={500} height={300} data={mensajes}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" interval={0} angle={-30} textAnchor="end" height={90} />
        <YAxis ticks={ticks} domain={[0, maxTick]} />
        <Tooltip />
        {/* Línea invisible (strokeWidth=0) pero puntos visibles (dot) */}
        <Line
          type="monotone"
          dataKey="cantidadMensajes"
          stroke="#3498db"
          strokeWidth={0} 
          dot={{ r: 5, fill: "#3498db" }}
        />
      </LineChart>
    </div>
  );
}

export default GraficoPuntos;
