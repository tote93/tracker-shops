// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the posts
    // let posts = await db.collection("lolamarkets").find({}).sort({ updatedAt: -1 }).limit(30).toArray();
    let allCount = await db.collection("market_products").count();
    // return the posts
    return res.json({
      count: allCount,
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
