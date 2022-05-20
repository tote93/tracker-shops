const { ObjectId } = require("mongodb");
const { formatDate, compareEqualDates, getDateDiffHours } = require("../utils");
const { categoryModel } = require("./scheemas/categories");
const { ProductModel } = require("./scheemas/products");
const DEFAULT_CATEGORIES = [
  "Supermercado",
  "Bebidas",
  "Bebé",
  "Limpieza",
  "Perfumería",
  "Higiene",
  "Mascotas",
  "Parafarmacia",
  "Jardin",
  "Informática",
  "Electrónica",
  "Electrodomésticos",
  "Salud",
  "Gaming",
  "Hogar",
  "Libros",
  "Papeleria",
  "Deportes",
  "Ocio",
  "Bricolaje",
  "Motor",
  "Juguetes",
  "Oportunidades",
  "Belleza",
];

const createCategories = async (categories = DEFAULT_CATEGORIES) => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };

  for (let index = 0; index < categories.length; index++) {
    const element = categories[index];
    var categoryDetails = new categoryModel({
      name: element,
    });
    categoryModel.findOneAndUpdate({ name: element }, categoryDetails, options, (error, result) => {
      if (error) {
        //console.log("Already existing category:", element);
        return;
      }
    });
  }
};
const getDiffPrices = (p1, p2) => {
  return (p1 - p2).toFixed(2);
};
const createUpdateProducts = async (list) => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };

  for (let index = 0; index < list.length; index++) {
    const product = list[index];
    const currDate = formatDate(new Date());
    const result = await ProductModel.findOne({ link: product.link });
    if (result) {
      if (getDateDiffHours(result.updatedAt, currDate) >= 6) {
        let prodDetails = {
          updatedAt: currDate,
          price: product.price,
          priceDiference: getDiffPrices(result.price, product.price),
          priceHistory: [
            ...result.priceHistory,
            {
              price: product.price,
              dateTime: currDate,
            },
          ],
        };
        ProductModel.findOneAndUpdate({ link: product.link }, prodDetails, options, (error, result) => {
          if (error) {
            console.log("Existing document", prodDetails, error.message);
            return;
          }
        });
      }
    } else {
      let prodDetails = new ProductModel({
        ...product,
        createdAt: currDate,
        updatedAt: currDate,
        priceDiference: 0,
        priceHistory: [
          {
            price: product.price,
            dateTime: currDate,
          },
        ],
      });
      ProductModel.findOneAndUpdate({ link: product.link }, prodDetails, options, (error, result) => {
        if (error) {
          console.log("NO Existing document", prodDetails, error.message);
          return;
        }
      });
    }
  }
  console.log(`Added ${list.length} products to database.`);
};

const updateProductDifference = async () => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  const data = await ProductModel.find();
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const price = getDiffPrices(element.price, element.priceHistory[element.priceHistory.length - 1].price);
    let prodDetails = { priceDiference: price };
    await ProductModel.findOneAndUpdate({ link: element.link }, prodDetails, options);
  }
  console.log("Finished...");
};
const updateProductsNoAttr = async () => {
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  const data = await ProductModel.find({ priceDiference: { $exists: false } });
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const iPrice = element.priceHistory.length > 1 ? element.priceHistory.length - 1 : 0;
    const price = getDiffPrices(element.price, element.priceHistory[iPrice].price);
    let prodDetails = { priceDiference: price };

    ProductModel.findOneAndUpdate({ _id: element._id }, prodDetails, options, (error, result) => {
      if (error) {
        console.log("Existing document", prodDetails, error.message);
        return;
      } else {
        console.log(result);
      }
    });
  }
  console.log("Finished...");
};

module.exports = { createCategories, updateProductDifference, createUpdateProducts, updateProductsNoAttr };
