import React from "react";
import Product from "./Product";

function ProductList({ dataList }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {dataList.slice(0, 10).map((prod) => {
        return <Product key={prod._id} product={prod} />;
      })}
    </div>
  );
}

export default ProductList;
