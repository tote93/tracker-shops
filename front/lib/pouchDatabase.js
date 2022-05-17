import PouchDB from "pouchdb";

export let user_db = new PouchDB("user_db");

export const addToFavorites = (product) => {
  return user_db
    .post(product)
    .then((response) => response)
    .catch((err) => err);
};
export const getFavorites = async () => {
  try {
    const products = await user_db.allDocs({ include_docs: true, attachments: true });
    if (products.total_rows) return products.rows.map((prod) => prod.doc);
    else return [];
  } catch (error) {
    console.log("error get products", error.message);
  }
};
export const removeUserProductDB = async (id) => {
  try {
    var doc = await user_db.get(id);
    var response = await user_db.remove(doc);
    return response;
  } catch (err) {
    console.log(err);
  }
};
