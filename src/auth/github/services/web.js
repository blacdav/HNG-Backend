import { ghConfig } from "../../../config/index.js";

export default class GitHubWebServices {
    static {
        this.baseUrl = "https://github.com";
        this.apiUrl = "https://api.github.com";
        this.client_id = ghConfig.clientId;
        this.client_secret = ghConfig.clientSecret;
    }

    static async exchangeCodeForToken(code, code_verifier) {
        try {
            const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: this.client_id,
                    client_secret: this.client_secret,
                    code_verifier,
                    code
                })
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error exchanging GitHub code for token:", error);
            throw error;
        }
    }

    static async getUserInfo(accessToken) {
        try {
            const response = await fetch(`${this.apiUrl}/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching GitHub user info:", error);
            throw error;
        }
    }

    static async createUserIfNotExists(userInfo) {
        // Implementation for creating user if not exists
    }
}