import { Router } from "express";
import AuthRoutes from "../auth/routes/index.js";
import ProfileRoutes from "../profiles/routes/index.routes.js";
import ClassifyRoutes from "../classify/routes/index.route.js";
import { CheckAuthUser } from "../middlewares/auth.middleware.js";
import { ApiLimit, AuthLimit } from "../middlewares/rate-limit.middleware.js";

const router = Router();

router.use('/auth', AuthLimit, AuthRoutes);
router.use('/profiles', ApiLimit, CheckAuthUser, ProfileRoutes);
    router.use('/classify', ClassifyRoutes);

export default router;