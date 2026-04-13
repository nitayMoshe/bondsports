import express from "express";
import * as accountController   from "./controllers/accountController";

export const app = express();
app.use(express.json());

app.get("/health", accountController.health);

app.post("/accounts", accountController.createAccount);
app.get("/accounts/:id/balance", accountController.getBalance);
app.post("/accounts/:id/deposit", accountController.deposit);
app.post("/accounts/:id/withdraw", accountController.withdraw);
app.patch("/accounts/:id/block", accountController.block);
app.get("/accounts/:id/statement", accountController.statement);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  res.status(500).json({ error: message });
});
