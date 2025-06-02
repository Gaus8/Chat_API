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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

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

  const handleEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.mensaje);
    setShowDeleteConfirm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() && !selectedFile) {
      alert('Debes escribir un mensaje o seleccionar un archivo');
      return;
    }

    if (!socket || !empresaId) return;

    setIsSending(true);
    try {
      const baseMessage = {
        remitente: usuario.id,
        destinatario: empresaId,
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


  ///

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

              <div className="mensajes">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mensaje-burbuja ${msg.isOwn ? 'derecha' : 'izquierda'
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