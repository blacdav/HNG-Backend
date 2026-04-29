import { DataTypes, Model } from "sequelize";
import { v7 as uuidv7 } from "uuid";
import { sequelize } from "../db/index.js";

export default class RefreshToken extends Model {
    static associate(model) {
        this.belongsTo(model.User, {
            foreignKey: "user_id",
            as: "user"
        });
    }
};

RefreshToken.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            isUUID: {
                msg: "user_id must be a valid UUID"
            }
        }
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isDate: {
                msg: "expires_at must be a valid date string"
            }
        }
    }
}, {
    sequelize,
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ["token"]
        }
    ]
});