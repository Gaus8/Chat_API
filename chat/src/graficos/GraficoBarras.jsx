//Importacion de dependencias de la libreria Recharts
import {BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';

//Grafico de barras, se pasa usuarios como props, este props viene desde el backend y trae la informacion sobre los usuarios.
function GraficoBarras({ usuarios}) {
  // Calculamos el valor máximo de cantidad para definir el dominio
  const maxCantidad = Math.max(...usuarios.map(p => p.cantidad));

  // Redondeamos hacia arriba al múltiplo de 5 más cercano
  const maxTick = Math.ceil(maxCantidad / 5) * 5;

  // Generamos los ticks de 0 hasta maxTick, de 5 en 5
  const ticks = [];
  for (let i = 0; i <= maxTick; i += 5) {
    ticks.push(i);
  }

  //Se renderiza el grafico, en este caso se usan dos datakey, los cuales son el nombre del usuario y la cantidad de mensajes
  return (
    <div>
     
      <BarChart width={300} height={300} data={usuarios}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="nombre" interval={0} angle={-30} textAnchor="end" height={90} />
        <YAxis ticks={ticks} domain={[0, maxTick]} />
        <Tooltip />
        <Bar dataKey="cantidadMensajes" fill="#3498db" />
      </BarChart>
    </div>
  );
}

export default GraficoBarras;
