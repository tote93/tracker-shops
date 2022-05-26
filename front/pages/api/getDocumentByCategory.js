// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the posts
    const filtering = req.body !== "all" ? { features: req.body.toLowerCase().normalize("NFD") } : {};
    let posts = await db.collection("market_products").find(filtering).sort({ updatedAt: -1 }).toArray();

    // return the posts
    return res.json({
      data: JSON.parse(JSON.stringify(posts)),
    });
  } catch (error) {
    // return the error
    return res.json({
      data: new Error(error).message,
      success: false,
    });
  }
}
