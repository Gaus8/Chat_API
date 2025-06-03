import '../assets/css/MenuPrincipal.css';
import { useState } from 'react';
import axios from 'axios';
import Token from '../assets/funciones/Token';
import Grafico from './Graficos';
import { useEffect } from 'react';

function MenuPrincipal() {

    const [productos, setProductos] = useState([]);

    const usuario = Token()

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
        const consultarProductos = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/estadisticas/${usuario.id}/683dac1084b6bf73c7d780b0`)
                if (response.status === 200) {
                        const productosFormateados = response.data;
                setProductos(productosFormateados);
                    
                }
            }
            catch (err) {
                console.log(err)
            }
        }
         if (usuario?.id) {
        consultarProductos();
    }
      
    },[usuario])

  useEffect(() => {
  console.log("Productos actualizados:", productos);
}, [productos]); // solo cuando productos cambia

return (
    <>
        <header className="menu-header">
            <div className="logo-container">
                <img src="img/flecha.png" alt="Logo" className="logo" />
                <h1 className="title">ChatAPI</h1>
            </div>

            <nav className="menu-nav">
                <a href="/chat">💬 Chat</a>
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
        <Grafico 
            productos={productos}
        />
    </>
);
 
}

export default MenuPrincipal;