// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the posts

    let products = await db
      .collection("market_products")
      .find({ price: { $ne: 0 } })
      .sort({ priceDiference: 1 })
      .limit(30)
      .toArray();

    // return the products
    return res.json({
      message: JSON.parse(JSON.stringify(products)),
      success: true,
    });
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
