import { useEffect, useState } from 'react';
import '../assets/css/ChatEmpresa.css';
import Token from '../assets/funciones/Token';
import { io } from 'socket.io-client';
import axios from 'axios';

function ChatEmpresa() {
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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      // Si el mensaje es para el usuario actual
      if (msg.destinatario === usuario.id) {
        // Si el mensaje no viene del chat actualmente seleccionado
        if (!selectedClient || msg.remitente !== selectedClient.id) {
          // Incrementar el contador de mensajes no leídos
          setUnreadMessages(prev => ({
            ...prev,
            [msg.remitente]: (prev[msg.remitente] || 0) + 1
          }));

          // Mostrar notificación del navegador
          if (Notification.permission === 'granted') {
            const sender = clients.find(c => c.id === msg.remitente);
            new Notification(`Nuevo mensaje de ${sender?.nombre || 'Usuario'}`, {
              body: msg.mensaje.length > 30 ? `${msg.mensaje.substring(0, 30)}...` : msg.mensaje,
            });
          }
        }

        // Si estamos en el chat correcto, agregar el mensaje
        if (selectedClient && msg.remitente === selectedClient.id) {
          setMessages(prev => [...prev, { ...msg, isOwn: false }]);
        }
      }

      // Si el mensaje es enviado por el usuario actual
      if (msg.remitente === usuario.id && selectedClient && msg.destinatario === selectedClient.id) {
        setMessages(prev => [...prev, { ...msg, isOwn: true }]);
      }
    };

    socket.on('new chat', handleNewMessage);
    return () => socket.off('new chat', handleNewMessage);
  }, [socket, selectedClient, usuario, clients]);

  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        console.log('Permiso de notificación:', permission);
      });
    }
  }, []);

  useEffect(() => {
    if (!usuario) return;
    const fetchClients = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/usuarios');
        setClients(res.data?.usuarios || []);
      } catch (err) {
        console.error('Error al cargar clientes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [usuario]);

  useEffect(() => {
    if (!selectedClient || !usuario) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/mensajes/${usuario.id}/${selectedClient.id}`);
        const mensajesBD = res.data.mensajes.map(msg => ({
          ...msg,
          id: msg._id,
          isOwn: msg.remitente === usuario.id,
        }));
        setMessages(mensajesBD);
      } catch (err) {
        console.error('Error al cargar mensajes:', err);
      }
    };
    fetchMessages();
  }, [selectedClient, usuario]);

  const startNewChat = (client) => {
    // Marcar mensajes como leídos al abrir el chat
    setUnreadMessages(prev => {
      const newUnread = { ...prev };
      delete newUnread[client.id];
      return newUnread;
    });

    setSelectedClient(client);
    setMessages([]);
    setNewChatModal(false);
    setEditingMessageId(null);
    setShowDeleteConfirm(null);

    // Cargar mensajes del chat seleccionado
    if (usuario) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/mensajes/${usuario.id}/${client.id}`);
          const mensajesBD = res.data.mensajes.map(msg => ({
            ...msg,
            id: msg._id,
            isOwn: msg.remitente === usuario.id,
          }));
          setMessages(mensajesBD);
        } catch (err) {
          console.error('Error al cargar mensajes:', err);
        }
      };
      fetchMessages();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() && !selectedFile) {
      alert('Debes escribir un mensaje o seleccionar un archivo');
      return;
    }

    if (!socket || !selectedClient) return;
    setIsSending(true);
    try {
      const baseMessage = {
        remitente: usuario.id,
        destinatario: selectedClient.id,
        mensaje: inputMessage,
        timestamp: new Date().toISOString(),
      };

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) {
          alert('El archivo es demasiado grande (máximo 5MB)');
          return;
        }

        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const messageWithFile = {
          ...baseMessage,
          archivo: {
            datos: fileData,
            tipo: selectedFile.type,
            nombre: selectedFile.name,
            tamaño: selectedFile.size,
          }
        };

        socket.emit('new chat', messageWithFile);
        setMessages(prev => [...prev, { ...messageWithFile, isOwn: true }]);
      } else {
        socket.emit('new chat', baseMessage);
        setMessages(prev => [...prev, { ...baseMessage, isOwn: true }]);
      }

      setInputMessage('');
      setSelectedFile(null);
      document.querySelector('.file-input').value = '';
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el archivo');
    } finally {
      setIsSending(false);
    }
  };

  const downloadFile = (fileData, fileName, fileType) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.mensaje);
    setShowDeleteConfirm(null);
  };

  const saveEdit = async (msgId) => {
    try {
      await axios.patch(`http://localhost:3000/api/mensajes/${msgId}`, {
        mensaje: editingMessageContent
      });

      setMessages(prev =>
        prev.map(msg =>
          msg.id === msgId ? { ...msg, mensaje: editingMessageContent } : msg
        )
      );
      setEditingMessageId(null);
      setEditingMessageContent('');
    } catch (err) {
      console.error('Error al editar mensaje:', err);
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageContent('');
    setShowDeleteConfirm(null);
  };

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`http://localhost:3000/api/mensajes/${msgId}`);
      setMessages(prev => prev.filter(msg => msg.id !== msgId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error al eliminar mensaje:', err);
    }
  };

  const toggleDeleteConfirm = (msgId) => {
    setShowDeleteConfirm(showDeleteConfirm === msgId ? null : msgId);
    setEditingMessageId(null);
  };

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
        <div className="contacts-panel">
          <div className="contacts-header">
            <h2>Clientes</h2>
            <button
              onClick={() => setNewChatModal(true)}
              className="new-chat-btn"
            >
              <span>+</span> Nuevo chat
            </button>
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
                      <span className={`status-indicator ${onlineStatus[client.id] ? 'online' : 'offline'}`}></span>
                      {unreadMessages[client.id] > 0 && (
                        <span className="unread-badge">{unreadMessages[client.id]}</span>
                      )}
                    </h3>
                    <p>{client.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-area">
          {selectedClient ? (
            <>
              <div className="chat-header">
                <div className="client-info">
                  <div className="client-avatar">{selectedClient.nombre.charAt(0)}</div>
                  <div>
                    <h2>
                      {selectedClient.nombre}
                      <span className={`status-indicator ${onlineStatus[selectedClient.id] ? 'online' : 'offline'}`}></span>
                    </h2>
                    <p>{selectedClient.email}</p>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <p>Inicia una conversación con {selectedClient.nombre}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={msg.id} className={`message ${msg.isOwn ? 'sent' : 'received'}`}>
                      <div className="message-content">
                        {editingMessageId === msg.id ? (
                          <div className="edit-message-container">
                            <input
                              type="text"
                              value={editingMessageContent}
                              onChange={(e) => setEditingMessageContent(e.target.value)}
                              className="edit-message-input"
                              autoFocus
                            />
                            <div className="edit-actions">
                              <button
                                onClick={() => saveEdit(msg.id)}
                                className="save-edit-btn"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="cancel-edit-btn"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="message-text" onDoubleClick={() => msg.isOwn && handleEdit(msg)}>
                              {msg.mensaje}


                              {msg.archivo && msg.archivo.nombre && msg.archivo.datos && (
                                <div className="archivo-adjunto">
                                  <button
                                    onClick={() => downloadFile(msg.archivo.datos, msg.archivo.nombre, msg.archivo.tipo)}
                                    className="download-btn"
                                  >
                                    📄 {msg.archivo.nombre}
                                    {msg.archivo.tamaño && ` - ${formatFileSize(msg.archivo.tamaño)}`}
                                  </button>
                                </div>
                              )}

                            </div>
                            <div className="message-footer">
                              <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {msg.isOwn && (
                                <div className="message-actions">
                                  <button
                                    onClick={() => handleEdit(msg)}
                                    className="edit-btn"
                                    title="Editar mensaje"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => toggleDeleteConfirm(msg.id)}
                                    className="delete-btn"
                                    title="Eliminar mensaje"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              )}
                            </div>
                            {showDeleteConfirm === msg.id && (
                              <div className="delete-confirmation">
                                <p>¿Eliminar este mensaje?</p>
                                <div className="confirmation-buttons">
                                  <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="confirm-delete-btn"
                                  >
                                    Sí
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="cancel-delete-btn"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
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
                  className="message-input"
                />

                <label className="file-input-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,image/*"
                  />
                  📎 Adjuntar
                </label>

                {selectedFile && (
                  <div className="selected-file-info">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="remove-file-btn"
                    >
                      ×
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={(!inputMessage.trim() && !selectedFile) || isSending}
                  className="send-button"
                >
                  {isSending ? 'Enviando...' : '📤 Enviar'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h2>Selecciona un cliente para chatear</h2>
              <p>O inicia una nueva conversación</p>
              <button
                onClick={() => setNewChatModal(true)}
                className="start-chat-btn"
              >
                Iniciar nuevo chat
              </button>
            </div>
          )}
        </div>
      </div>

      {newChatModal && (
        <div className="modal-overlay">
          <div className="new-chat-modal">
            <div className="modal-header">
              <h2>Nuevo chat</h2>
              <button
                onClick={() => setNewChatModal(false)}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="client-list">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="client-item"
                    onClick={() => startNewChat(client)}
                  >
                    <div className="client-avatar">{client.nombre.charAt(0)}</div>
                    <div className="client-details">
                      <h3>
                        {client.nombre}
                        <span className={`status-indicator ${onlineStatus[client.id] ? 'online' : 'offline'}`}></span>
                        {unreadMessages[client.id] > 0 && (
                          <span className="unread-badge">{unreadMessages[client.id]}</span>
                        )}
                      </h3>
                      <p>{client.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-clients-found">No se encontraron clientes</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatEmpresa;