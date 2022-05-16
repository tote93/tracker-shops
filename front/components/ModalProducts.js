import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ProductList from "./ProductList";
import { makeStyles, createStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Toolbar } from "@mui/material";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: "100%",
      margin: 0,
      maxHeight: 625,
      borderRadius: "5px",
      boxShadow: "0px 2px 20px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "flex-end",
      position: "relative",
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

function ModalProduct({ open, category, setOpen }) {
  const handleClose = () => setOpen(false);
  const [productList, setproductList] = React.useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getDocumentByCategory", { method: "POST", body: category });
      const data = await response.json();
      setproductList(data.data);
    };
    fetchData();
  }, []);

  return (
    <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="product-modal" aria-describedby="add product">
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ProductList dataList={productList} count={productList.length} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
      </DialogActions>
    </Dialog>
  );
}
export default ModalProduct;
