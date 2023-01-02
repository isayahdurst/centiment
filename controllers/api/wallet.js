const { Router } = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');

const { Wallet } = require('./../../models');

const walletRouter = new Router();

walletRouter.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const wallet = await Wallet.findOne({
            where: {
                user_id: user_id,
            },
        });

        if (!wallet) {
            throw new Error('No Wallet Found.');
        }

        res.json(wallet);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = walletRouter;
