import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import Header from "./Header";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const path = router.pathname;
    const allSelections = document.querySelectorAll(".selected_path");
    allSelections.forEach((el) => el.classList.remove("selected_path"));
    switch (path) {
      case "/misProductos":
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
  }, [router]);
  React.useEffect(() => {
    // Perform localStorage action
    //router.push("/categories");
  }, []);
  return (
    <div className="content">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
