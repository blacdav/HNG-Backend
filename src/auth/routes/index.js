import { Router } from "express";
import { GithubAuth } from "../github/controllers/web.js";
import { GhCallbackAuth, GhDeviceCallbackAuth } from "../github/controllers/gh_callback.js";
import { RefreshAuth } from "../refresh.auth.js";
import { GitHubDeviceAuth } from "../github/controllers/device.js";
import { MeAuth } from "../me.auth.js";
import { CheckAuthUser } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get('/github', GithubAuth);
router.get('/github/callback', GhCallbackAuth); // to be called by github server
router.post('/refresh', RefreshAuth);
// router.post('/logout', LogoutAuth);
router.get('/github/device', GitHubDeviceAuth);
router.post('/github/device/callback', GhDeviceCallbackAuth);
// router.post('/logout', LogoutAuth);
router.get('/me', CheckAuthUser, MeAuth);

export default router;