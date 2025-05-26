import '../assets/css/Chat.css';
import Token from '../assets/funciones/Token';

function Chat() {
  const usuario = Token()
  return (
    <>
      <div>
        {usuario ? (
          <h1>Hola {usuario.email}, bienvenido al chat</h1>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div className="body-chat">
        <div className="contenedor">
          <div className="container-texto">
            <img src="img/flecha.png" alt="Imagen libre" id="imagen" />
            <div id="texto-video">
              🎥 Haz clic en el video para <br />
              ver cómo funciona ChatAPI
            </div>
            <div id="cuadro"></div>
            <div id="titulo-chat">💬 Bienvenido a <strong>ChatAPI</strong></div>
            <div id="subtitulo-chat">
              Conéctate entre Empresa y Cliente en tiempo real <br />
              Comparte tus ideas al instante.
            </div>
            <div id="ventajas-chat">
              <h3>🚀 ¿Por qué usar ChatAPI?</h3>
              <ul>
                <li>🔒 Seguridad en tiempo real</li>
                <li>🤝 Conexión directa Empresa - Cliente</li>
                <li>⚡ Interfaz rápida y dinámica</li>
                <li>📱 Acceso desde cualquier navegador</li>
              </ul>
            </div>
            <div className="video-intro">
              <video id="previewVideo" muted>
                <source src="videos/introchatapi.mp4" type="video/mp4" />
              </video>
            </div>
            <div id="videoModal">
              <button id="closeModal">✖</button>
              <video controls autoPlay>
                <source src="/videos/introchatapi.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="contenedor-chat">
            <section id="chat">
              <form id="form">
                <input
                  type="text"
                  name="message"
                  id="input"
                  placeholder="Escribe tu mensaje"
                  autoComplete="off"
                />
                <button type="submit">📤 Enviar</button>
              </form>
            </section>
          </div>
        </div>
        <footer>
          <div id="piepagina-chat">© 2025 ChatAPI | Creado por FullHacks</div>
        </footer>
      </div>
    </>
  );
}

export default Chat;
