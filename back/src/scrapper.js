const { Builder, By, Key, until } = require("selenium-webdriver");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const { formatPrice, getCurrency } = require("./utils");
const { createUpdateProducts } = require("./database/database_actions");
const CARREFOUR_SECTIONS = [
  /*   { url: "/supermercado/the-market/cat20002/c", tag: ["Supermercado"], name: "super1" },
  { url: "/supermercado/la-despensa/cat20001/c", tag: ["Supermercado"], name: "super2" },
  { url: "/supermercado/drinks/cat20003/c", tag: ["Bebidas"], name: "bebidas" },
  { url: "/supermercado/baby/cat20006/c", tag: ["Infantil"], name: "infantil" },
  { url: "/supermercado/cleaning-and-household/cat20005/c", tag: ["Limpieza"], name: "limpieza" },
  { url: "/supermercado/perfumery-and-hygiene/cat20004/c", tag: ["Perfumería", "Higiene"], name: "perf_higiene" },
  { url: "/supermercado/pets/cat20007/c", tag: ["Mascotas"], name: "pets1" },
  { url: "/supermercado/para-pharmacy/cat20008/c", tag: ["Parafarmacia"], name: "paraFarm" },
  { url: "/casa-hogar", tag: ["Hogar"] }, */
  /* { url: "/cuidado-personal-y-salud", tag: ["Higiene", "Salud"], name:"salud1" }, */
  { url: "/mascotas", tag: ["Mascotas"], name: "pets2" },
  { url: "/health-and-beauty/cat15966350/c", tag: ["Salud", "Belleza"], name: "salud" },
  /* { url: "/bodega", tag: "Bodega", next: true }, */
  /* { url: "/ofertas-en-electronica-textil-y-bazar/cat10017263/c", tag: ["Electrónica Textil y Bazar"] }, */
  /* { url: "/juguetes", tag: ["Juguetes"] }, */
  { url: "/pequenos-productores/cat4510248/c", tag: ["Supermercado"], name: "super3" },
  /* { url: "/moda", tag: "Moda", next: true }, */
  /*   { url: "/bebe", tag: ["Infantil"] },
  { url: "/jardin", tag: ["Jardin"] }, */
  /*   { url: "/informatica", tag: ["Informática"], name: "inform" },
  { url: "/electronica", tag: ["Electrónica"], name: "electro" }, */
  /*   { url: "/electrodomesticos", tag: ["Electrodomésticos"] },
  { url: "/gaming", tag: ["Gaming"] },
  { url: "/libros-discos-video-papeleria-y-regalo/cat8440103/c", tag: ["Libros", "Papeleria"] },
  { url: "/deporte-ocio", tag: ["Deportes", "Ocio"] },
  { url: "/bricolaje-y-automovil", tag: ["Bricolaje", "Automovil"] },
  { url: "/tienda-de-oportunidades/cat10350029/c", tag: ["Oportunidades"] },
   */
];
let productArray = [];
let driver = null;
async function scrappeCarrefour() {
  const baseURL = "https://www.carrefour.es";
  let start = true;
  driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().addArguments("--headless")).build();
  //driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options()).build();
  try {
    for (let index = 0; index < CARREFOUR_SECTIONS.length; index++) {
      const section = CARREFOUR_SECTIONS[index];
      productArray = [];

      await driver.get(baseURL + section.url);
      await delay(2000);
      if (start) {
        await driver.findElement(By.xpath('//*[@id="onetrust-accept-btn-handler"]')).then(
          (found) => {
            driver.findElement(By.xpath('//*[@id="onetrust-accept-btn-handler"]')).click();
          },
          (error) => {}
        );
        await driver.findElement(By.xpath('//*[@id="app"]/div/nav/div[2]/div/div/span')).then(
          (found) => {
            driver.findElement(By.xpath('//*[@id="app"]/div/nav/div[2]/div/div/span')).click();
          },
          (error) => {}
        );
        start = false;
      }
      if (await productListFound()) {
        await getInfoPage(section.tag);
        let prevQty = productArray.length;
        console.log("Finished", baseURL + section.url, "---", productArray.length);

        await driver.findElement(By.xpath("//div[contains(@class, 'pagination__main')]")).click();
        const paginationPages = await driver.findElements(By.xpath("//li[contains(@class, 'pagination__item')]/a"));
        const maxCount = paginationPages.length * 24;
        let currCount = 24;
        let nTriesNoChange = 0;
        while (currCount <= maxCount && nTriesNoChange < 3) {
          await driver.get(`${baseURL}${section.url}?offset=${currCount}`);
          await getInfoPage(section.tag);
          if (prevQty === productArray.length) nTriesNoChange++;
          prevQty = productArray.length;
          console.log(`Finished ${baseURL}${section.url}?offset=${currCount} ---`, productArray.length);
          currCount = currCount + 24;
        }
        exportToFile(section.name);
        await createUpdateProducts(productArray);
      } else {
        console.log("Not found product list on ", section.tag);
      }
    }
  } finally {
    await driver.quit();
  }
}

const exportToFile = (name) => {
  fs.writeFile(`./data/${name}.json`, JSON.stringify(productArray), "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
};

const productListFound = async (item) => {
  return await driver.findElement(By.xpath("//li[contains(@class, 'product-card-list__item')]")).then(
    (found) => true,
    (error) => false
  );
};

const getInfoPage = async (tags) => {
  await driver.executeScript(function () {
    var fps = 300;
    var speedFactor = 0.007;
    var minDelta = 0.5;
    var autoScrollSpeed = 100;
    var autoScrollTimer;
    var isScrolling = false;
    var prevPos = 0;
    currentPos = 0;
    var currentTime, prevTime, timeDiff;
    window.productos = [];
    let nTimesReachedBottom = 0;
    window.addEventListener("scroll", function (e) {
      currentPos = window.scrollY || window.pageYOffset;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        if (nTimesReachedBottom <= 10) {
          this.window.location.href = "#";
          nTimesReachedBottom++;
        } else {
          clearInterval(autoScrollTimer);
          this.window.removeEventListener("scroll", () => {});
        }
      }
    });

    function setAutoScroll(newValue) {
      if (newValue) autoScrollSpeed = speedFactor * newValue;
      if (autoScrollTimer) clearInterval(autoScrollTimer);
      autoScrollTimer = setInterval(function () {
        currentTime = Date.now();
        if (prevTime) {
          if (!isScrolling) {
            timeDiff = currentTime - prevTime;
            currentPos += autoScrollSpeed * timeDiff;
            if (Math.abs(currentPos - prevPos) >= minDelta) {
              isScrolling = true;
              window.scrollTo(0, currentPos);
              isScrolling = false;
              prevPos = currentPos;
              prevTime = currentTime;
            }
          }
        } else prevTime = currentTime;
      }, 1000 / fps);
    }
    setAutoScroll(100);
  });
  await delay(15000);
  const array = await driver.executeScript(function (tags) {
    const productPage = document.querySelectorAll("li.product-card-list__item");
    let products = [];
    for (let index = 0; index < productPage.length; index++) {
      var prodInfo = productPage[index].querySelector("h2.product-card__title > a");
      if (prodInfo) {
        const title = prodInfo.textContent.trim();
        const link = "https://www.carrefour.es" + prodInfo.getAttribute("href");
        const price = productPage[index].querySelector("span.product-card__price");
        const priceOffer = productPage[index].querySelector("span.product-card__price--current");
        const priceUnit = productPage[index].querySelector("span.product-card__price-per-unit");
        const featuresTag = productPage[index].querySelector("ol.product-card__features");
        const imgProd = productPage[index].querySelector("div > a > img").getAttribute("src");
        const finalPrice = price ? price.innerText : null || priceOffer ? priceOffer.innerText : null;
        const unitPrice = priceUnit ? priceUnit.innerText : null;
        let features = [...tags];
        features = featuresTag ? [...features, ...featuresTag.innerText.split("\n")] : features;
        products.push({ title, link, price: finalPrice, currency: "", img: imgProd, unitPrice, features });
      }
    }
    return products;
  }, tags);
  array.map((el) => {
    el["currency"] = getCurrency(el.price);
    el["unitPrice"] = formatPrice(el.unitPrice);
    el["price"] = formatPrice(el.price);
  });
  productArray = [...productArray, ...array];
};
/*     const seen = new Set();
    const filteredArr = window.productos.filter((el) => {
      const duplicate = seen.has(el.link);
      seen.add(el.link);
      return !duplicate;
    }); */
module.exports = { scrappeCarrefour };
