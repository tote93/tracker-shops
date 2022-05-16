import ProductList from "../components/ProductList";
import styles from "../styles/Home.module.css";
import CATEGORIES from "../data/categories.json";
import PRODUCTS from "../data/productos.json";
import { useDispatch } from "react-redux";
import { setCategories } from "../features/common/common";

export default function Categorias({ categories, products, count }) {
  const dispatch = useDispatch();
  dispatch(setCategories(categories));
  return <div className={styles.container}>{/*  <ProductList dataList={products} count={count} /> */}</div>;
}
export async function getServerSideProps() {
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;
  if (dev) {
    /*     const categories = CATEGORIES;
    const products = PRODUCTS.splice(0, 20);
    // Pass data to the page via props

    return { props: { categories, products, count: products.length } }; */
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
