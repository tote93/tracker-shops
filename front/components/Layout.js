import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { setCategories, setCategoryProducts, setModalStatus, setTotalProducts } from "../features/common/common";
import Header from "./Header";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.common.categories);

  React.useEffect(() => {
    const path = router.pathname;
    const allSelections = document.querySelectorAll(".selected_path");
    allSelections.forEach((el) => el.classList.remove("selected_path"));
    switch (path) {
      case "/":
        if (document.querySelector("#myProducts")) document.querySelector("#myProducts").classList.add("selected_path");
        break;
      case "/addProduct":
        if (document.querySelector("#addProduct")) document.querySelector("#addProduct").classList.add("selected_path");
        break;
      case "/search":
        if (document.querySelector("#search")) document.querySelector("#search").classList.add("selected_path");
        break;
      case "/favorites":
        if (document.querySelector("#favorites")) document.querySelector("#favorites").classList.add("selected_path");
        break;
      default:
        if (document.querySelector("#categories")) document.querySelector("#categories").classList.add("selected_path");
        break;
    }
    dispatch(setModalStatus(true));
    const checkDataFetch = async () => {
      if (categories.length == 0) {
        const { categories, count, categoryProducts } = await fetchDataServer();
        dispatch(setCategories(categories));
        dispatch(setTotalProducts(count));
        dispatch(setCategoryProducts(categoryProducts));
      }
      dispatch(setModalStatus(false));
    };
    checkDataFetch();
  }, [router]);
  const fetchDataServer = async () => {
    let dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";

    let { NEXT_PUBLIC_DEV_URL, NEXT_PUBLIC_PROD_URL } = process.env;
    if (dev) {
      let response = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/categories`);
      // extract the data
      let categories = await response.json();

      let categoryCountObj = {};
      for (let index = 0; index < categories.message.length; index++) {
        const element = categories.message[index];
        let responseCat = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/getDocumentByCategory`, {
          method: "POST",
          body: element.name,
        });

        let category = await responseCat.json();
        categoryCountObj[element.name] = category.data.length;
      }
      let responseProd = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/products`);
      //let products = { message: [] }; //await responseProd.json();
      let products = await responseProd.json();
      // Pass data to the page via props
      return { categories: categories.message, count: products.count, categoryProducts: categoryCountObj };
    } else {
      let response = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/categories`);
      // extract the data
      let categories = await response.json();

      let responseProd = await fetch(`${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_DEV_URL}/api/products`);
      //let products = { message: [] }; //await responseProd.json();
      let products = await responseProd.json();
      // Pass data to the page via props
      return { categories: categories.message, products: products.message, count: products.count };
    }
  };

  return (
    <div className="content">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
