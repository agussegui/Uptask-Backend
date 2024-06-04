import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'


dotenv.config()
connectDB()

const app = express();
app.use(cors(corsConfig))

//Login
app.use(morgan('dev'))

//Read data the formulary
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)

// Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default app