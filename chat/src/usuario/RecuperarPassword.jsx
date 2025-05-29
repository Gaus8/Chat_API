import { useState } from 'react';
import '../assets/css/RecuperarPassword.css'
import axios from 'axios';

const RecuperarPassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/recuperar_password', {
        email,
      });
      setMensaje(response.data.message);
      setError('');
    } catch (err) {
      setMensaje('');
      setError(
        err.response?.data?.message || 'Ocurrió un error al enviar el correo.'
      );
    }
  };

  return (
    <div className="recuperar-container">
      <form className="recuperar-form" onSubmit={manejarEnvio}>
        <h2>Recuperar Contraseña</h2>
        <p>Introduce tu correo electrónico para recibir un enlace de recuperación.</p>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar enlace</button>
        {mensaje && <p className="mensaje éxito">{mensaje}</p>}
        {error && <p className="mensaje error">{error}</p>}
      </form>
    </div>
  );
};

export default RecuperarPassword;