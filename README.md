
# Project Title

A brief description of what this project does and who it's for


# Chat API

**Chat API** es una API robusta que permite integrar funcionalidades de chat en tiempo real en aplicaciones web, móviles o de escritorio.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Configuración](#configuración)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Características

- 🔐 **Autenticación Segura** con JWT.
- 💬 **Mensajería en Tiempo Real** mediante WebSockets.
- 💾 **Persistencia de Mensajes** en base de datos MongoDB.
- 🖥️ **Interfaz de Usuario** interactiva incluida.
- 🔔 **Notificaciones** por nuevos mensajes/eventos.
- 📱 **Soporte Multiplataforma**: web, móvil y escritorio.

---

## Tecnologías Utilizadas

- **JavaScript**
- **Node.js**
- **Express**
- **MongoDB**
- **Socket.IO**
- **HTML + CSS**

---

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Gaus8/Chat_API.git

# 2. Acceder al directorio
cd Chat_API

# 3. Instalar las dependencias
npm install
```

- Asegúrate de tener MongoDB en ejecución y crea una base de datos llamada `chat_db`.

```bash
# 4. Iniciar el servidor
npm start
```

---

## Uso

Una vez el servidor está corriendo, accede a la API en:  
`http://localhost:3000`

### Flujo básico

1. **Registro** de usuarios (`/register`)
2. **Login** y obtención de token JWT (`/login`)
3. **Envío y recepción** de mensajes en tiempo real (`/messages` + Socket.IO)

---

## Endpoints de la API

### 🔐 Autenticación

#### POST `/register`
**Registra un nuevo usuario**

```json
{
  "username": "nombre_usuario",
  "password": "contraseña"
}
```

#### POST `/login`
**Autentica y devuelve un token JWT**

```json
{
  "username": "nombre_usuario",
  "password": "contraseña"
}
```

---

### 💬 Mensajería

#### GET `/messages`
**Obtiene todos los mensajes**

- Header: `Authorization: Bearer <token>`

#### POST `/messages`
**Envía un nuevo mensaje**

```json
{
  "user": "nombre_usuario",
  "message": "¡Hola a todos!"
}
```

- Header: `Authorization: Bearer <token>`

---

## Ejemplos de Uso

### 📌 Registro de Usuario

```bash
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"username": "Juan", "password": "miContraseña"}'
```

### 🔑 Inicio de Sesión

```bash
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username": "Juan", "password": "miContraseña"}'
```

### 💬 Enviar Mensaje

```bash
curl -X POST http://localhost:3000/messages \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <token>" \
-d '{"user": "Juan", "message": "¡Hola a todos!"}'
```

### 📥 Obtener Mensajes

```bash
curl -X GET http://localhost:3000/messages \
-H "Authorization: Bearer <token>"
```

---

## Configuración

Edita el archivo `config.js` para modificar parámetros como el puerto, la URL de MongoDB y la clave JWT:

```javascript
module.exports = {
  dbURI: 'mongodb://localhost:27017/chat_db',
  port: process.env.PORT || 3000,
  jwtSecret: 'tu_secreto_jwt_aqui'
};
```

---

## Contribuciones

¡Contribuciones son bienvenidas!

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-característica`
3. Realiza tus cambios y haz commit: `git commit -m 'Nueva característica'`
4. Push a tu fork: `git push origin feature/nueva-característica`
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

---
