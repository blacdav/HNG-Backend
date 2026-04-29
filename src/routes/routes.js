import { Router } from "express";
import AuthRoutes from "../auth/routes/index.js";
import ProfileRoutes from "../profiles/routes/index.routes.js";
import ClassifyRoutes from "../classify/routes/index.route.js";
import { CheckAuthUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/profiles', CheckAuthUser, ProfileRoutes);
router.use('/classify', ClassifyRoutes);

export default router;