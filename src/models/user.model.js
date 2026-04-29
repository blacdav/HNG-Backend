import { sequelize } from "../db/index.js";
import { DataTypes, Model } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default class User extends Model {
    static associate(model) {
        this.hasMany(model.RefreshToken, {
            foreignKey: "user_id",
            as: "refresh_tokens"
        });
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true
    },
    github_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "invalid email pattern"
            }
        }
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: {
                msg: "avatar_url must be a valid url"
            }
        }
    },
    role: {
        type: DataTypes.ENUM("admin", "analyst"),
        allowNull: false,
        defaultValue: "analyst",
        validate: {
            isIn: {
                args: [["admin", "analyst"]],
                msg: "role can either be admin or analyst"
            }
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: {
                msg: "last login must be a valid date"
            }
        }
    }
}, {
    sequelize,
    timestamps: true,
    modelName: "User",
    tableName: "users",
    underscored: true,
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ["github_id", "email"]
        }
    ]
});