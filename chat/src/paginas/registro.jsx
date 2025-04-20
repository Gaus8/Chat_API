import "../assets/css/Registro.css"
import { Link } from "react-router-dom";
import { IoMailOutline, IoLockClosedOutline,  IoPersonCircleOutline } from "react-icons/io5";
function Registro() {
  return (
    <>
      <div className="container">
        <div className="main-container">
          <div class="form-container">
            <form class="input-registro">
              <h2>Registro</h2>
              <div class="container-input">
                <IoPersonCircleOutline size={20} />
                <input type="text" placeholder="Nombres y Apellidos" id="nombres-registro" required /> 
              </div>
              <div class="error">
                <p id="error-name"></p>
              </div>
              <div class="container-input">
              <IoMailOutline size={20} />
                <input type="email" 
                  placeholder="Correo"
                  id="email-registro"
                  required
                />
              </div>
              <div class="error">
                <p id="error-email"></p>
              </div>

              <div class="container-input">
                <IoLockClosedOutline size={20} />
                <input type="password" placeholder="Contraseña" id="password-registro" required />
              </div>

              <div class="container-input-radio">
                <div>
                  <label for="usuario-check">Usuario</label>
                  <input type="radio" id="usuario-check" value="usuario" name="opcion-registro" required />
                </div>
                <div>
                  <label for="empresa-check" value="empresa">Empresa</label>
                  <input type="radio" id="empresa-check" name="opcion-registro" required />
                </div>

              </div>

              <div class="error">
                <p id="error-password"></p>
              </div>
              <button type="submit" class="btn btn-principal" id="boton-registro-usuarios">REGISTRARSE</button>
            </form>
          </div>
          <div class="container-texto">
            <h3>Bienvenido a ChatAPI</h3>
            <Link className="link-btn" to={'/'}>
              <button 
                type="submit" 
                class="btn btn-login" 
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