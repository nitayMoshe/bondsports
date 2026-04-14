import { Router } from 'express';
import * as accountController from '../controllers/accountController';

const router = Router();



router.post("/", accountController.createAccount);
router.get("/:id/balance", accountController.getBalance);
router.post("/:id/deposit", accountController.deposit);
router.post("/:id/withdraw", accountController.withdraw);
router.patch("/:id/block", accountController.block);
router.patch("/:id/unblock", accountController.unblock);
router.get("/:id/statement", accountController.statement);

export default router;