import { FaComments, FaUserCircle, FaSignOutAlt, FaFileUpload, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';
import '../assets/css/Ayuda.css';

function Ayuda() {
    return (
        <div className="ayuda-container">
            <header className="ayuda-hero">
                <FaQuestionCircle className="ayuda-icono" />
                <h1>Centro de Ayuda</h1>
                <p>¿Tienes dudas? Encuentra respuestas a tus preguntas frecuentes.</p>
            </header>

            <section className="faq-section">
                <h2>Preguntas Frecuentes</h2>

                <div className="faq-item">
                    <h3><FaComments className="faq-icon" /> ¿Cómo uso el chat?</h3>
                    <p>Haz clic en la pestaña <strong>Chat</strong> en el menú principal, escribe tu mensaje y presiona Enter para enviarlo.</p>
                </div>

                <div className="faq-item">
                    <h3><FaUserCircle className="faq-icon" /> ¿Cómo actualizo mi perfil?</h3>
                    <p>Ve a la sección <strong>Perfil</strong> desde el menú y edita tu nombre, correo, o imagen.</p>
                </div>

                <div className="faq-item">
                    <h3><FaSignOutAlt className="faq-icon" /> ¿Cómo cierro sesión?</h3>
                    <p>Haz clic en tu nombre de usuario arriba a la derecha y selecciona <strong>Cerrar Sesión</strong>.</p>
                </div>

                <div className="faq-item">
                    <h3><FaFileUpload className="faq-icon" /> ¿Puedo enviar archivos?</h3>
                    <p>Actualmente solo puedes enviar texto. Pronto habilitaremos el envío de imágenes y documentos.</p>
                </div>

                <div className="faq-item">
                    <h3><FaEnvelope className="faq-icon" /> ¿A quién puedo contactar para soporte?</h3>
                    <p>Escríbenos a <a href="mailto:soporte@chatapi.com">soporte@chatapi.com</a> o usa el formulario de contacto.</p>
                </div>
            </section>

            <footer className="ayuda-footer">
                <p>¿No encontraste lo que buscabas? Contáctanos.</p>
                <a href="mailto:soporte@chatapi.com" className="ayuda-contacto">Enviar un correo</a>
            </footer>
        </div>
    );
}

export default Ayuda;