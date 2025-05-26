import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./paginas/login"
import Registro from "./paginas/registro"
import Chat from "./paginas/Chat"
import MenuPrincipal from "./paginas/MenuPrincipal"
function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Registro />},
    {path:'/login', element:<Login />},
    {path:'/chat', element:<Chat />},
    {path:'main-page',element:<MenuPrincipal />}
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
