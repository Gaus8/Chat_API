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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Crear y conectar socket solo cuando cambia usuario
  useEffect(() => {
    if (!usuario) return;

    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      newSocket.emit('identify', {
        usuarioId: usuario.id,
        type: usuario.type,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [usuario]);

  // Cargar lista de empresas solo cuando cambia usuario
  useEffect(() => {
    if (!usuario) return;

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/empresas');
        if (response.status === 200) {
          const empresas = response.data?.empresas;
          if (empresas.length > 0) {
            setEmpresaId(empresas[0].id);
            setNombreEmpresa(empresas[0].nombre);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchClients();
  }, [usuario]);

  // Cargar mensajes cuando cambia empresaId o usuario
  useEffect(() => {
    if (!empresaId || !usuario) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/mensajes/${empresaId}/${usuario.id}`);
        if (response.status === 200) {
          const mensajesBD = response.data.mensajes.map(msg => ({
            ...msg,
            id: msg._id,
            isOwn: msg.remitente === usuario.id,
          }));
          setMessages(mensajesBD);
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    };

    fetchMessages();
  }, [empresaId, usuario]);

  // Escuchar mensajes nuevos desde socket
  useEffect(() => {
    if (!socket || !usuario) return;

    const handleNewChat = (msg) => {
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
    };

    socket.on('new chat', handleNewChat);

    return () => {
      socket.off('new chat', handleNewChat);
    };
  }, [socket, usuario, empresaId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket) {
      const messageData = {
        remitente: usuario.id,
        destinatario: empresaId,
        mensaje: inputMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...messageData,
          isOwn: true,
        },
      ]);
      socket.emit('new chat', messageData);
      setInputMessage('');
    }
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

  return (
    <>
      <div className="chat-header">
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
                <button 
                  type="submit" 
                  disabled={!inputMessage.trim()}
                  className="send-button"
                >
                  📤 Enviar
                </button>
              </form>
              
              <div className="mensajes">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mensaje-burbuja ${
                      msg.isOwn ? 'derecha' : 'izquierda'
                    }`}
                  >
                    <div className="mensaje-nombre">
                      <strong>{msg.isOwn ? 'Tú' : nombreEmpresa}</strong>
                      <span className="mensaje-hora">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    
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
                        <div 
                          className="mensaje-texto" 
                          onDoubleClick={() => msg.isOwn && handleEdit(msg)}
                        >
                          {msg.mensaje}
                        </div>
                        
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
                            </button>
                          </div>
                        )}
                        
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
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer>
          <div id="piepagina-chat">
            © 2025 FULL HACKS | Todos los derechos reservados
          </div>
        </footer>
      </div>
    </>
  );
}

export default Chat;