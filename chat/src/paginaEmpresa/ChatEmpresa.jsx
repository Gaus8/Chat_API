import { useEffect, useState, useCallback } from 'react';
import '../assets/css/ChatEmpresa.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';
import axios from 'axios';

function ChatEmpresa() {
  const empresa = Token();
  const [socket, setSocket] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      setUsuarios(response.data.usuarios || []);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  }, []);

  const handleSeleccionCliente = useCallback((cliente) => {
    setClienteSeleccionado(cliente);
    if (socket) {
      socket.emit('get mensajes privados', {
        usuario1: empresa.nombre,
        usuario2: cliente.nombre,
      });
    }
  }, [socket, empresa]);

  const handleEnviarMensaje = useCallback((e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !clienteSeleccionado) return;

    const mensajeObj = {
      remitente: empresa.nombre,
      destinatario: clienteSeleccionado.nombre,
      mensaje: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMensajes(prev => [...prev, mensajeObj]);
    socket.emit('chat privado mensaje', mensajeObj);
    setInputMessage('');
  }, [inputMessage, socket, clienteSeleccionado, empresa]);

  useEffect(() => {
    if (!empresa) return;

    const newSocket = io('http://localhost:3000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado al servidor de sockets');
      newSocket.emit('identify', {
        nombre: empresa.nombre,
        type: empresa.type,
      });
      fetchClients();
    });

    newSocket.on('previous messages', (mensajesPrevios) => {
      setMensajes(mensajesPrevios.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    });

    newSocket.on('chat message', (msg) => {
      if ((msg.remitente === clienteSeleccionado?.nombre && msg.destinatario === empresa.nombre) ||
          (msg.remitente === empresa.nombre && msg.destinatario === clienteSeleccionado?.nombre)) {
        setMensajes(prev =>
          [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        );
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [empresa, fetchClients, clienteSeleccionado]);

  return (
    <div className="chat-empresa">
      <aside className="lista-clientes">
        <h2>Clientes</h2>
        <ul>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSeleccionCliente(user)}
                className={clienteSeleccionado?.nombre === user.nombre ? 'activo' : ''}
              >
                {user.nombre}
              </li>
            ))
          ) : (
            <li className="sin-clientes">No hay clientes disponibles</li>
          )}
        </ul>
      </aside>

      <section className="chat-privado">
        {clienteSeleccionado ? (
          <>
            <div className="chat-header">
              <h3>Chat con {clienteSeleccionado.nombre}</h3>
            </div>

            <div className="mensajes-container">
              {mensajes.length > 0 ? (
                mensajes.map((msg, i) => (
                  <div
                    key={`${msg.timestamp}-${i}`}
                    className={`mensaje-contenedor ${
                      msg.remitente === empresa.nombre ? 'derecha' : 'izquierda'
                    }`}
                  >
                    <div className="mensaje-burbuja">
                      <div className="mensaje-nombre">
                        <strong>{msg.remitente === empresa.nombre ? 'Tú' : msg.remitente}</strong>
                        <span className="mensaje-hora">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="mensaje-texto">{msg.mensaje}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sin-mensajes">No hay mensajes previos con este cliente</div>
              )}
            </div>

            <form onSubmit={handleEnviarMensaje} className="form-chat">
              <input
                type="text"
                placeholder={`Escribe un mensaje para ${clienteSeleccionado.nombre}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                autoComplete="off"
                aria-label="Mensaje"
              />
              <button type="submit" disabled={!inputMessage.trim()}>
                📤 Enviar
              </button>
            </form>
          </>
        ) : (
          <div className="seleccionar-cliente">
            <div className="instrucciones-container">
              <p>Selecciona un cliente para iniciar el chat</p>
              <div className="instrucciones-detalle">
                <p>Puedes comunicarte directamente con tus clientes a través de este chat.</p>
                <p>Todos los mensajes son privados entre tú y el cliente seleccionado.</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatEmpresa;