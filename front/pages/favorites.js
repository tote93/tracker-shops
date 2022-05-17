import { Divider, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { getFavorites, removeUserProductDB } from "../lib/pouchDatabase";
import styles from "../styles/Favorites.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch } from "react-redux";
import { importEstimate } from "../features/user/userSlice";
import { setNotification } from "../features/common/common";
function favorites() {
  const [favoritesItem, setFavoritesItem] = useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getAllFavorites = async () => {
      const data = await getFavorites();
      setFavoritesItem(data);
    };
    getAllFavorites();
  }, []);
  const importFavoriteItem = (item) => {
    dispatch(importEstimate(item));
    dispatch(setNotification({ severity: "success", title: `Importado con exito.`, duration: 2000 }));
  };
  const removeFromFavorites = async (item) => {
    const response = await removeUserProductDB(item._id);
    if (response.ok) {
      const items = favoritesItem.filter((el) => el._id !== item._id);
      setFavoritesItem(items);
      dispatch(setNotification({ severity: "success", title: `Eliminado con exito.`, duration: 2000 }));
    }
  };
  return (
    <div className={styles.root}>
      {favoritesItem.map((fav) => {
        return (
          <div className={styles.favContainer}>
            <div className={styles.favTitle}>
              <Typography component="h3" variant="p">
                {fav.name}
              </Typography>
            </div>
            <Divider />
            <div className={styles.favBodyContainer}>
              <div className={styles.favBody}>
                <div>
                  <Typography component="h5" variant="p">
                    Número Productos: {fav.items.length}
                  </Typography>
                </div>
                <div>
                  <Typography component="h5" variant="p">
                    Precio {fav.totalPrice} €
                  </Typography>
                </div>
                <div>
                  <Typography component="h5" variant="p">
                    Fecha: {fav.date}
                  </Typography>
                </div>
              </div>
              <div className={styles.FavActions}>
                <IconButton onClick={() => importFavoriteItem(fav)} style={{ color: "#111" }} aria-label="Importar" component="span">
                  <AddCircleOutlineIcon fontSize="medium" />
                </IconButton>
                <IconButton onClick={() => removeFromFavorites(fav)} style={{ color: "#111" }} aria-label="Borrar" component="span">
                  <DeleteOutlineIcon fontSize="medium" />
                </IconButton>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default favorites;
