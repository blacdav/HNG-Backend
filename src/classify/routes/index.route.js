import { Router } from "express";
import { GetClassify } from "../controllers/get.classify.js";

const router = Router();

router.get('/', GetClassify);

export default router;