module.exports = {
    format_date: (date) => {
        // Format date as MM/DD/YYYY
        return date.toLocaleDateString();
    },

    format_amount: (amount) => {
        // format large numbers with commas
        return parseInt(amount).toLocaleString();
    },

    normalize_text: (stringVal) => {
        // shoren string longer than 200 chars. Used in explore cards
        let returnString;
        if (stringVal.length > 200) {
            returnString = stringVal.substring(0, 197) + '...';
        } else {
            returnString = stringVal;
        }
        return returnString;
    },

    calculateValue: (shares, price) => {
        return shares * price;
    },

    timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + 'y';
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + 'd';
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + 'h';
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + 'm';
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + 's';
        }
        return Math.floor(seconds) + 's';
    },
    addToIndex: (index) => {
        return index + 1;
    },
};
