import { sequelize } from "../db/index.js";
import { DataTypes, Model } from "sequelize";
import { v7 as uuidv7 } from "uuid";

export default class Profile extends Model {
    static associate(models) {}
}


Profile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv7(),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false
    },
    gender_probability: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sample_size: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    age_group: {
        type: DataTypes.ENUM("child", "teenager", "adult", "senior"),
        allowNull: false
    },
    country_id: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
            isAlpha: true,
            len: [2, 2]
        }
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country_probability: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    indexes: [
        {
            fields: ["age_group", "gender", "country_name", "age"]
        },
        {
            unique: true,
            fields: ["name"]
        }
    ],
    underscored: true,
    modelName: "Profile",
    tableName: "profiles"
});