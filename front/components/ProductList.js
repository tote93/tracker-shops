import React, { useEffect, useState } from "react";
import Product from "./Product";
import Pagination from "@mui/material/Pagination";
import styles from "../styles/FeaturedProducts.module.css";

const PAGINATION_NUMBER = 10;

function ProductList({ dataList, count }) {
  const [paginationCount, setPaginationCount] = useState(PAGINATION_NUMBER);
  const [page, setPage] = React.useState(1);
  const [filteredFeatured, setFilteredFeatured] = useState(dataList || []);
  const handlePaginate = (event, value) => {
    setPage(value);
  };
  const paginate = () => {
    return filteredFeatured.length ? filteredFeatured.slice((page - 1) * PAGINATION_NUMBER, page * PAGINATION_NUMBER) : [];
  };
  useEffect(() => {
    setFilteredFeatured(dataList);
    setPaginationCount(+(count / PAGINATION_NUMBER).toFixed(0));
  }, [dataList]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <>
        <div className={styles.featuredProducts}>{paginate().length > 0 && paginate().map((product, i) => <Product product={product} key={product?._id || i} />)}</div>
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "20px 40px 40px 10px" }}>
          <Pagination count={paginationCount} variant="outlined" page={page} color="primary" defaultPage={1} onChange={handlePaginate} />
        </div>
      </>
    </div>
  );
}

export default ProductList;
