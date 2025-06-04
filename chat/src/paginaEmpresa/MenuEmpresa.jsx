import '../assets/css/MenuPrincipal.css';
import '../assets/css/Graficos.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Token from '../assets/funciones/Token';
import GraficosUsuarios from './GraficosUsuarios';

function MenuEmpresa() {

    const usuario = Token()
    const [usuarios, setUsuarios] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => setOpenMenu(!openMenu);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/logout', {}, {
                withCredentials: true
            });
            window.location.href = "/login"; // o usa navigate si estás con React Router
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

       useEffect(() => {
        const consultarUsuariosMensajes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/graficos_mensajes_usuario')
                if (response.status === 200) {
                        const usuariosFormateados = response.data;
                setUsuarios(usuariosFormateados);
                    
                }
            }
            catch (err) {
                console.log(err)
            }
        }
         if (usuario?.id) {
        consultarUsuariosMensajes();
    }
      
    },[usuario])

  useEffect(() => {
  console.log("Productos actualizados:", usuarios);
}, [usuarios]); // solo cuando productos cambia


   return (
    <>
        <header className="menu-header">
            <div className="logo-container">
                <img src="img/flecha.png" alt="Logo" className="logo" />
                <h1 className="title">ChatAPI</h1>
            </div>

            <nav className="menu-nav">
                <a href="/chat_empresa">💬 Chat</a>
                <a href="/perfil">👤 Perfil</a>
                <a href="/ayuda">❓ Ayuda</a>
            </nav>

            <div className="actions">
                <button className="notifications">
                    🔔
                    {/* Aquí podrías colocar un contador de notificaciones */}
                </button>

                <div className="user-menu">
                    <button onClick={toggleMenu} className="user-button">
                        👤 {usuario ? (
                            <span>{usuario.nombre} <span className="online-indicator" />📤</span>
                        ) : (
                            <span>Cargando...</span>
                        )}
                    </button>
                    {openMenu && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
        <div className="contenedor-graficos">
            <div>
                <h3>Cantidad de Mensajes de Usuarios</h3>
              <GraficosUsuarios usuarios={usuarios}/>
            </div>
            
         <div>
                <h3>Cantidad de Mensajes de Usuarios</h3>
              <GraficosUsuarios usuarios={usuarios}/>
            </div>
        </div>
       
       
      

        </>
    );
 
}

export default MenuEmpresa;