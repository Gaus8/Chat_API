import "../assets/css/Login.css"
import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import axios from "axios";


function Login() {
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', data, {
        withCredentials: true
      });

      if (response.status === 200) {
        window.location.href = "/main-page";
      }
    } catch (err) {
      const errorData = err.response?.data;
      console.log(errorData)
    }
  }
  return (
    <>
      <div className="body-login">
        <div className="container-login-main">
          <div className="container-login-form">
            <form className="input-login" onSubmit={handleSubmit}>
              <h2>Inicio de Sesión</h2>
              <p>Ingrese correo y contraseña</p>

              <div className="container-login-input">
                <IoMailOutline size={20} />
                <input
                  type="email"
                  placeholder="Correo"
                  id="email-login"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="container-login-input">
                <IoLockClosedOutline size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  id="password-login"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="message-error">
                <p id="error-login"></p>
              </div>

              <a href="/recover_password">¿Olvidaste tu contraseña?</a>
              <button
                className="btn btn-login-principal"
                id="boton-inicio-sesion"
                type="submit">
                INICIAR SESIÓN
              </button>
            </form>
          </div>

          <div className="container-login-texto">
            <div className="container-registro">
              <h3>Bienvenido a ChatAPI</h3>
              <Link to={'/'}>
                <button
                  className="btn"
                  id="boton-ventana-registro">
                  REGISTRARSE
                </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;