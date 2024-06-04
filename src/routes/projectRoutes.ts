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
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API operations related to projects
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 description: Nombre del proyecto
 *                 example: Proyecto A
 *               clientName:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: Cliente XYZ
 *               description:
 *                 type: string
 *                 description: Descripción del proyecto
 *                 example: Este es un proyecto importante
 *     responses:
 *       200:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Error de validación
 */

/**Routes for Proyect */
router.post('/', 
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
    
)
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       401:
 *         description: No autorizado
 */
router.get('/', ProjectController.getAllProjects)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *       400:
 *         description: ID no válido
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', 
    param('id').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    ProjectController.getProjectById

)


router.param('projectId', projectExists) //si existe el proyecto se va hacia el controlador.

/**
 * @swagger
 * /api/projects/{projectId}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 description: Nombre del proyecto
 *               clientName:
 *                 type: string
 *                 description: Nombre del cliente
 *               description:
 *                 type: string
 *                 description: Descripción del proyecto
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Proyecto no encontrado
 */
router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('El ID no es valido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Proyecto no encontrado
 */

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject

)
/* Routes for Tasks */
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API operations related to tasks
 */

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la tarea
 *               description:
 *                 type: string
 *                 description: Descripción de la tarea
 *     responses:
 *       200:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Proyecto no encontrado
 */


router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    TaskController.createTask

)

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Obtener todas las tareas de un proyecto
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Lista de tareas
 *       404:
 *         description: Proyecto no encontrado
 */

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   get:
 *     summary: Obtener tarea por ID
 *     tags: 
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente
 *         
 *       400:
 *         description: Parámetros no válidos
 *         
 */

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    handleInputErrors,
    TaskController.getTaskById

)


/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   put:
 *     summary: Actualizar tarea
 *     tags: 
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la tarea
 *               description:
 *                 type: string
 *                 description: Descripción de la tarea
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       400:
 *         description: Parámetros no válidos
 *       401:
 *         description: No autorizado
 */


router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El ID no es valido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTask

)

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Eliminar tarea
 *     tags: 
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa
 *       400:
 *         description: Parámetros no válidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Descripción del error
 */

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
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API operations related to Notes
 */

/**
 * @swagger
 * /{projectId}/tasks/{taskId}/notes:
 *   post:
 *     summary: Crear una nota
 *     tags: 
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenido de la nota
 *     responses:
 *       201:
 *         description: Nota creada exitosamente
 *       400:
 *         description: Parámetros no válidos
 */

router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contendio de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote

)

/**
 * @swagger
 * /{projectId}/tasks/{taskId}/notes:
 *   get:
 *     summary: Obtener notas de una tarea
 *     tags: 
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Notas obtenidas exitosamente
 *       400:
 *         description: Parámetros no válidos
 */

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

/**
 * @swagger
 * /{projectId}/tasks/{taskId}/notes/{noteId}:
 *   delete:
 *     summary: Eliminar una nota
 *     tags: 
 *       - Notes
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la nota
 *     responses:
 *       200:
 *         description: Nota eliminada exitosamente
 *         
 *       400:
 *         description: Parámetros no válidos
 *         
 */

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('Id no valido'),
        handleInputErrors,
        NoteController.deleteNote

)
export default router