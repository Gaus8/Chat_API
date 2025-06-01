import { useEffect, useState } from 'react';
import '../assets/css/Chat.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';
import axios from 'axios';
function Chat() {
  const usuario = Token();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [empresaId, setEmpresaId] = useState('');
 const [nombreEmpresa, setNombreEmpresa] = useState('');

  useEffect(() => {
    if (!usuario) return;

    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('identify', {
        usuarioId: usuario.id,
        type: usuario.type,
      });
    });

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/empresas');
        if (response.status === 200) {
          const empresas = response.data?.empresas
          if (empresas.length > 0) {
            setEmpresaId(empresas[0].id);
            setNombreEmpresa(empresas[0].nombre);
             // o la que quieras usar
          }
        }
    
      }
      catch (err) {
        console.log(err)
      }
    };

    fetchClients();


    newSocket.on("new chat", (msg) => {
      // Solo mostrar el mensaje si es del cliente seleccionado o si eres tú
      if (
        (msg.remitente === usuario.id && msg.destinatario === empresaId) ||
        (msg.remitente === empresaId && msg.destinatario === usuario.id)
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...msg,
            isOwn: msg.remitente === usuario.id,
          },
        ]);
      }

    });


    return () => {
      newSocket.close();
    };
  }, [usuario, empresaId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const messageData = {
        remitente: usuario.id,
        destinatario: empresaId,
        mensaje: inputMessage,
        timestamp: new Date().toISOString(),
      };


      setMessages((prevMessages) => [...prevMessages, {
        ...messageData,
        isOwn: true
      }]);
      socket.emit('new chat', messageData);
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
                    className={`mensaje-burbuja ${msg.remitente === usuario.id ? 'derecha' : 'izquierda'
                      }`}
                  >
                    <div className="mensaje-nombre">
                      <strong>
                        {msg.remitente === usuario.id ? 'Tú' : nombreEmpresa}
                      </strong>
                      <span className="mensaje-hora">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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