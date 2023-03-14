const helpers = {
  format_date: (date) => {
    console.log(date); // Add this line
    return `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;
  },
  // Other helpers ...
};

module.exports = helpers;
