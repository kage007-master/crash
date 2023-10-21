import express from "express";
import crashController from "../controllers/crash.controller";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.get("/mybet", authMiddleware, crashController.getMyBet);
router.get("/history", crashController.getHistory);
router.get("/top-players", crashController.getTopPlayers);

export default router;
