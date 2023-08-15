// Exporting a utility function to convert an ISO date to the YYYY-MM-DD format
module.exports = {
  convertISODateToYYYYMMDD: function (isoDate) {
    // Create a Date object from the provided ISO date
    const date = new Date(isoDate);

    // Extract year, month, and day components from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month ranges from 0 to 11
    const day = String(date.getDate()).padStart(2, '0');

    // Format the components into the YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

};