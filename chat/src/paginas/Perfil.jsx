import { useState, useEffect } from 'react';
import axios from 'axios';
import Token from '../assets/funciones/Token';
import '../assets/css/Perfil.css';

function Perfil() {
  const usuario = Token();

  // Estados para campos editables
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Inicializacion de los datos en caso de haberlos, los cuales son sacados del token
  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setEmail(usuario.email || '');
    }
  }, [usuario]);

  //Funcion para la actualizacion de los datos del usuario
  const guardarCambios = async () => {
    setMensaje(null);
    setError(null);
    try {
      const res = await axios.patch('http://localhost:3000/api/perfil', {
        nombre,
        email,
      }, { withCredentials: true });

      if (res.status === 200) {
        setMensaje('Perfil actualizado correctamente.');
        setEditando(false);
      } else {
        setError('Error al actualizar el perfil.');
      }
    } catch (err) {
      setError('Error al actualizar el perfil.');
      console.error(err);
    }
  };

//Renderizado de la pagina
  return (
    <div className="perfil-container">
      <h1>Perfil de Usuario</h1>

      <div className="perfil-form">
        <label>Nombre:</label>
        {editando ? (
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        ) : (
          <p>{nombre}</p>
        )}

        <label>Correo electrónico:</label>
        {editando ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <p>{email}</p>
        )}

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {editando ? (
          <div className="botones-edicion">
            <button onClick={guardarCambios}>Guardar</button>
            <button onClick={() => { setEditando(false); setMensaje(null); setError(null); }}>Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setEditando(true)}>Editar Perfil</button>
        )}
      </div>
    </div>
  );
}

export default Perfil;