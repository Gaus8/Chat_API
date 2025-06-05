//Importacion de librerias y funciones
import '../assets/css/MenuPrincipal.css';
import '../assets/css/Graficos.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Token from '../assets/funciones/Token';
import GraficoBarras from '../graficos/GraficoBarras';
import GraficoPuntos from '../graficos/GraficoPuntos';
import GraficoPastel from '../graficos/GraficoPastel';

function MenuEmpresa() {
    const usuario = Token()
    const [usuarios, setUsuarios] = useState([]); //Estados para guardar los usuarios
    const [mensajes, setMensajes] = useState([]); //Estados para guardar la cantidad de mensajes enviadas
    const [productos, setProductos] = useState([]); //Estados para consultar la cantidad de productos pedidas
    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => setOpenMenu(!openMenu);

    //Metodo POST para limpiar las cookies y hacer el LogOut
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

    //Metodo para consultar y almacenar la cantidad de mensajes escritos en el sistema por un usuario
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

    }, [usuario])

    //Metodo para consultar y almacenar la cantidad de mensajes escritos en el sistema por un usuario
    useEffect(() => {
        const consultarMensajesDiarios = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/graficos_mensajes_diarios')
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

    //Metodo para consultar y almacenar la cantidad de productos
    useEffect(() => {
        const consultarProductos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/graficos_productos')
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
    
    //Renderizado de la pagina empresa
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
                    <h3 className='titulos-graficos'>Cantidad de Mensajes de Usuarios</h3>
                    <GraficoBarras usuarios={usuarios} />
                </div>

                <div>
                    <h3 className='titulos-graficos'>Mensajes Diarios</h3>
                    <GraficoPuntos mensajes={mensajes} />
                </div>

                <div>
                    <h3 className='titulos-graficos'>Productos Solicitados</h3>
                    <GraficoPastel productos={productos} />
                </div>


            </div>
        </>
    );

}

export default MenuEmpresa;