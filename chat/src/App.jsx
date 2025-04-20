import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from "./paginas/login"
import Registro from "./paginas/registro"
function App() {
  const router = createBrowserRouter([
    {path:'/', element:<Login />},
    {path:'/registro', element:<Registro />}
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
