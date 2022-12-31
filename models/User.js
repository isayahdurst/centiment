const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING,
            len: 140,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.BLOB('long'),
        },
        wallet_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'wallet',
                key: 'id',
            },
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'transaction',
                key: 'id',
            },
        },
    },
    {
        hooks: {
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(
                    newUserData.password,
                    10
                );
                return newUserData;
            },

            async beforeUpdate(userData) {
                console.log('Before Update...');
                userData.password = await bcrypt.hash(userData.password, 10);
                console.log(`Encrypted Password: ${userData.password}`);
                return userData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
