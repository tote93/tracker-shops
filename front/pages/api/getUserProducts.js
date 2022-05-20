// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToDatabase, ObjectId } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // connect to the database
      let { db } = await connectToDatabase();
      // fetch the posts
      const formatIds = JSON.parse(req.body).map((e) => new ObjectId(e));
      let products = await db
        .collection("products")
        .find({ _id: { $in: [...formatIds] } })
        .toArray();
      return res.json({
        data: products,
        success: true,
      });
    } else {
      return res.status(200).json({ name: "John Doe" });
    }
  } catch (error) {
    // return the error
    return res.json({
      data: new Error(error).message,
      success: false,
    });
  }
}
