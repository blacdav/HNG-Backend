import jwt from "jsonwebtoken";

export default class TokenService {
    static {
        this.access = "gh_access_token";
        this.refresh = "gh_refresh_token";
    }

    static async genAccessToken(payload) {
        try {
            return jwt.sign(payload, this.access, { expiresIn: "5s" });
        } catch (err) {
            console.log("Error generating access token", err);
            throw err;
        }
    }

    static async genRefreshToken(payload) {
        try {
            return jwt.sign(payload, this.refresh, { expiresIn: "5m" });
        } catch(err) {
            console.log("Error generating refresh token", err);
            throw err;
        }
    }

    static async verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.access);
        } catch (err) {
            console.log("Access token verification failed", err);
            throw err;
        }
    }

    static async verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refresh);
        } catch (err) {
            console.log("Refresh token verification failed", err);
            throw err;
        }
    }
};