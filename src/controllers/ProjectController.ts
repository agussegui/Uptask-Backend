import type {Request, Response} from 'express'
import Project from '../models/Project'



export class ProjectController {
    
    static createProject = async (req: Request, res:Response) => {
        const project = new Project(req.body)

        //Asigna un manager al proyecto
        project.manager = req.user.id
        try {
            await project.save(req.body)
            res.send('proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    
    static getAllProjects = async (req: Request, res:Response) => {

        try {
            //Con esto me traigo los proyectos unicamente que esten autenticado los usuarios
            const projects = await Project.find({
                $or : [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }

    }

    static getProjectById = async (req: Request, res:Response) => {

        const {id} = req.params
        try {

            const project = await (await Project.findById(id)).populate('tasks')
            if(!project){
                const error = new Error('Projecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }

            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res:Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            
            await req.project.save()
            res.send('Projecto Actualizado')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res:Response) => {
        try{
            await req.project.deleteOne()
            res.send('Projecto eliminado')
            
        } catch (error) {
            console.log(error)
        }
    }
}

