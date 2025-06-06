
//Importacion de librerias y archivos css o jsx
import '../assets/css/MenuPrincipal.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Token from '../assets/funciones/Token';
import GraficosUsuarios from '../graficos/GraficosUsuarios';
import GraficoPuntos from '../graficos/GraficoPuntos';
import { useEffect } from 'react';

function MenuPrincipal() {


    const [productos, setProductos] = useState([]); //Estado para los productos, consultados en el backend
    const [mensajes, setMensajes] = useState([]);//Estado para los mensaje, consultados en el backend
    const usuario = Token()//Token para la informacion del usuario
    const [openMenu, setOpenMenu] = useState(false);
    const toggleMenu = () => setOpenMenu(!openMenu);

    //Funcion para cerrar sesion , limpia las cookie y elimina el token
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/logout', {}, {
                withCredentials: true
            });
            useNavigate("/login"); // 
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };
    
    //Consultar productos pedidos por un usuario especifico
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

    }, [usuario])

    //Metodo para devolver la cantidad de mensajes escritos en el sistema por un usuario
    useEffect(() => {
        const consultarMensajesDiarios = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/graficos_mensajes_diarios/${usuario.id}`)
                if (response.status === 200) {
                    const mensajesFormateados = response.data;
                    setMensajes(mensajesFormateados);

                }
            }
            catch (err) {
                console.log(err)
            }
        }
        if (usuario?.id) {
            consultarMensajesDiarios();
        }

    }, [usuario])

    // Renderizado de la pagina
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
                    <h3 className='titulos-graficos'>Pedido de Productos</h3>
                    <GraficosUsuarios productos={productos} />
                </div>
                <div>
                    <h3 className='titulos-graficos'>Pedido de Productos</h3>
                    <GraficoPuntos mensajes={mensajes} />
                </div>
            </div>
        </>
    );
}

export default MenuPrincipal;