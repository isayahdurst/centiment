const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }

    async decreaseBalance(amount) {
        if (this.balance - amount < 0) {
            throw new Error('Insufficient Balance... Getcha 🍞 up first');
        }

        this.balance -= amount;
        console.log(this.balance);
        await this.save();
    }

    async increaseBalance(amount) {
        this.balance += amount;
        return this.save();
    }

    async refund(bidPrice, askPrice) {
        await this.increaseBalance(bidPrice - askPrice);
        await this.save();
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
            validate: {
                allowNull: false,
            },
            unique: {
                args: true,
                msg: 'Username already in use!'
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }
        },
        bio: {
            type: DataTypes.STRING,
            len: [0, 140],
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            min: 8, //password must be at least 8 chars
            validate: {
                is: /^[0-9a-f]{64}$/i
            }
        },
        avatar: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: true,
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

            // After a user is created, this hook will update their balance to a starting value of 100,000.

            async afterCreate(user) {
                user.balance = 100_000;
                await user.save({ fields: ['balance'] });
            },

            async beforeUpdate(user) {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                    return user;
                }
                return user;
            },
        },
        sequelize,
        useIndividualHooks: true,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
