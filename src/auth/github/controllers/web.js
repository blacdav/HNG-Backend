import crypto from "node:crypto";
import { ghConfig } from "../../../config/index.js";

export const GithubAuth = (req, res) => {
    // controllers redirects users to github oauth

    const code_verifier = crypto.randomBytes(32).toString("base64url");
    const state = crypto.randomBytes(16).toString("hex");

    const code_challenge = crypto
    .createHash("sha256")
    .update(code_verifier)
    .digest("base64url");

    res.cookie("gh_oauth_state", JSON.stringify({state, code_verifier}), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/api/auth/github/callback",
        maxAge: 20 * 1000 // 20 seconds
    });

    const url = `https://github.com/login/oauth/authorize?` +
        new URLSearchParams({
            client_id: ghConfig.clientId,
            redirect_uri: ghConfig.callbackUrl,
            code_challenge_method: "S256",
            code_challenge,
            state,
            scope: "read:user"
        }).toString();

    res.redirect(url);
}