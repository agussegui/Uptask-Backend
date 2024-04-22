import { Router } from "express";
import { body, param } from 'express-validator'
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

/**Routes for Proyect */
router.post('/', 
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
    
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    ProjectController.getProjectById

)

/* Routes for Tasks */
router.param('projectId', projectExists) //si existe el proyecto se va hacia el controlador.

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('El ID no es valido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject

)

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    TaskController.createTask

)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks

)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    TaskController.getTaskById

)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTask

)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    TaskController.deleteTask

)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus

)

/**Routes for Teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID No valido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No valido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contendio de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote

)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('Id no valido'),
        handleInputErrors,
        NoteController.deleteNote

)
export default router