import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./usuario/Login"
import Registro from "./usuario/Registro"
import Chat from "./paginas/Chat"
import MenuPrincipal from "./paginas/MenuPrincipal"
import Ayuda from "./paginas/Ayuda"
import Perfil from "./paginas/Perfil"
import Validacion from "./usuario/Validacion"
import RecuperarPassword from "./usuario/RecuperarPassword"
import RestablecerPassword from "./usuario/RestablecerPassword"
import ChatEmpresa from "./paginaEmpresa/ChatEmpresa"
import MenuEmpresa from "./paginaEmpresa/MenuEmpresa"

function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Registro />},
    {path:'/login', element:<Login />},
    {path:'/chat', element:<Chat />},
    {path:'/main-page',element:<MenuPrincipal />},
    {path:'/ayuda',element:<Ayuda />},
    {path:'/perfil',element:<Perfil />},
    {path:'/validacion', element:<Validacion />},
    {path:'/recuperar_password', element:<RecuperarPassword />},
    {path:'/restablecer_password/:token', element:<RestablecerPassword />},
    {path:'/chat_empresa', element:<ChatEmpresa />},
    {path:'/menu_empresa', element:<MenuEmpresa />},

  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
