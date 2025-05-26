import '../assets/css/MenuPrincipal.css';
import { useState } from 'react';
import axios from 'axios';
import Token from '../assets/funciones/Token';
function MenuPrincipal() {

    const usuario = Token({ruta:'chat'})

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

    return (
        <header className="menu-header">
            <div className="logo-container">
                <img src="img/flecha.png" alt="Logo" className="logo" />
                <h1 className="title">ChatAPI</h1>
            </div>

            <nav className="menu-nav">
                <a href="/chat">Chat</a>
                <a href="/perfil">Perfil</a>
                <a href="/ayuda">Ayuda</a>
            </nav>

            <div className="user-menu">
                <button onClick={toggleMenu} className="user-button">
                    👤   {usuario ? (
                        <h1>{usuario.nombre} 📤</h1>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </button>
                {openMenu && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default MenuPrincipal;