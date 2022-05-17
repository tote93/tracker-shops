import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardMedia, CardContent } from "@mui/material";

import { Button, CardActionArea, CardActions, Typography } from "@mui/material";

import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import styles from "../styles/Category.module.css";
import ModalProduct from "./ModalProducts";

function Category({ name, img, numProducts, fetch }) {
  const defaultImg =
    "https://images.unsplash.com/photo-1581264669997-3f222f331aaa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80";
  const [openModal, setOpenModal] = useState(false);
  return (
    numProducts > 0 && (
      <>
        <Card className={styles.root}>
          <CardActionArea>
            <CardHeader title={name} />
            <CardMedia className={styles.media} image={img ? img : defaultImg} />
            <CardContent className={styles.content}>
              <div style={{ width: "100%" }}>
                <Typography variant="p" component="h3">
                  Productos: {numProducts}
                </Typography>
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions className={styles.buttonContent}>
            <Button variant="contained" color="primary" size="large" startIcon={<LocalGroceryStoreIcon />} onClick={() => setOpenModal(true)}>
              Ver Productos
            </Button>
          </CardActions>
        </Card>
        {openModal && <ModalProduct category={fetch} open={openModal} setOpen={setOpenModal} />}
      </>
    )
  );
}

export default Category;
