const Bid = require('../models/Bid');

const fulfilOutstandingBids = function (bids, asks) {
    const possibleBids = bids.filter((bid) => bid.price >= asks.price);
    console.log(possibleBids);
};

module.exports = fulfilOutstandingBids;
