import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/RestablecerPassword.css';

const RestablecerPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (password !== confirmarPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    try {
      const response = await axios.patch(`http://localhost:3000/api/restablecer_password/${token}`, {
        password,
      });
      setMensaje(response.data.message);
      setError('');
    } catch (err) {
      setMensaje('');
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="recuperar-container">
      <form className="recuperar-form" onSubmit={manejarEnvio}>
        <h2>Restablecer Contraseña</h2>
        <p>Ingresa tu nueva contraseña y confírmala.</p>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />
        <button type="submit">Guardar nueva contraseña</button>
        {mensaje && <p className="mensaje éxito">{mensaje}</p>}
        {error && <p className="mensaje error">{error}</p>}
      </form>
    </div>
  );
};

export default RestablecerPassword;
