import "../assets/css/Login.css"
import { Link } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
function Login() {
  return (
    <>
      <div className="container">
        <div className="main-container">
          <div className="form-container">
            <form className="input-login">
              <h2>Inicio de Sesión</h2>
              <p>Ingrese correo y contraseña</p>

              <div className="container-input">
                <IoMailOutline size={20} />
                <input
                  type="email"
                  placeholder="Correo Institucional"
                  id="email-login"
                  required
                />
              </div>

              <div className="container-input">
                <IoLockClosedOutline size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  id="password-login"
                  required
                />
              </div>

              <div className="error">
                <p id="error-login"></p>
              </div>

              <a href="/recover_password">¿Olvidaste tu contraseña?</a>
              <button className="btn btn-principal" id="boton-inicio-sesion">
                INICIAR SESIÓN
              </button>
            </form>
          </div>

          <div className="container-texto">
            <div className="container-registro">
              <h3>Bienvenido a ChatAPI</h3>
              <Link to={'/registro'}>
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