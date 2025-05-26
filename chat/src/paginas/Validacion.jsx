import { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/Validacion.css';

function Validacion() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Recuperar email almacenado al cargar el componente
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setMensaje(`¡Ya casi terminamos!\nHemos enviado un correo a ${storedEmail}.\nPor favor, sigue las instrucciones que encontrarás allí.`);
    } else {
      setError('No se encontró un correo electrónico registrado.');
    }
  }, []);

  const handleResend = async () => {
    setMensaje('');
    setError('');

    if (!email) {
      setError('No se encontró un correo electrónico registrado.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/validacion:token', { email });
      if (response.status === 200) {
        setMensaje(`¡Ya casi terminamos!\nHemos reenviado el correo a ${email}.\nRevisa tu bandeja de entrada y sigue las instrucciones.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reenviar el correo.');
    }
  };

  return (
    <div className="body-validacion">
      <form className="form-container-validacion" onSubmit={(e) => e.preventDefault()}>
        <img 
          className="logo-empresa-validacion"
          src="/img/flecha.png"
          alt="logo_aplicacion" 
        />
        <h3>Verificación de Cuenta</h3>

        {mensaje && (
          <p className="mensaje-ok">
            <strong>¡Ya casi terminamos!</strong><br />
            Hemos enviado un correo a <strong>{email}</strong>.<br />
            Por favor, sigue las instrucciones que encontrarás allí.
          </p>
        )}

        {error && <p className="mensaje-error">{error}</p>}

        <button className="button-validacion" onClick={handleResend}>
          Reenviar correo de verificación
        </button>
      </form>
    </div>
  );
}

export default Validacion;