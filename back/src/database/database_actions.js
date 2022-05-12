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
        let prodDetails = new ProductModel({
          ...result,
          updatedAt: currDate,
          priceHistory: [
            ...result.priceHistory,
            {
              price: product.price,
              dateTime: currDate,
            },
          ],
        });
        ProductModel.findOneAndUpdate({ link: product.link }, prodDetails, options, (error, result) => {
          if (error) {
            console.log("Existing document", prodDetails);
            return;
          }
        });
      }
    } else {
      let prodDetails = new ProductModel({
        ...product,
        createdAt: currDate,
        updatedAt: currDate,
        priceHistory: [
          {
            price: product.price,
            dateTime: currDate,
          },
        ],
      });
      ProductModel.findOneAndUpdate({ link: product.link }, prodDetails, options, (error, result) => {
        if (error) {
          return;
        }
      });
    }
  }
  console.log(`Added ${list.length} products to database.`);
};

module.exports = { createCategories, createUpdateProducts };
