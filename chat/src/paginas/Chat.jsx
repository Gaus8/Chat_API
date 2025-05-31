import { useEffect, useState } from 'react';
import '../assets/css/Chat.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';

function Chat() {
  const usuario = Token();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [empresasConectadas, setEmpresasConectadas] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    setSocket(newSocket);

    // Cuando conectamos, enviamos quién somos (identify)
    newSocket.on('connect', () => {
      if (usuario) {
        newSocket.emit('identify', {
          nombre: usuario.nombre,
          type: usuario.type,  // "Usuario" o "Empresa"
        });

        // Si soy usuario, pido la lista de empresas conectadas
        if (usuario.type === 'Usuario') {
          newSocket.emit('get empresas conectadas');
        }
      }
    });

    // Recibir mensajes
    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Recibir lista de empresas conectadas (solo usuarios la reciben)
    newSocket.on('empresas conectadas', (empresas) => {
      setEmpresasConectadas(empresas);
    });

    // Tu código para videos y modales (sin cambios)
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
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      socket.emit('chat message', {
        nombre: usuario?.nombre || "Anónimo",
        mensaje: inputMessage,
        rol: usuario?.type || "Usuario"
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

      {/* Mostrar empresas conectadas (solo para usuario) */}
      {usuario?.type === 'Usuario' && (
        <div>
          <h2>Empresas conectadas:</h2>
          <ul>
            {empresasConectadas.length === 0 ? (
              <li>No hay empresas conectadas</li>
            ) : (
              empresasConectadas.map((empresa, i) => (
                <li key={i}>{empresa.nombre}</li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="body-chat">
        <div className="contenedor">
          {/* ... el resto de tu código del chat sin cambios */}
          
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
