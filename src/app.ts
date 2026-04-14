import express from "express";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import accountRoutes from './routes/accountRoutes'; // Import your new routes file
import * as accountController from './controllers/accountController';

export const app = express();

app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", accountController.health);
app.use('/accounts', accountRoutes);

// 4. Global Error Handler (Keep this at the very bottom!)
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ error: message });
});