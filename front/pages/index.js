import Head from "next/head";
import Header from "../components/Header";
import Product from "../components/Product";
import ProductList from "../components/ProductList";
import styles from "../styles/Home.module.css";

export default function Home({ categories, products }) {
  return (
    <div className={styles.container}>
      <ProductList dataList={products.message} count={products.count} />
    </div>
  );
}
export async function getServerSideProps() {
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;
  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : DEV_URL}/api/categories`);
  // extract the data
  let categories = await response.json();

  let responseProd = await fetch(`${dev ? DEV_URL : DEV_URL}/api/products`);
  // extract the data
  //let products = { message: [] }; //await responseProd.json();
  let products = await responseProd.json();

  // Pass data to the page via props
  return { props: { categories, products } };
}
