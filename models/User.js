const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }

    async decreaseBalance(amount, transaction) {
        if (this.balance - amount < 0) {
            throw new Error('Insufficient Balance... Getcha 🍞 up first');
        }

        this.balance -= amount;
        console.log(this.balance);
        await this.save({ transaction });
    }

    async increaseBalance(amount) {
        this.balance += amount;
        return this.save();
    }

    async setBalance(balance) {
        this.balance = balance;
        console.log(
            `${this.username}(${this.balance}): Balance set to ${this.balance}`
        );
        await this.save();
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
            allowNull: false,
            unique: {
                args: true,
                msg: 'Username already in use!'
            },
        },
        email: {
            type: DataTypes.STRING,
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
                try{
                    const passwordValidator = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z])[A-Za-z0-9!@#$%^&*]{12,}$|^test$/
                    if(!passwordValidator.test(newUserData.password)){
                        throw new Error("Password does not have the required characters.");
                    };

                    newUserData.password = await bcrypt.hash(
                        newUserData.password,
                        10
                    );

                    return newUserData;
                    
                } catch(err) {
                    console.log(err);
                };
                
                
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
        /*
            indexes: [
              {
                unique: true,
                fields: ['email'],
              },
              {
                unique: true,
                fields: ['username'],
              },
            ],*/
        sequelize,
        useIndividualHooks: true,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;
