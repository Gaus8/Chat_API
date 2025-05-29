import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./usuario/Login";
import Registro from "./usuario/Registro";
import Chat from "./paginas/Chat";
import ChatEmpresa from "./paginas/ChatEmpresa";
import MenuPrincipal from "./paginas/MenuPrincipal";
import Ayuda from "./paginas/Ayuda";
import Perfil from "./paginas/Perfil";
import Validacion from "./usuario/Validacion";
import RecuperarPassword from "./usuario/RecuperarPassword";
import RestablecerPassword from "./usuario/RestablecerPassword";
import { useEffect, useState } from "react";

function App() {
  const [router, setRouter] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario"));

    const appRouter = createBrowserRouter([
      { path: "/", element: <Registro /> },
      { path: "/login", element: <Login /> },
      {
        path: "/chat",
        element:
          user?.rol === "Empresa"
            ? <ChatEmpresa />
            : <Chat />
      },
      { path: "/main-page", element: <MenuPrincipal /> },
      { path: "/ayuda", element: <Ayuda /> },
      { path: "/perfil", element: <Perfil /> },
      { path: "/validacion", element: <Validacion /> },
      { path: "/recuperar_password", element: <RecuperarPassword /> },
      { path: "/restablecer_password/:token", element: <RestablecerPassword /> },
    ]);

    setRouter(appRouter);
  }, []);

  // Mostrar un loading hasta que se cree el router con el rol cargado
  if (!router) return <p>Cargando...</p>;

  return <RouterProvider router={router} />;
}

export default App;
