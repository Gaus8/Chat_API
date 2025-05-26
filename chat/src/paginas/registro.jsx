import "../assets/css/Registro.css"
import { useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline, IoPersonCircleOutline } from "react-icons/io5";

function Registro() {


  const [data, setData] = useState({
    nombre: "",
    email: "",
    password: "",
    type: ""
  });
  const [respuestaServer, setRespuestaServer] = useState("");
  const [respuesta2Server, setRespuesta2Server] = useState("");
  const [respuesta3Server, setRespuesta3Server] = useState("");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    setRespuestaServer("");
    setRespuesta2Server("");
    setRespuesta3Server("");
    e.preventDefault();
    if (!data.nombre || !data.email || !data.password || !data.type) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/registro', data);

      if (response.status === 201) {
        localStorage.setItem('userEmail', data.email);
        alert("Usuario Registrado con Exito")
        window.location.href = "/validacion";
      }
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.status === 'error') {
        if (Array.isArray(errorData.error)) {
          errorData.error.forEach(err => {
            if (err.message === "error1") {
              setRespuestaServer("El nombre solo puede tener caracteres alfabéticos")
            }
            else if (err.message === "error2") {
              setRespuesta2Server("El email debe ser válido")
            }
            else if (err.message === "error3") {
              setRespuesta3Server(
                "La contraseña debe tener al menos 8 caracteres e incluir: una letra mayúscula, una letra minúscula, un número y al menos uno de los siguientes caracteres especiales:.!@#$%^&*"
              );
            }
            else if (err.message === "error4") {
              setRespuesta3Server("El email ya está registrado")
            }
          });
        } else {
          setRespuesta3Server(errorData.message || 'Error desconocido');
        }
      } else {
        console.error('Error al enviar formulario:', err.message);
      }
    }
  };
  return (
    <>
      <div className="body-registro">
        <div className="container-registro-main">
          <div className="container-registro-form">
            <form onSubmit={handleSubmit}>
              <h2>Registro</h2>
              <div className="container-registro-input">
                <IoPersonCircleOutline size={20} />
                <input
                  type="text"
                  placeholder="Nombres y Apellidos"
                  id="nombres-registro"
                  name="nombre"
                  value={data.nombre}
                  onChange={handleChange}
                  required />
              </div>
              <div className="message-error">
                <p id="error-name">{respuestaServer}</p>
              </div>
              <div className="container-registro-input">
                <IoMailOutline size={20} />
                <input
                  type="email"
                  placeholder="Correo"
                  id="email-registro"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="message-error">
                <p id="error-email">{respuesta2Server}</p>
              </div>
              <div className="container-registro-input">
                <IoLockClosedOutline size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  name="password"
                  id="password-registro"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="container-input-radio">
                <div>
                  <label htmlFor="usuario-check">Usuario</label>
                  <input
                    type="radio"
                    id="usuario-check"
                    name="type"
                    value="Usuario"
                    onChange={handleChange}
                    checked={data.type === "Usuario"}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="empresa-check" value="empresa">Empresa</label>
                  <input
                    type="radio"
                    id="empresa-check"
                    name="type"
                    value="Empresa"
                    onChange={handleChange}
                    checked={data.type === "Empresa"}
                    required
                  />
                </div>

              </div>

              <div className="message-error">
                <p id="error-password">{respuesta3Server}</p>
              </div>
              <button
                type="submit"
                className="btn btn-registro-principal"
                id="boton-registro-usuarios">REGISTRARSE</button>
            </form>
          </div>
          <div className="container-registro-texto">
            <h3>Bienvenido a ChatAPI</h3>
            <Link className="link-btn" to={'/login'}>
              <button
                type="submit"
                className="btn"
                id="boton-ventana-inicio">
                INICIAR SESIÓN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registro;