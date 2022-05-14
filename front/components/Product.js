import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardMedia, CardContent, IconButton, Tooltip } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Button, CardActionArea, CardActions, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { countNumProducts, formatDate, getDiffPrices, getImageProduct, getMaxSizeText } from "../utils/shared";
import Avatar from "@mui/material/Avatar";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addNewProduct } from "../features/user/userSlice";
import { setNotification } from "../features/common/common";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import styles from "../styles/Product.module.css";

export default function Product({ product }) {
  const [componentProduct, setComponentProduct] = useState(product);

  const estimate = useSelector((state) => state.user.estimateInfo);

  const dispatch = useDispatch();
  const openNewURL = () => {
    window.open(componentProduct.url, "_blank");
  };
  const checkPriceDiff = () => {
    return getDiffPrices(componentProduct.price, componentProduct.priceHistory[componentProduct.priceHistory.length - 2].price);
  };

  const addProductToBasket = () => {
    let updateProductQty = { ...product, qty: 1 };
    try {
      dispatch(addNewProduct(updateProductQty));
      dispatch(setNotification({ severity: "success", title: `Añadido ${getMaxSizeText(componentProduct.title, 20)} a ${estimate.name}.`, duration: 2000 }));
    } catch (error) {
      dispatch(setNotification({ severity: "error", title: `Error ${error.message}.` }));
    }
  };

  return (
    <Card className={styles.root}>
      <CardActionArea>
        <CardHeader
          action={
            <Tooltip title={`Tienes (${countNumProducts(estimate.items, product._id)}) de este producto en la lista.`}>
              <div className={styles.actions__shop}>
                <ShoppingBasketIcon className={styles.icon} />
                <span className={styles.basket__ball}>{countNumProducts(estimate.items, product._id)}</span>
              </div>
            </Tooltip>
          }
          avatar={<Avatar aria-label="product" className={styles.avatar} src={getImageProduct(componentProduct.img)} />}
          title={getMaxSizeText(componentProduct.title, 95)}
        />
        <CardMedia className={styles.media} image={componentProduct.img} />
        <CardContent className={styles.priceContent}>
          <div style={{ width: "100%" }}>
            <Typography variant="p" component="h3">
              Precio Actual:{" "}
              <span className={styles.price}>
                {componentProduct.price}
                {componentProduct.currency}
              </span>
            </Typography>
          </div>
          <div style={{ width: "100%" }}>
            <Typography variant="p" component="h3">
              Ultimo Precio:{" "}
              {componentProduct.priceHistory.length > 1 ? (
                <span className={styles.price}>
                  {componentProduct.priceHistory[componentProduct.priceHistory.length - 2].price}
                  {componentProduct.currency}
                </span>
              ) : (
                <span className={styles.price}>
                  {componentProduct.price}
                  {componentProduct.currency}
                </span>
              )}
            </Typography>
          </div>
          <div style={{ width: "100%" }}>
            <Typography variant="p" component="h3" style={{ display: "flex", alignItems: "center" }}>
              Variación:{" "}
              {componentProduct.priceHistory.length > 1 ? (
                <span className={checkPriceDiff() > 0 ? styles.price : styles.priceOut} style={{ display: "flex", alignItems: "center" }}>
                  {checkPriceDiff() > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  {checkPriceDiff()}
                  {componentProduct.currency}
                </span>
              ) : (
                <span className={styles.priceEqual} style={{ display: "flex", alignItems: "center" }}>
                  <DragHandleIcon />0{componentProduct.currency}
                </span>
              )}
            </Typography>
          </div>
          <Typography variant="p" component="p">
            Actualizado: <span>{formatDate(componentProduct.updatedAt)}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={styles.buttonContent}>
        <Button variant="contained" color="primary" size="small" startIcon={<TimelineIcon />} onClick={openNewURL}>
          Ver Producto
        </Button>
        <Button variant="contained" color="secondary" size="small" startIcon={<AddCircleOutlineIcon />} onClick={addProductToBasket}>
          Añadir
        </Button>
      </CardActions>
    </Card>
  );
}
