import { useEffect, useState } from 'react';
import '../assets/css/ChatEmpresa.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';
import axios from 'axios';

function Chat() {
  const usuario = Token();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newChatModal, setNewChatModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineStatus, setOnlineStatus] = useState({});

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Establecer conexión socket cuando el usuario está disponible
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

    newSocket.on('usuarios conectados', (usuariosConectados) => {
      const statusMap = {};
      usuariosConectados.forEach(user => {
        statusMap[user.id] = user.conectado;
      });
      setOnlineStatus(statusMap);

      setClients(prevClients =>
        prevClients.map(client => ({
          ...client,
          conectado: statusMap[client.id] || false,
        }))
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [usuario]);

  // Escuchar mensajes nuevos solo cuando el socket y un cliente estén activos
  useEffect(() => {
    if (!socket || !selectedClient) return;

    const handleNewMessage = (msg) => {
      if (
        (msg.remitente === usuario.id && msg.destinatario === selectedClient.id) ||
        (msg.remitente === selectedClient.id && msg.destinatario === usuario.id)
      ) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...msg,
            isOwn: msg.remitente === usuario.id,
          },
        ]);
      }
    };

    socket.on('new chat', handleNewMessage);

    return () => {
      socket.off('new chat', handleNewMessage);
    };
  }, [socket, selectedClient, usuario]);

  // Obtener clientes
  useEffect(() => {
    if (!usuario) return;

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios');
        if (response.status === 200) {
          const clientes = response.data?.usuarios || [];
          setClients(clientes);
        }
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [usuario]);

  const startNewChat = (client) => {
    setSelectedClient(client);
    setMessages([]);
    setNewChatModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && selectedClient) {
      const messageData = {
        remitente: usuario.id,
        destinatario: selectedClient.id,
        mensaje: inputMessage,
        timestamp: new Date().toISOString(),
      };

      socket.emit('new chat', messageData);

      setMessages(prevMessages => [
        ...prevMessages,
        {
          ...messageData,
          isOwn: true,
        },
      ]);

      setInputMessage('');
    }
  };

  if (!usuario) {
    return <div className="loading">Cargando usuario...</div>;
  }

  return (
    <div className="chat-empresarial">
      {/* Header */}
      <header className="chat-header">
        <h1>Chat Empresarial - {usuario.nombre}</h1>
        <p>Conecta con tus clientes en tiempo real</p>
      </header>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Panel de Contactos */}
        <div className="contacts-panel">
          <div className="contacts-header">
            <h2>Clientes</h2>
            <button className="new-chat-btn" onClick={() => setNewChatModal(true)}>+ Nuevo chat</button>
          </div>

          <div className="contacts-list">
            {isLoading ? (
              <div className="loading">Cargando clientes...</div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className={`contact-item ${selectedClient?.id === client.id ? 'active' : ''}`}
                  onClick={() => startNewChat(client)}
                >
                  <div className="contact-avatar">{client.nombre.charAt(0)}</div>
                  <div className="contact-info">
                    <h3>
                      {client.nombre}
                      <span className={`status-indicator ${onlineStatus[client.id] ? 'online' : 'offline'}`} title={onlineStatus[client.id] ? 'En línea' : 'Desconectado'}></span>
                    </h3>
                    <p>{client.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área del Chat */}
        <div className="chat-area">
          {selectedClient ? (
            <>
              <div className="chat-header">
                <div className="client-info">
                  <div className="client-avatar">{selectedClient.nombre.charAt(0)}</div>
                  <div>
                    <h2>
                      {selectedClient.nombre}
                      <span className={`status-indicator ${onlineStatus[selectedClient.id] ? 'online' : 'offline'}`} title={onlineStatus[selectedClient.id] ? 'En línea' : 'Desconectado'}></span>
                    </h2>
                    <p>{selectedClient.email}</p>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="empty-chat"><p>Inicia una conversación con {selectedClient.nombre}</p></div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isOwn ? 'sent' : 'received'}`}>
                      <div className="message-content">
                        <p>{msg.mensaje}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="message-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit">Enviar</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h2>Selecciona un cliente para chatear</h2>
              <p>O inicia una nueva conversación</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para nuevo chat */}
      {newChatModal && (
        <div className="modal-overlay">
          <div className="new-chat-modal">
            <div className="modal-header">
              <h2>Nuevo chat</h2>
              <button onClick={() => setNewChatModal(false)}>×</button>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="client-list">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div key={client.id} className="client-item" onClick={() => startNewChat(client)}>
                    <div className="client-avatar">{client.nombre.charAt(0)}</div>
                    <div className="client-details">
                      <h3>
                        {client.nombre}
                        <span className={`status-indicator ${onlineStatus[client.id] ? 'online' : 'offline'}`} title={onlineStatus[client.id] ? 'En línea' : 'Desconectado'}></span>
                      </h3>
                      <p>{client.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No se encontraron clientes</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
