import moment from "moment";
moment.suppressDeprecationWarnings = true;
export const getFormattedPrice = (price) => {
  return Number(price.replace(/[^\d(.|,)-]/g, "").replace(",", "."));
};

export const getMaxSizeText = (str, numChars) => {
  return str.substring(0, numChars) + "...";
};

export const checkEmail = (email) => {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(email);
};

export const checkLocalStorageAccount = (url) => {
  // if getitem != null -> exists
  return localStorage.getItem(url) !== null ? true : false;
};
/**
 * Function that will check if the users products url is on the shop list
 * @param {Array} list
 * @returns Return true if there're value that exists into the list
 */
export const verifyHasAccount = (list) => {
  const hasAccount = list.map((prod) => {
    const host = new URL(prod.url).hostname;
    return checkIfAccountNotExists(host) ? true : false;
  });
  // if find any true element ==> no existe la cuenta
  return hasAccount.some((x) => x === true) ? true : false;
};
/**
 * Function that will search an url into a list
 * @param {array} list
 * @param {string} url
 * @returns true if the element is in list
 */
export const findItemInList = (list, url) => {
  // If element is in list return the element, so then return false, else true
  const element = list.find((prod) => url.includes(prod));
  return element ? true : false;
};

/**
 * Function will receive a host name and will return the icon of that url
 * @param {host url} host
 * @returns Will return an icon url depending the host
 */
export const getImageByUrl = (url) => {
  if (url) {
    if (url.includes("amazon")) return "/assets/ShopImages/amazon_icon.png";
    if (url.includes("pccomponentes")) return "/assets/ShopImages/pccomponentes_icon.png";
    if (url.includes("ldlc")) return "/assets/ShopImages/ldlc_icon.png";
    if (url.includes("aussar")) return "/assets/ShopImages/aussar.png";
    if (url.includes("decathlon")) return "/assets/ShopImages/decathlon_icon.png";
    if (url.includes("coolmod")) return "/assets/ShopImages/coolmod.png";
    if (url.includes("elcorteingles")) return "/assets/ShopImages/corte_ingles_icon.png";
    if (url.includes("wipoid")) return "/assets/ShopImages/wipoid.png";
  }
  return "/assets/ShopImages/default_icon.jpg";
};

/**
 * Function will receive a host name and will return the image of that url
 * @param {host url} host
 * @returns Will return an image url depending the host
 */
export const getImageCompanyByUrl = (host) => {
  if (host.includes("carrefour")) return "/media/imgs/carrefour.png";
  return "/media/imgs/carrefour.png";
};
/**
 * Function will check if the current object is empty or not
 * @param {object} obj
 * @returns true if object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const formatDate = (date, format = "DD-MM-YYYY HH:mm:ss") => {
  let formatDate = date;
  if (date === null) formatDate = new Date().toString();
  return moment(new Date(formatDate)).format(format);
};
export const isTodayDate = (date) => {
  return moment().isSame(date, "day"); // Return true if we are the 2010-02-01
};
export const getDateDiff = (date) => {
  const current = moment().startOf("day");
  var given = moment(date, "YYYY-MM-DD");
  return moment.duration(given.diff(current)).asDays();
};

export const GetAllSameDay = (date, array) => {
  const data = array.filter((el) => moment(el.created_at).isSame(date, "day"));
  return data.length;
};

export const getImageProduct = (url) => {
  return "http://localhost:3000" + getImageCompanyByUrl(url);
};
export const getImageIconProduct = (url) => {
  return "http://localhost:3000" + getImageByUrl(url);
};

export const getFirstUppercase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDiffPrices = (p1, p2) => {
  return (p1 - p2).toFixed(2);
};

export const countNumProducts = (array, id) => {
  return array.filter((e) => e._id === id).length;
};

export const recalculatePriceTime = (price = 0, oldTime, newTime) => {
  let returnPrice = +price;
  if (oldTime === newTime) returnPrice = price;
  else {
    if (oldTime === "month") {
      if (newTime === "triMonth") returnPrice = price * 3;
      else if (newTime === "year") returnPrice = price * 12;
      else if (newTime === "week") returnPrice = price / 4;
    } else if (oldTime === "triMonth") {
      if (newTime === "month") returnPrice = price / 3;
      else if (newTime === "year") returnPrice = (price / 3) * 12;
      else if (newTime === "week") returnPrice = price / 3 / 4;
    } else if (oldTime === "year") {
      if (newTime === "month") returnPrice = price / 12;
      else if (newTime === "triMonth") returnPrice = (price / 12) * 3;
      else if (newTime === "week") returnPrice = price / 12 / 4;
    } else if (oldTime === "week") {
      if (newTime === "month") returnPrice = price * 4;
      else if (newTime === "triMonth") returnPrice = price * 4 * 3;
      else if (newTime === "year") returnPrice = price * 4 * 12;
    } else returnPrice = price;
  }
  return +returnPrice;
};
export const calculatePriceQty = (array, estimate) => {
  let price = 0;
  let objArray = {};
  array.map((e) => {
    objArray[e._id] = e.price;
  });
  estimate.map((est) => {
    price += est.qty * objArray[est._id];
  });
  return price.toFixed(2);
};
