const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
    sequelize.define('versioning', {
        // The following specification of the 'id' attribute could be omitted
        // since it is the default.
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        email: { // user email when they sign the eula/policy
            allowNull: false,
            type: DataTypes.STRING
        },
        type: { // policy or eula
            allowNull: false,
            type: DataTypes.STRING,
        },
        version: {
            allowNull: false,
            type: DataTypes.DATE
        }
    });
};