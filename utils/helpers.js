module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  format_amount: (amount) => {
    // format large numbers with commas
    return parseInt(amount).toLocaleString();
  },
  normilize_text: (stringVal) => {
    let returnString;
    if (stringVal.length > 200) {
      returnString = stringVal.substring(0, 200) + '...'
    } else {
      returnString = stringVal;
    }
    return returnString;
  },
};
