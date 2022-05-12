const { createCategories } = require("./database/database_actions");
const { db } = require("./db_connection");
const { scrappeCarrefour } = require("./scrapper");

db.once("open", () => {
  console.log("Database connected");
  initProcess();
});
const initProcess = async () => {
  // Create all categories if not exists
  await createCategories();
  console.log("Finished categories check");
  await scrappeCarrefour();
};
