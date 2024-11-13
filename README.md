## Uptask - Project Management

Uptask is a web-based project and task management tool designed for teams looking for an easy way to organize their activities. This application provides features such as project creation and management, task assignment, and the ability to create notes to track task modifications.

##🚀 Características Principales
- Gestión de Proyectos y Tareas: Crea proyectos, divide tus actividades en tareas, y asigna fechas de entrega.
- Interfaz Intuitiva: Diseño responsivo y amigable con el usuario, creado con Tailwind CSS y React.
- Autenticación Segura: Sistema de autenticación basado en tokens, con funciones de registro, inicio de sesión, y recuperación de contraseñas.

## 🛠️ Technologies User
- Frontend: React, TypeScript, Tailwind Css
- Backend: Node.js, Express, Swagger
- DataBases: MondgoDB
- Email: Nodemailer, Mailtrap.

## 📂 Project Structure

Here's the updated structure of the backend project:

```bash
├── src/
│   ├── config/           # Configuration files (e.g., database, environment variables, CORS)
│   │   ├── db.ts         # Database connection and setup (e.g., using Prisma or Sequelize)
│   │   ├── cors.ts       # CORS configuration for handling cross-origin requests
│   ├── controllers/      # Logic for handling API requests
│   ├── emails/           # Email sending and templates
│   │   ├── AuthEmail.ts  # Logic for sending authentication-related emails (e.g., confirmation, reset)
│   ├── middleware/       # Middleware functions (e.g., authentication, validation)
│   ├── models/           # Database models and schema definitions
│   ├── routes/           # API routes and endpoint definitions
│   ├── utils/            # Helper functions and general utility logic
│   │   ├── jsw.ts        # JWT token utility functions (e.g., signing, verification)
│   │   ├── token.ts      # Token management (e.g., refresh tokens, access tokens)
│   ├── index.ts          # Main entry point for initializing the backend application
│   ├── server.ts         # Server setup and configuration (e.g., Express app initialization)
├── tsconfig.json         # TypeScript configuration for the backend

    
```
 
https://github.com/user-attachments/assets/d549c0ed-1665-4901-b2a9-2f953c21cfca


https://github.com/user-attachments/assets/9d23b10a-63df-4673-9730-87efec3f7678

