import React, { useState } from "react";
import { Card, CardHeader, CardMedia, CardContent } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Button, CardActionArea, CardActions, Grid, Typography, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { formatDate, getDiffPrices, getImageIconProduct, getImageProduct, getMaxSizeText } from "../utils/shared";
import Avatar from "@mui/material/Avatar";
import { Storefront } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import TimelineIcon from "@mui/icons-material/Timeline";
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 325,
      margin: 15,
      maxHeight: 445,
      borderRadius: "5px",
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "flex-end",
      position: "relative",
      padding: "10px 0",
    },
    media: {
      height: "150px",
      backgroundSize: "contain",
    },
    buttonContent: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    avatar: {
      border: "1px solid black",
      borderRadius: "50%",
    },
    priceContent: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      paddingTop: "5px !important",
      paddingBottom: "5px !important",
      justifyContent: "space-between",
    },
    price: {
      fontWeight: 800,
      color: "rgb(84, 150, 84)",
    },
    priceEqual: {
      fontWeight: 800,
      color: "#FF8203",
    },
    priceOut: {
      fontWeight: 800,
      color: "#C90F5D",
    },
    deleteIcon: {
      position: "absolute",
      top: "0px",
      right: "0px",
      zIndex: 1000,
    },
  })
);

export default function Product({ product }) {
  const [componentProduct, setComponentProduct] = useState(product);
  const classes = useStyles();
  const dispatch = useDispatch();
  const openNewURL = () => {
    window.open(componentProduct.url, "_blank");
  };
  const checkPriceDiff = () => {
    return getDiffPrices(componentProduct.price, componentProduct.priceHistory[componentProduct.priceHistory.length - 2].price);
  };
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardHeader
          avatar={<Avatar aria-label="product" className={classes.avatar} src={getImageProduct(componentProduct.img)} />}
          title={getMaxSizeText(componentProduct.title, 95)}
        />
        <CardMedia className={classes.media} image={componentProduct.img} title="Click para ver el producto" />
        <CardContent className={classes.priceContent}>
          <Typography variant="p" component="h3">
            Precio Actual:{" "}
            <span className={classes.price}>
              {componentProduct.price}
              {componentProduct.currency}
            </span>
          </Typography>
          <Typography variant="p" component="h3">
            Ultimo Precio:{" "}
            {componentProduct.priceHistory.length > 1 ? (
              <span className={classes.price}>
                {componentProduct.priceHistory[componentProduct.priceHistory.length - 2].price}
                {componentProduct.currency}
              </span>
            ) : (
              <span className={classes.price}>
                {componentProduct.price}
                {componentProduct.currency}
              </span>
            )}
          </Typography>
          <Typography variant="p" component="h3" style={{ display: "flex", alignItems: "center" }}>
            Variación:{" "}
            {componentProduct.priceHistory.length > 1 ? (
              <span className={checkPriceDiff() > 0 ? classes.price : classes.priceOut} style={{ display: "flex", alignItems: "center" }}>
                {checkPriceDiff() > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                {checkPriceDiff()}
                {componentProduct.currency}
              </span>
            ) : (
              <span className={classes.priceEqual} style={{ display: "flex", alignItems: "center" }}>
                <DragHandleIcon />0{componentProduct.currency}
              </span>
            )}
          </Typography>
          <Typography variant="p" component="p">
            Actualizado: <span>{formatDate(componentProduct.updatedAt)}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.buttonContent}>
        <Button variant="contained" color="secondary" size="small" startIcon={<Storefront />} onClick={openNewURL}>
          Ver Tienda
        </Button>
        <Button variant="contained" color="primary" size="small" startIcon={<TimelineIcon />} onClick={openNewURL}>
          Ver Historico
        </Button>
      </CardActions>
    </Card>
  );
}
