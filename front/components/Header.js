import React from "react";
import styles from "../styles/Header.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StoreIcon from "@mui/icons-material/Store";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Divider, IconButton, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EuroIcon from "@mui/icons-material/Euro";
const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const estimate = useSelector((state) => state.common.estimateInfo);
  console.log(estimate, "--");
  const handleRedirect = (e, href) => {
    e.preventDefault();
    router.push(href);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openControls = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseControls = () => {
    setAnchorEl(null);
  };

  const [estimateName, setEstimateName] = React.useState("Mi lista");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <header className={styles.navbarHeader}>
        <div className={styles.header__container}>
          <div className={styles.container__logo} style={{ color: "#fff !important", fontWeight: 800 }}>
            <Typography component="h1" variant="h5">
              {estimateName}
            </Typography>
            <IconButton onClick={handleOpen} style={{ color: "#fff" }} aria-label="Editar nombre" component="span">
              <EditIcon className={styles.icon} fontSize="small" style={{ margin: "0 10px" }} />
            </IconButton>
            <div className={styles.actions__shop}>
              <SettingsIcon fontSize="small" className={styles.icon} onClick={handleClick} />
              <Menu
                id="Menu acción"
                aria-labelledby="Menu de acciones"
                anchorEl={anchorEl}
                open={openControls}
                onClose={handleCloseControls}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleCloseControls}>
                  <FavoriteBorderIcon style={{ margin: "0 10px " }} />
                  Añadir a Favoritos
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseControls}>
                  <IosShareIcon style={{ margin: "0 10px " }} />
                  Exportar
                </MenuItem>
                <MenuItem styleClick={handleCloseControls}>
                  <AddCircleOutlineIcon style={{ margin: "0 10px " }} />
                  Importar
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseControls}>
                  <DeleteOutlineIcon style={{ margin: "0 10px " }} />
                  Borrar Todo
                </MenuItem>
              </Menu>
            </div>
          </div>
          <div className={styles.container__actions}>
            {estimate.totalPrice || 0}
            <EuroIcon />
          </div>
        </div>
        {/* Bottom Nav */}
        <div className={styles.actionbars}>
          <div style={{ display: "flex", alignItems: "center" }} id="addProduct">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/addProduct")}>
              <StoreIcon className="icon" />
              <p className={styles.item}>Categorias</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }} id="addProduct">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/addProduct")}>
              <FavoriteIcon className="icon" />
              <p className={styles.item}>Mis Favoritos</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }} id="addProduct">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/addProduct")}>
              <SearchIcon className="icon" />
              <p className={styles.item}>Buscar</p>
            </div>
          </div>
          {/*           <div style={{ display: "flex", alignItems: "center" }} id="addProduct">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/addProduct")}>
              <TimelineIcon className="icon" />
              <p className={styles.item}>Estadisticas</p>
            </div>
          </div> */}
        </div>
      </header>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ width: "300px", display: "flex", justifyContent: "center", background: "#3F72AE", color: "#fff" }}>Edita tu lista de la compra</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={estimateName}
            label="Nombre de la configuración"
            type="text"
            onChange={(e) => setEstimateName(e.target.value || "")}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "space-between", padding: "15px 20px" }}>
          <Button disabled={estimateName.length == 0} variant="contained" color="error" size="small" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={estimateName.length == 0} variant="contained" color="info" size="small" onClick={handleClose}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
// This gets called on every request

export default Header;
