import swaggerJSDoc from "swagger-jsdoc";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Auth',
                description: 'API operations related to Auth'
            },
            {
                name: 'Projects',
                description: 'API operations related to Projects'
            }
        ],
        info: {
            title: 'REST API The Uptask made with Node.js / Express / TypeScript',
            version: '1.0.0',
            description: "API Docs for Projects and Authentication"
        }
    },
    apis: ['./src/routes/*']
}
const swaggerSpec =  swaggerJSDoc(options)
export default swaggerSpec