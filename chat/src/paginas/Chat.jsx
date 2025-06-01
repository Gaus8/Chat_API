import { useEffect, useState } from 'react';
import '../assets/css/Chat.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';

function Chat() {
  const usuario = Token();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('Nuestra Empresa');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('identify', {
        nombre: usuario.nombre,
        type: usuario.type,
      });
    });

    newSocket.on('chat message', (msg) => {
      if ((msg.destinatario === usuario.nombre && msg.remitente === nombreEmpresa) || 
          (msg.destinatario === nombreEmpresa && msg.remitente === usuario.nombre)) {
        setMessages(prev => [...prev, msg].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        ));
      }
    });

    newSocket.on('previous messages', (mensajesPrevios) => {
      const mensajesFiltrados = mensajesPrevios.filter(
        m => (m.remitente === usuario.nombre && m.destinatario === nombreEmpresa) ||
             (m.remitente === nombreEmpresa && m.destinatario === usuario.nombre)
      );
      setMessages(mensajesFiltrados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    });

    return () => {
      newSocket.close();
    };
  }, [usuario, nombreEmpresa]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const nuevoMensaje = {
        remitente: usuario.nombre,
        destinatario: nombreEmpresa,
        mensaje: inputMessage,
        timestamp: new Date().toISOString(),
        rol: usuario?.rol || "Usuario"
      };
      
      setMessages(prev => [...prev, nuevoMensaje]);
      socket.emit('chat privado mensaje', nuevoMensaje);
      setInputMessage('');
    }
  };

  return (
    <>
      <div>
        {usuario ? (
          <h1>Hola {usuario.nombre}, bienvenido al chat de {nombreEmpresa}</h1>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div className="body-chat">
        <div className="contenedor">
          <div className="contenedor-chat">
            <section id="chat">
              <form id="form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="message"
                  id="input"
                  placeholder={`Escribe tu mensaje para ${nombreEmpresa}...`}
                  autoComplete="off"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit" disabled={!inputMessage.trim()}>
                  📤 Enviar
                </button>
              </form>
              <div className="mensajes">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mensaje-burbuja ${
                      msg.remitente === usuario.nombre ? 'derecha' : 'izquierda'
                    }`}
                  >
                    <div className="mensaje-nombre">
                      <strong>
                        {msg.remitente === usuario.nombre ? 'Tú' : nombreEmpresa}
                      </strong>
                      <span className="mensaje-hora">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="mensaje-texto">{msg.mensaje}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer>
          <div id="piepagina-chat">© 2025 {nombreEmpresa} | Todos los derechos reservados</div>
        </footer>
      </div>
    </>
  );
}

export default Chat;