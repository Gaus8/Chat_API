//Importacion de dependencias de la libreria Recharts
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

//Colores para el grafico de pastel
const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22'];

  //Se retorna los graficos, en este caso se usan dos datakey, los cuales son el nombre del producto y la cantidad de ese producto
function GraficoPastel({ productos }) {
  return (
    <div>
      <PieChart width={400} height={300}>
        <Pie
          data={productos}
          dataKey="cantidad"
          nameKey="nombre"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {productos.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default GraficoPastel;
