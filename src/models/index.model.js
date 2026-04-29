import Profile from "./profile.model.js";
import RefreshToken from "./refresh-token.model.js";
import User from "./user.model.js";

const models = { Profile, RefreshToken, User };

Object.values(models).forEach(model => {
    if(typeof model === "function") {
        model.associate(models);
    }
})

export default models;