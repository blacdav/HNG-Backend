export const LogOutAuth = (req, res) => {
    // receives a json body with refresh token, 
    // invalidates the refresh token in the database
    const { refresh_token } = req.body;

    try {
        // Invalidate the refresh token in the database (if you are storing them)
        // For example, you could have a RefreshToken model and set the token as invalid
        // await RefreshToken.update({ is_valid: false }, { where: { token: refresh_token } });
        return res.status(204).end();
    } catch (err) {
        console.error("Error logging out:", err);
        return res.status(400).json({
            status: "error",
            message: "Error occurred while logging out"
        });
    }
}