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
      returnString = stringVal.substring(0, 197) + '...'
    } else {
      returnString = stringVal;
    }
    return returnString;
  },
};
