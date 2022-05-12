import React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "../lib/theme";

import "../styles/app.css";
import { Provider } from "react-redux";
import store from "../app/store";
import Header from "../components/Header";

/*import GlobalNotifications from "../components/GlobalNotifications";
import Layout from "../components/Layout";
import LoadingModal from "../components/LoadingModal"; */
export default function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <React.Fragment>
          <Head>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          </Head>

          <CssBaseline />

          <Component {...pageProps} />
          {/* <LoadingModal /> */}
          {/* <GlobalNotifications /> */}
        </React.Fragment>{" "}
      </Provider>
    </ThemeProvider>
  );
}
