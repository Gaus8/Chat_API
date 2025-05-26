import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./paginas/login"
import Registro from "./paginas/registro"
import Chat from "./paginas/Chat"
import MenuPrincipal from "./paginas/MenuPrincipal"
import Ayuda from "./paginas/Ayuda"
import Perfil from "./paginas/Perfil"
import Validacion from "./paginas/Validacion"
function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Registro />},
    {path:'/login', element:<Login />},
    {path:'/chat', element:<Chat />},
    {path:'/main-page',element:<MenuPrincipal />},
    {path:'/ayuda',element:<Ayuda />},
    {path:'/perfil',element:<Perfil />},
    {path:'/validacion', element:<Validacion />}
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
