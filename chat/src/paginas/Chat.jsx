import { useEffect, useState } from 'react';
import '../assets/css/Chat.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';

function Chat() {
  const usuario = Token();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Conectar con el servidor Socket.IO
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Recibir mensajes
    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Obtener referencias de video una vez que el DOM esté listo
    const videoIntro = document.getElementById('previewVideo');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');

    if (videoIntro && videoModal && closeModal) {
      videoIntro.addEventListener('click', () => {
        videoModal.style.display = 'flex';
        const modalVideo = videoModal.querySelector('video');
        if (modalVideo) modalVideo.play();
      });

      closeModal.addEventListener('click', () => {
        videoModal.style.display = 'none';
        const modalVideo = videoModal.querySelector('video');
        if (modalVideo) modalVideo.pause();
      });

      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
          videoModal.style.display = 'none';
          const modalVideo = videoModal.querySelector('video');
          if (modalVideo) modalVideo.pause();
        }
      });
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      socket.emit('chat message', {
      nombre: usuario?.nombre || "Anónimo",
      mensaje: inputMessage,
      rol: usuario?.rol || "Usuario"
    });

      setInputMessage('');
    }
  };

  return (
    <>
      <div>
        {usuario ? (
          <h1>Hola {usuario.nombre}, bienvenido al chat</h1>
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
              <form id="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="message"
                  id="input"
                  placeholder="Escribe tu mensaje"
                  autoComplete="off"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit">📤 Enviar</button>
              </form>
              <div className="mensajes">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mensaje-burbuja ${
                      msg.rol === usuario?.type ? 'derecha' : 'izquierda'
                    }`}
                  >
                    <div className="mensaje-nombre">
                      <strong>{msg.nombre}</strong>
                    </div>
                    <div className="mensaje-texto">{msg.mensaje}</div>
                  </div>
                ))}
              </div>


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
