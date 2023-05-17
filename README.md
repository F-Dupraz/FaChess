# FaChess

Este es un proyecto de una aplicación web para jugar al ajedrez en línea con amigos. Proporciona una plataforma interactiva donde los usuarios pueden registrarse, iniciar sesión, desafiar a otros jugadores y jugar partidas de ajedrez en tiempo real.

## Características principales

- Registro de usuarios: los usuarios pueden crear una cuenta utilizando un formulario de registro.

- Inicio de sesión: los usuarios pueden iniciar sesión en la aplicación con sus credenciales.

- Autenticación segura: se utiliza Passport.js junto con JSON Web Tokens (JWT) para autenticar y proteger las rutas de la aplicación.

- Gestión de sesiones: las sesiones de usuario se administran mediante cookies y almacenamiento seguro de tokens JWT.

- Juego de ajedrez en tiempo real: los usuarios pueden desafiar a otros jugadores y jugar partidas de ajedrez en tiempo real.

- Notificaciones de amistad: los usuarios pueden enviar solicitudes de amistad a otros jugadores y recibir notificaciones en tiempo real cuando se les envía una solicitud.

- Interfaz de usuario intuitiva: la interfaz de usuario se desarrolla utilizando HTML y CSS vanilla para una experiencia de usuario fluida y agradable.

## Tecnologías Utilizadas

- Node.js: entorno de ejecución de JavaScript del lado del servidor.

- Express.js: framework de aplicaciones web para Node.js que facilita la creación de rutas, controladores y middleware.

- MongoDB: base de datos NoSQL utilizada para almacenar datos de usuarios, partidas y solicitudes de amistad.

- Mongoose: biblioteca de modelado de objetos de MongoDB para Node.js que proporciona una interfaz sencilla y basada en esquemas para interactuar con la base de datos.

- Socket.io: biblioteca de tiempo real que permite la comunicación bidireccional en tiempo real entre el servidor y los clientes.

- Passport.js: middleware de autenticación para Node.js que se utiliza para autenticar a los usuarios y proteger las rutas de la aplicación.

- JSON Web Tokens (JWT): se utiliza para generar tokens de autenticación seguros y protegidos para la autenticación basada en tokens.

- HTML y CSS vanilla: se utiliza para crear la interfaz de usuario y el diseño visual de la aplicación.

## Configuración

1. Clona el repositorio o descarga los archivos del proyecto.

2. Asegúrate de tener Node.js y MongoDB instalados en tu sistema.

3. Instala las dependencias del proyecto ejecutando el siguiente comando en tu terminal:

npm install

markdown
Copy code

4. Configura las variables de entorno necesarias (como las credenciales de la base de datos y las claves secretas) en un archivo .env.

5. Inicia el servidor ejecutando el siguiente comando en tu terminal:

npm run dev

markdown
Copy code

## Contribución

Si deseas contribuir a este proyecto, sigue los siguientes pasos:

1. Crea una nueva rama para tu funcionalidad: `git checkout -b mi-nueva-funcionalidad`.
2. Realiza los cambios necesarios en el código.
3. Asegúrate de que el proyecto siga funcionando correctamente.
4. Agrega tus cambios al área de preparación: `git add .`.
5. Realiza un commit con tus cambios: `git commit -m "Agrega mi nueva funcionalidad"`.
6. Envía tus cambios al repositorio remoto: `git push origin mi-nueva-funcionalidad`.
7. Crea una nueva solicitud de extracción (pull request) en el repositorio original y describe tus cambios.
8. Espera a que revise tu solicitud y realice comentarios o solicite cambios adicionales.
9. Una vez que tu solicitud sea aprobada, tus cambios se fusionarán con la rama principal del repositorio y estarán disponibles para todos.

## Autor

Este proyecto fue creado por Fabricio Dupraz y puedes contactarme en duprazfabricio@gmail.com.
Código del juego de: https://github.com/AhmadAlkholy/Javascript-Chess-Game.
