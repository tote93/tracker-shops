const formatPrice = (price) => {
  if (price) {
    let formattedPrice = price.replace(/[^\d(.|,)]/g, "");
    // If has "," and "." mean the product is higher than 999
    if (formattedPrice.includes(",") && formattedPrice.includes(".")) {
      formattedPrice = formattedPrice.slice(0, -3);
      if (formattedPrice.includes(".")) formattedPrice = formattedPrice.replace(".", "");
      if (formattedPrice.includes(",")) formattedPrice = formattedPrice.replace(",", "");
    } else {
      if (formattedPrice.includes(",")) {
        formattedPrice = formattedPrice.replace(",", ".");
      }
    }
    return Number(formattedPrice);
  }
  return 0;
};
const getCurrency = (str) => {
  if (str) {
    var res = str;
    if (str.includes(",")) res = str.replace(",", "");
    if (str.includes(".")) res = str.replace(".", "");
    res = res.replace(/[0-9]/g, "");
    return res.trim();
  }
  return "";
};
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("-") +
    " " +
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(":")
  );
}
const compareEqualDates = (d1, d2) => {
  return new Date(d1).getTime() == new Date(d2).getTime();
};

const getDateDiffHours = (d1, d2) => {
  return Math.abs(new Date(d1) - new Date(d2)) / 36e5;
};

module.exports = { getDateDiffHours, compareEqualDates, getCurrency, formatPrice, formatDate };
