import type  { Request, Response, NextFunction} from 'express'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req:  Request, res: Response, next: NextFunction) {

    try {
        const {taskId} = req.params
        const task = await Task.findById(taskId)
        
        if(!task){
            const error = new Error('Tarea no encontrado')
            return res.status(404).json({error: error.message})
        }
        req.task = task
        next()
        //Entonces toma el Project ID desde la URL, revisa si ese proyecto existe.
        //Si no existe, envía esa respuesta y si existe, se va hacia el siguiente middleware donde lo vamos
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export function taskBelongsToProject(req:  Request, res: Response, next: NextFunction){
    //validation if the task is not inside the project
    
    if(req.task.project.toString() !== req.project.id.toString()){
        const error = new Error('Accion no valida')
        return res.status(400).json({error: error.message})
    }
    next()
}

export function hasAuthorization(req:  Request, res: Response, next: NextFunction){
    //validation if the task is not inside the project
    
    if(req.user.id.toString() !== req.project.manager.toString() ){
        const error = new Error('Accion no valida')
        return res.status(400).json({error: error.message})
    }
    next()
}