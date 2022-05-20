import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardMedia, CardContent, Tooltip, ButtonBase } from "@mui/material";
import { Button, CardActionArea, CardActions, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { countNumProducts, formatDate, getDiffPrices, getImageProduct, getMaxSizeText } from "../utils/shared";
import Avatar from "@mui/material/Avatar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addNewProduct, deleteProduct, removeAllTypeProducts } from "../features/user/userSlice";
import { setNotification } from "../features/common/common";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import styles from "../styles/Product.module.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProductModalGraph from "./ProductModalGraph";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
export default function Product({ product }) {
  const [componentProduct, setComponentProduct] = useState(product);
  const estimate = useSelector((state) => state.user.estimateInfo);
  const [numProducts, setNumProducts] = useState(null);
  const [viewProductInfo, setViewProductInfo] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const openNewURL = () => {
    window.open(componentProduct.link, "_blank");
  };

  const addProductToBasket = (targetType) => {
    let updateProductQty = { ...product, qty: 1, frequency: targetType, totalPrice: product.price };
    try {
      dispatch(addNewProduct(updateProductQty));
      dispatch(setNotification({ severity: "success", title: `Añadido ${getMaxSizeText(componentProduct.title, 20)} a ${estimate.name}.`, duration: 2000 }));
    } catch (error) {
      dispatch(setNotification({ severity: "error", title: `Error ${error.message}.` }));
    }
    setAnchorEl(null);
  };
  useEffect(() => {
    setNumProducts(countNumProducts(estimate.items, product._id));
  }, [estimate]);
  const removeProductBasket = () => {
    try {
      dispatch(removeAllTypeProducts({ _id: product._id, frequency: null }));
      dispatch(setNotification({ severity: "success", title: `Producto eliminado de la lista.`, duration: 2000 }));
    } catch (error) {
      dispatch(setNotification({ severity: "error", title: `Error ${error.message}.` }));
    }
  };
  return (
    <>
      <Card className={styles.root}>
        <CardActionArea>
          <CardHeader
            action={
              <div style={{ display: "flex" }}>
                <Tooltip title={`Quitar de mi cesta.`}>
                  <div className={styles.actions__shop} onClick={() => numProducts && removeProductBasket()}>
                    <DeleteOutlineIcon className={styles.icon} style={{ color: numProducts ? "red" : "gray" }} />
                  </div>
                </Tooltip>
                <Tooltip title={`Tienes (${numProducts}) en tu cesta.`}>
                  <div className={styles.actions__shop}>
                    <ShoppingBasketIcon className={styles.icon} />
                    <span className={styles.basket__ball}>{numProducts || 0}</span>
                  </div>
                </Tooltip>
              </div>
            }
            avatar={<Avatar aria-label="product" className={styles.avatar} src={getImageProduct(componentProduct.img)} />}
            title={<Tooltip title={componentProduct.title}><span>{getMaxSizeText(componentProduct.title, 30)}</span></Tooltip>}
          />
          <Tooltip title={`Ver producto en tienda.`}>
            <CardMedia className={styles.media} onClick={openNewURL} image={componentProduct.img} />
          </Tooltip>
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
                Último Precio Registrado:{" "}
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
                  <span className={componentProduct.priceDiference > 0 ? styles.price : styles.priceOut} style={{ display: "flex", alignItems: "center" }}>
                    {componentProduct.priceDiference > 0 ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    {componentProduct.priceDiference < 0 ? -1 * componentProduct.priceDiference : componentProduct.priceDiference}
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
          <Button variant="contained" color="primary" size="small" startIcon={<TimelineIcon />} onClick={() => setViewProductInfo(true)}>
            Ver Producto
          </Button>
          <Button variant="contained" color="secondary" size="small" endIcon={<KeyboardArrowDownIcon />} onClick={(event) => setAnchorEl(event.currentTarget)}>
            Añadir
          </Button>
        </CardActions>
      </Card>
      <Menu id="freq_menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => addProductToBasket("week")}>Producto Semanal</MenuItem>
        <MenuItem onClick={() => addProductToBasket("month")}>Producto Mensual</MenuItem>
        {/*         <MenuItem onClick={() => addProductToBasket("triMonth")}>Producto Trimestral</MenuItem>
        <MenuItem onClick={() => addProductToBasket("year")}>Producto Anual</MenuItem> */}
      </Menu>
      {viewProductInfo && <ProductModalGraph product={product} openStatus={viewProductInfo} setOpen={setViewProductInfo} />}
    </>
  );
}
