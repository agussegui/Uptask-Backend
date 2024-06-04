import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whiteList = [process.env.FRONTEND_URL];

        if (process.argv[2] === '--api') {
            callback(null, true); // Permitir todas las solicitudes en modo API
        } else {
            if (!origin || whiteList.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Error de CORS'));
            }
        }
    }
};