import express from "express";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import accountRoutes from './routes/accountRoutes';
import * as accountController from './controllers/accountController';
import { errorHandler } from './middlewares/errorHandler';


export const app = express();

app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", accountController.health);
app.use('/accounts', accountRoutes);

app.use(errorHandler);