const { Builder, By, Key, until } = require("selenium-webdriver");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const CARREFOUR_SECTIONS = [
  { url: "/supermercado/the-market/cat20002/c", tag: "Supermercado" },
  { url: "/supermercado/la-despensa/cat20001/c", tag: "La Despensa" },
  /*{ url: "/supermercado/drinks/cat20003/c", tag: "Bebidas" },
  { url: "/supermercado/baby/cat20006/c", tag: "Bebé" },
  { url: "/supermercado/cleaning-and-household/cat20005/c", tag: "Limpieza" },
  { url: "/supermercado/perfumery-and-hygiene/cat20004/c", tag: "Perfumería e Higiene" },
  { url: "/supermercado/pets/cat20007/c", tag: "Mascotas" },
  { url: "/supermercado/para-pharmacy/cat20008/c", tag: "Parafarmacia" },
  { url: "/bodega", tag: "Bodega" },
  { url: "/ofertas-en-electronica-textil-y-bazar/cat10017263/c", tag: "Ofertas en Electrónica Textil y Bazar" },
  { url: "/pequenos-productores/cat4510248/c", tag: "Pequeños Productores" },
  { url: "/moda", tag: "Moda" },
  { url: "/bebe", tag: "Universo Bebe" },
  { url: "/jardin", tag: "Jardin" },
  { url: "/informatica", tag: "Informática" },
  { url: "/electronica", tag: "Electrónica" },
  { url: "/electrodomesticos", tag: "Electrodomésticos" },
  { url: "/cuidado-personal-y-salud", tag: "Personal y Salud" },
  { url: "/gaming", tag: "Gaming" },
  { url: "/casa-hogar", tag: "Casa y Hogar" },
  { url: "/libros-discos-video-papeleria-y-regalo/cat8440103/c", tag: "Libros y Papeleria" },
  { url: "/deporte-ocio", tag: "Deportes y Ocio" },
  { url: "/bricolaje-y-automovil", tag: "Bricolaje y Automovil" },
  { url: "/juguetes", tag: "Juguetes" },
  { url: "/mascotas", tag: "Mascotas" },
  { url: "/tienda-de-oportunidades/cat10350029/c", tag: "Oportunidades" },
  { url: "/health-and-beauty/cat15966350/c", tag: "Salud y Belleza" }, */
];
let productArray = [];
let exportItems = {};
let driver = null;
(async function example() {
  const baseURL = "https://www.carrefour.es";
  //driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().addArguments("--headless")).build();
  driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options()).build();
  try {
    for (let index = 0; index < CARREFOUR_SECTIONS.length; index++) {
      const section = CARREFOUR_SECTIONS[index];
      productArray = [];

      await driver.get(baseURL + section.url);
      await delay(2000);
      await driver.findElement(By.xpath('//*[@id="onetrust-accept-btn-handler"]')).click();
      await driver.findElement(By.xpath('//*[@id="app"]/div/nav/div[2]/div/div/span')).click();

      await getInfoPage();
      console.log("Finished", baseURL + section.url, "---", productArray.length);
      await driver.findElement(By.xpath('//*[@id="app"]/div/main/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div/div')).click();
      const paginationPages = await driver.findElements(By.xpath('//*[@id="app"]/div/main/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/div[2]/ul/li/a'));
      const maxCount = paginationPages.length * 24;
      let currCount = 24;
      while (currCount < maxCount) {
        await driver.get(`${baseURL}${section.url}?offset=${currCount}`);
        await getInfoPage();
        console.log(`Finished ${baseURL}${section.url}?offset=${currCount} ---`, productArray.length);
        currCount = currCount + 24;
      }
      console.log("Finished with", productArray.length);
      exportItems[section.tag] = productArray;
    }
  } finally {
    exportToFile("data");
    await driver.quit();
  }
})();

const exportToFile = (name) => {
  fs.writeFile(`./data/${name}.json`, JSON.stringify(productArray), "utf8", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
};

const getInfoPage = async () => {
  const testArr = [];
  await driver.executeScript(function (testArr) {
    let products = [];
    var fps = 300;
    var speedFactor = 0.01;
    var minDelta = 0.5;
    var autoScrollSpeed = 100;
    var autoScrollTimer;
    var isScrolling = false;
    var prevPos = 0;
    currentPos = 0;
    var currentTime, prevTime, timeDiff;
    window.productos = [];
    let initQty = document.querySelectorAll("li.product-card-list__item h2.product-card__title > a").length || 0;
    setInterval(() => {
      console.log(document.querySelectorAll("li.product-card-list__item h2.product-card__title > a").length);
    }, 1000);
    console.log("InitQty", initQty);
    const logo = this.document.querySelector("img.logo-header__img");
    window.addEventListener("scroll", function (e) {
      currentPos = window.scrollY || window.pageYOffset;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        // you're at the bottom of the page
        const currQty = document.querySelectorAll("li.product-card-list__item h2.product-card__title > a").length || 0;
        console.log({ initQty, currQty });
        if (initQty !== currQty || currQty !== 24) {
          this.window.location.href = "#";
          initQty = currQty;
        } else {
          clearInterval(autoScrollTimer);
          const productPage = document.querySelectorAll("li.product-card-list__item");
          for (let index = 0; index < productPage.length; index++) {
            var prodInfo = productPage[index].querySelector("h2.product-card__title > a");
            if (prodInfo) {
              const title = prodInfo.textContent.trim();
              const link = "https://www.carrefour.es" + prodInfo.getAttribute("href");
              const price = productPage[index].querySelector("span.product-card__price");
              const priceOffer = productPage[index].querySelector("span.product-card__price--current");
              const priceUnit = productPage[index].querySelector("span.product-card__price-per-unit");
              const featuresTag = productPage[index].querySelector("ol.product-card__features");
              const imgProd = productPage[index].querySelector("div.product-card__media > a > img").getAttribute("src");
              const finalPrice = price ? price.innerText : null || priceOffer ? priceOffer.innerText : null;
              const unitPrice = priceUnit ? priceUnit.innerText : null;
              const features = featuresTag ? featuresTag.innerText.split("\n") : [];
              products.push({ title, link, price: finalPrice, img: imgProd, unitPrice, features });
            }
          }
          window.productos = products;
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
  }, testArr);
  await delay(20000);
  const array = await driver.executeScript(function () {
    return window.productos;
  });
  productArray = [...productArray, ...array];
};
/*     const seen = new Set();
    const filteredArr = window.productos.filter((el) => {
      const duplicate = seen.has(el.link);
      seen.add(el.link);
      return !duplicate;
    }); */
