import React from "react";
import { useSelector } from "react-redux";
import Category from "../components/Category";

import styles from "../styles/Category.module.css";

import { useDispatch } from "react-redux";
import { setCategories } from "../features/common/common";

export default function Categorias(/* { categories, products, count } */) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.common.categories);
  const categoryObj = useSelector((state) => state.common.categoryProducts);
  const totalProducts = useSelector((state) => state.common.countProducts);
  // dispatch(setCategories(categories));
  const categoryHasProducts = (categoryname) => {
    if (categoryObj.hasOwnProperty(categoryname)) {
      if (categoryObj[categoryname] > 0) return categoryObj[categoryname];
      else return 0;
    }
    return 0;
  };
  return (
    <div className={styles.container}>
      {categories.map((cat) => {
        return <Category key={cat.name} name={cat.name} img={cat.img} numProducts={categoryHasProducts(cat.name)}></Category>;
      })}
      {/*  <Category key={"allproducts"} name={"Todos"} numProducts={totalProducts}></Category>; */}
    </div>
  );
}
/*
export async function getServerSideProps() {
     let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;
  if (dev) {
    const categories = CATEGORIES;
    const products = PRODUCTS.splice(0, 20);
    // Pass data to the page via props

    return { props: { categories, products, count: products.length } };
  } else {
    let response = await fetch(`${dev ? DEV_URL : DEV_URL}/api/categories`);
    // extract the data
    let categories = await response.json();

    let responseProd = await fetch(`${dev ? DEV_URL : DEV_URL}/api/products`);
    // extract the data
    dispatch(setCategories(categories.message));
    //let products = { message: [] }; //await responseProd.json();
    let products = await responseProd.json();
    // Pass data to the page via props
    return { props: { categories: categories.message, products: products.message, count: products.count } };
  } 
  // request posts from api

}
*/
