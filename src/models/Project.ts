import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

//this is for TypeScript
export interface IProyect extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

//This is for Mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true, //Trim the space what no use
                    //Unique signify: Promise to be unique
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

//This is for connect Mongoose and the model TypeScript

//Middleware
//eliminando un proyecto
ProjectSchema.pre('deleteOne', {document: true}, async function(){
    //recuperamos el Project ID
    const projectId = this._id
    if(!projectId) return 

    //nos traemos todas las tareas que estén relacionadas con este proyecto.
    const tasks =  await Task.find({project: projectId})
    //Iteramos obre cada tarea y vamos a ir eliminando las notas que tengan la tarea sobre la cual estamos iterando.
    for(const task of tasks){
        await Note.deleteMany({task: task.id})
    }
    await Task.deleteMany({project: projectId})
})

const Project = mongoose.model<IProyect>('Project', ProjectSchema)
export default Project