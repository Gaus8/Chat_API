import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./paginas/Login"
import Registro from "./paginas/Registro"
import Chat from "./paginas/Chat"
import MenuPrincipal from "./paginas/MenuPrincipal"
import Ayuda from "./paginas/Ayuda"
import Perfil from "./paginas/Perfil"
import Validacion from "./paginas/Validacion"
import RecuperarPassword from "./paginas/RecuperarPassword"
import RestablecerPassword from "./paginas/RestablecerPassword"


function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Registro />},
    {path:'/login', element:<Login />},
    {path:'/chat', element:<Chat />},
    {path:'/main-page',element:<MenuPrincipal />},
    {path:'/ayuda',element:<Ayuda />},
    {path:'/perfil',element:<Perfil />},
    {path:'/validacion', element:<Validacion />},
    {path:'/recuperar_password', element:<RecuperarPassword/>},
    {path:'/restablecer_password/:token', element:<RestablecerPassword/>},
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
