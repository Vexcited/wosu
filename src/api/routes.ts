import express from "express";
import * as controllers from "./controllers";
const router = express.Router();

router.get("/matchs", controllers.get_matchs);

export default router;
