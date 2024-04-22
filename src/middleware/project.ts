import type  { Request, Response, NextFunction} from 'express'
import Project, { IProyect } from '../models/Project'

declare global {
    namespace Express {
        interface Request {
            project: IProyect
        }
    }
}

export async function projectExists(req:  Request, res: Response, next: NextFunction) {

    try {
        const {projectId} = req.params
        const project = await Project.findById(projectId)
        
        if(!project){
            const error = new Error('Projecto no encontrado')
            return res.status(404).json({error: error.message})
        }
        req.project = project
        next()
        //Entonces toma el Project ID desde la URL, revisa si ese proyecto existe.
        //Si no existe, envía esa respuesta y si existe, se va hacia el siguiente middleware donde lo vamos
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}