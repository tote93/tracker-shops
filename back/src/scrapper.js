const { Builder, By, Key, until } = require("selenium-webdriver");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const { formatPrice, getCurrency } = require("./utils");
const { createUpdateProducts, createUpdateLolaProducts } = require("./database/database_actions");

const CARREFOUR_SECTIONS = [
  { url: "/supermercado/the-market/cat20002/c", tag: ["Supermercado"], name: "super1" },
  { url: "/supermercado/la-despensa/cat20001/c", tag: ["Supermercado"], name: "super2" },
  { url: "/supermercado/drinks/cat20003/c", tag: ["Bebidas"], name: "bebidas" },

  { url: "/supermercado/cleaning-and-household/cat20005/c", tag: ["Limpieza"], name: "limpieza" },
  { url: "/supermercado/perfumery-and-hygiene/cat20004/c", tag: ["Perfumería", "Higiene"], name: "perf_higiene" },

  { url: "/supermercado/para-pharmacy/cat20008/c", tag: ["Parafarmacia"], name: "paraFarm" },
  { url: "/casa-hogar", tag: ["Hogar"] },
  { url: "/cuidado-personal-y-salud", tag: ["Higiene", "Salud"], name: "salud1" },
  { url: "/health-and-beauty/cat15966350/c", tag: ["Salud", "Belleza"], name: "salud" },
  { url: "/pequenos-productores/cat4510248/c", tag: ["Supermercado"], name: "super3" },

  /* ------- */
  /*  { url: "/supermercado/baby/cat20006/c", tag: ["Infantil"], name: "infantil" }, */
  /* { url: "/ofertas-en-electronica-textil-y-bazar/cat10017263/c", tag: ["Electrónica Textil y Bazar"] }, */
  /*  { url: "/mascotas", tag: ["Mascotas"], name: "pets2" }, */
  /* { url: "/juguetes", tag: ["Juguetes"] }, */
  /*{ url: "/jardin", tag: ["Jardin"] }, */
  /* { url: "/supermercado/pets/cat20007/c", tag: ["Mascotas"], name: "pets1" }, */
];

//https://lolamarket.com/es/es/tienda/lidl/frutas-y-verduras/fruta/
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
      await delay(5000);
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
        await driver.sleep(3000);
        const dataEl = await driver.findElement(By.xpath("//span[contains(@class, 'pagination__results-item')][3]")).then(
          (found) => {
            return driver.findElement(By.xpath("//span[contains(@class, 'pagination__results-item')][3]")).getText();
          },
          (error) => {
            console.log("Error no encontrado div to scroll");
            const element = driver.findElement(By.xpath('//*[@id="app"]/div/footer/div[2]'));
            driver.executeScript("arguments[0].scrollIntoView()", element);
            driver.sleep(300);
          }
        );
        const maxCount = Math.round(+dataEl / 24);
        let currCount = 1;
        let nTriesNoChange = 0;
        while (currCount <= maxCount && nTriesNoChange < 3) {
          await driver.get(`${baseURL}${section.url}?offset=${currCount * 24}`);
          await getInfoPage(section.tag);
          if (prevQty === productArray.length) nTriesNoChange++;
          prevQty = productArray.length;
          console.log(`Finished ${baseURL}${section.url}?offset=${currCount * 24} ---`, productArray.length);
          currCount = currCount + 1;
        }
        //exportToFile(section.name);
        await createUpdateProducts(productArray);
      } else {
        console.log("Not found product list on ", section.tag);
      }
    }
  } finally {
    console.log("Finished scrapping");
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

const getInfoPage = async (tag) => {
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
  const array = await driver.executeScript(function (tag) {
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
        let features = [...tag];
        features = featuresTag ? [...features, ...featuresTag.innerText.split("\n")] : features;
        products.push({ title, link, price: finalPrice, currency: "", img: imgProd, unitPrice, features });
      }
    }
    return products;
  }, tag);
  array.map((el) => {
    el["currency"] = getCurrency(el.price);
    el["unitPrice"] = formatPrice(el.unitPrice);
    el["price"] = formatPrice(el.price);
  });
  productArray = [...productArray, ...array];
};

const getLolaMarketInfo = async (arrayScrapping, addToDB) => {
  let nullproducts = [];
  try {
    //driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().addArguments("--headless").addArguments("--log-level=3")).build();
    driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().addArguments("--log-level=3")).build();
    for (let index = 0; index < arrayScrapping.length; index++) {
      const urlElement = arrayScrapping[index];
      await driver.get(urlElement.link);
      driver.wait(function () {
        return driver.executeScript("return document.readyState").then(function (readyState) {
          return readyState === "complete";
        });
      });

      /*       await driver.findElement(By.xpath('//*[@id="modalPostalCodeInput"]')).then(
        (found) => {
          driver.findElement(By.xpath('//*[@id="modalPostalCodeInput"]')).sendKeys(28018);
          driver.findElement(By.xpath('//*[@id="popoversRoot"]/div/div[2]/footer/button[2]')).click();
        },
        (error) => {}
      ); */
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
              document.body.scrollTop = document.documentElement.scrollTop = 0;
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
      const productList = await driver.findElements(By.xpath('//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li'));
      const len = productList.length;
      let products = [];

      for (let index = 0; index < len; index++) {
        const img = await driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/picture/img`)).getAttribute("src");

        const title = await driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/p[1]`)).getText();

        const price = await driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/div/p`)).getText();

        const addicionalInfo = await driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/div`)).getText();

        const quantity = await driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/p[2]`)).then(
          (found) => {
            return driver.findElement(By.xpath(`//*[@id="__next"]/div[2]/div[2]/div/section[3]/ul/li[${index + 1}]/a/p[2]`)).getText();
          },
          (error) => {
            return "";
          }
        );
        if (title && price && img) {
          products.push({
            img,
            title: title.trim(),
            price: formatPrice(price),
            currency: "€",
            link: urlElement.link,
            features: [...urlElement.tag],
            info: {
              addicionalInfo: addicionalInfo.replace("\n", "*").replace("\n", " ").split("*").join(", "),
              priceDetails: price,
              prod_quantity: quantity,
            },
          });
        }
      }
      if (len === 0) nullproducts.push(urlElement.link);
      if (addToDB) await createUpdateLolaProducts(products);
      console.log(`Acabado ${urlElement.link} con ${products.length}`);
    }
    console.log("Acabada la busqueda de productos");
    await driver.quit();
  } catch (error) {
    console.log("error", error.message);
    await driver.quit();
  }
  nullproducts.map((e) => console.log("Not found", e));
};

module.exports = { scrappeCarrefour, getLolaMarketInfo };
