import { Typography } from "@mui/material";
import React from "react";
import ProductList from "../components/ProductList";
function estadisticas({ products }) {
  return (
    <div>
      <div className="container_notification">
        <Typography component="h1" variant="h5">
          Productos con mayor varianza en su precio
        </Typography>
        <Typography component="p">Aqui puedes encontrar un listado de los productos que han sufrido mayor diferencia en sus precios.</Typography>
      </div>
      {products.length && <ProductList dataList={products} count={products.length} />}
    </div>
  );
}

export default estadisticas;
export async function getServerSideProps() {
  let dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
  let { NEXT_PUBLIC_DEV_URL, NEXT_PUBLIC_PROD_URL } = process.env;
  if (dev) {
    let response = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/bestProductList`);
    // extract the data
    let products = await response.json();

    // Pass data to the page via props
    return { props: { products: products.message } };
  } else {
    let response = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/bestProductList`);
    // extract the data
    let products = await response.json();

    // Pass data to the page via props
    return { props: { products: products.message } };
  }
}
