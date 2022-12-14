import { DataTypes } from "sequelize";
import { sequelize } from "../modules/database.js";

const UrlsModel = sequelize.define('urls', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastResolve: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    updatedAt: false,
});

export { UrlsModel }