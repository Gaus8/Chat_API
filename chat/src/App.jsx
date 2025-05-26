import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./paginas/login"
import Registro from "./paginas/registro"
import Chat from "./paginas/Chat"
function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Registro />},
    {path:'/login', element:<Login />},
    {path:'/chat', element:<Chat />}
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
