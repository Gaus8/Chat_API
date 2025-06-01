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

  useEffect(() => {
    if (!usuario) return;

    // Conectar con el servidor Socket.IO
    const newSocket = io('http://localhost:3000', {
      query: { userId: usuario.id, userType: usuario.rol }
    });


    setSocket(newSocket);

    // Cargar lista de clientes (simulado)
    const fetchClients = async () => {
      let clientes = ''
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios');
        if (response.status === 200) {
          clientes = response.data?.usuarios;
        }
      }
      catch(err){
        console.log(err)
      }
      setClients(clientes);
      setIsLoading(false);
    };

    fetchClients();

    // Escuchar mensajes entrantes
    newSocket.on('chat message', (msg) => {
      if (msg.sender === selectedClient?.id || msg.receiver === selectedClient?.id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    // Escuchar cuando se inicia un nuevo chat
    newSocket.on('new chat', ({ clientId, clientName }) => {
      if (!clients.some(c => c.id === clientId)) {
        setClients(prev => [...prev, { id: clientId, nombre: clientName }]);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [usuario, selectedClient]);

  const startNewChat = (client) => {
    setSelectedClient(client);
    setMessages([]); // Limpiar mensajes anteriores
    // En una aplicación real, cargarías el historial de mensajes aquí
    setNewChatModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && selectedClient) {
      const messageData = {
        sender: usuario.id,
        receiver: selectedClient.id,
        senderName: usuario.nombre,
        message: inputMessage,
        timestamp: new Date().toISOString()
      };

      socket.emit('chat message', messageData);

      // Agregar el mensaje al estado local
      setMessages((prevMessages) => [...prevMessages, {
        ...messageData,
        isOwn: true
      }]);

      setInputMessage('');
    }
  };

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!usuario) {
    return <div className="loading">Cargando usuario...</div>;
  }

  return (
    <div className="chat-empresarial">
      <header className="chat-header">
        <h1>Chat Empresarial - {usuario.nombre}</h1>
        <p>Conecta con tus clientes en tiempo real</p>
      </header>

      <div className="chat-container">
        {/* Panel de contactos */}
        <div className="contacts-panel">
          <div className="contacts-header">
            <h2>Clientes</h2>
            <button
              className="new-chat-btn"
              onClick={() => setNewChatModal(true)}
            >
              + Nuevo chat
            </button>
          </div>

          <div className="contacts-list">
            {isLoading ? (
              <div className="loading">Cargando clientes...</div>
            ) : (
              clients.map(client => (
                <div
                  key={client.id}
                  className={`contact-item ${selectedClient?.id === client.id ? 'active' : ''}`}
                  onClick={() => startNewChat(client)}
                >
                  <div className="contact-avatar">{client.nombre.charAt(0)}</div>
                  <div className="contact-info">
                    <h3>{client.nombre}</h3>
                    <p>{client.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Área de chat */}
        <div className="chat-area">
          {selectedClient ? (
            <>
              <div className="chat-header">
                <div className="client-info">
                  <div className="client-avatar">{selectedClient.nombre.charAt(0)}</div>
                  <h2>{selectedClient.nombre}</h2>
                  <p>{selectedClient.email}</p>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <p>Inicia una conversación con {selectedClient.nombre}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender === usuario.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{msg.message}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                filteredClients.map(client => (
                  <div
                    key={client.id}
                    className="client-item"
                    onClick={() => startNewChat(client)}
                  >
                    <div className="client-avatar">{client.nombre.charAt(0)}</div>
                    <div className="client-details">
                      <h3>{client.nombre}</h3>
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