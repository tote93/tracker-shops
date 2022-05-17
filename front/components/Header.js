import React, { useEffect } from "react";
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
import { Divider, FormHelperText, IconButton, Select, InputLabel, Typography } from "@mui/material";
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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { importEstimate, removeEstimateInfo, setEstimatePriceType, setEstimateName } from "../features/user/userSlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { exportToJsonFile } from "../utils/shared";
import { setNotification } from "../features/common/common";
import { addToFavorites, getFavorites } from "../lib/pouchDatabase";
const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const estimate = useSelector((state) => state.user.estimateInfo);
  const [estimateName, setNameEstimate] = React.useState(estimate.name);
  const [openEstimateDialog, setOpenEstimateDialog] = React.useState(false);
  const handleOpenEstimateDialog = () => setOpenEstimateDialog(true);
  const handleCloseEstimateDialog = () => setOpenEstimateDialog(false);
  /* Handle time frame */
  const [openTimeFrame, setOpenTimeFrame] = React.useState(false);
  const handleOpenTimeFrame = () => setOpenTimeFrame(true);
  const handleCloseTimeFrame = () => setOpenTimeFrame(false);
  const [timeFrame, setTimeFrame] = React.useState(estimate.type || "month");
  React.useEffect(() => {
    setNameEstimate(estimate.name);
  }, [estimate]);

  const handleRedirect = (e, href) => {
    e.preventDefault();
    router.push(href);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [typeSelected, setTypeSelected] = React.useState(null);
  const openControls = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseControls = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    getTypePayment(estimate.type);
  }, []);

  const dispatchEstimateName = () => {
    dispatch(setEstimateName(estimateName));
    handleCloseEstimateDialog();
  };
  const validateTimeFrame = () => {
    if (timeFrame !== estimate.type) {
      dispatch(setEstimatePriceType(timeFrame));
      getTypePayment();
    }
    handleCloseTimeFrame();
  };
  const getTypePayment = (selectTimeFrame = timeFrame) => {
    if (selectTimeFrame === "month") setTypeSelected("Mensual");
    else if (selectTimeFrame === "week") setTypeSelected("Semanal");
    else if (selectTimeFrame === "triMonth") setTypeSelected("Trimestral");
    else if (selectTimeFrame === "year") setTypeSelected("Anual");
  };
  const exportJsonFile = () => {
    exportToJsonFile(estimate);
    setAnchorEl(null);
  };
  const fileInput = React.useRef();
  const handleFileInput = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const jsonFile = JSON.parse(e.target.result);
      if (
        jsonFile.hasOwnProperty("totalPrice") &&
        jsonFile.hasOwnProperty("items") &&
        jsonFile.hasOwnProperty("name") &&
        jsonFile.hasOwnProperty("type") &&
        jsonFile.hasOwnProperty("date")
      ) {
        dispatch(importEstimate(jsonFile));
        dispatch(setNotification({ severity: "success", title: `Archivo importado con exito.`, duration: 2000 }));
      } else {
        dispatch(setNotification({ severity: "error", title: `Archivo corrupto o no valido.`, duration: 2000 }));
      }
    };
    handleCloseControls();
  };

  const deleteAllData = () => {
    dispatch(removeEstimateInfo());
    dispatch(setNotification({ severity: "success", title: `Estimado borrado correctamente.`, duration: 2000 }));
    handleCloseControls();
  };
  const addToFavoritesHandler = async () => {
    await addToFavorites(estimate);
    handleCloseControls();
  };
  return (
    <>
      <header className={styles.navbarHeader}>
        <div className={styles.header__container}>
          <div className={styles.container__logo} style={{ color: "#fff !important", fontWeight: 800 }}>
            <Typography component="h1" variant="h5">
              {estimateName}
            </Typography>
            <IconButton onClick={handleOpenEstimateDialog} style={{ color: "#ffff" }} aria-label="Editar nombre" component="span">
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
                <MenuItem onClick={addToFavoritesHandler}>
                  <FavoriteBorderIcon style={{ margin: "0 10px " }} />
                  Añadir a Favoritos
                </MenuItem>
                <Divider />
                <MenuItem onClick={exportJsonFile}>
                  <IosShareIcon style={{ margin: "0 10px " }} />
                  Exportar
                </MenuItem>
                <MenuItem onClick={() => fileInput.current.click()}>
                  <AddCircleOutlineIcon style={{ margin: "0 10px " }} />
                  Importar
                  <input onChange={handleFileInput} ref={fileInput} accept="application/JSON" type="file" style={{ display: "none" }} />
                </MenuItem>
                <Divider />
                <MenuItem onClick={deleteAllData}>
                  <DeleteOutlineIcon style={{ margin: "0 10px " }} />
                  Borrar Todo
                </MenuItem>
              </Menu>
            </div>
          </div>
          <div className={styles.container__actions}>
            <Typography component="h2" variant="h5" style={{ display: "flex", alignItems: "center" }}>
              Precio {typeSelected}: {estimate?.totalPrice || 0}
              <EuroIcon />
            </Typography>
          </div>
          <div className={styles.container__actions}>
            <IconButton onClick={handleOpenTimeFrame} style={{ color: "#fff" }} aria-label="Editar nombre" component="span">
              <CalendarMonthIcon className={styles.icon} fontSize="small" style={{ margin: "0 10px" }} />
            </IconButton>
          </div>
        </div>
        {/* Bottom Nav */}
        <div className={styles.actionbars}>
          <div style={{ display: "flex", alignItems: "center" }} id="myProducts">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/")}>
              <ShoppingCartIcon className="icon" />
              <p className={styles.item}>Mi Lista</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }} id="categories">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/categorias")}>
              <StoreIcon className="icon" />
              <p className={styles.item}>Categorias</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }} id="favorites">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/favorites")}>
              <FavoriteIcon className="icon" />
              <p className={styles.item}>Mis Favoritos</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }} id="search">
            <div className={styles.link} onClick={(e) => handleRedirect(e, "/search")}>
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
      {/* Dialog Estimate Name */}
      <Dialog open={openEstimateDialog} onClose={handleCloseEstimateDialog}>
        <DialogTitle style={{ width: "300px", display: "flex", justifyContent: "center", background: "#3F72AE", color: "#fff" }}>Edita tu lista de la compra</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={estimateName}
            label="Nombre de la configuración"
            type="text"
            onChange={(e) => setNameEstimate(e.target.value || "")}
            fullWidth
            inputProps={{ maxLength: 40 }}
            variant="standard"
          />
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "space-between", padding: "15px 20px" }}>
          <Button disabled={estimateName.length == 0} variant="contained" color="error" size="small" onClick={handleCloseEstimateDialog}>
            Cancelar
          </Button>
          <Button disabled={estimateName.length == 0} variant="contained" color="info" size="small" onClick={dispatchEstimateName}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog TimeFrame */}
      <Dialog open={openTimeFrame} onClose={handleCloseTimeFrame}>
        <DialogTitle style={{ width: "350px", display: "flex", justifyContent: "center", background: "#3F72AE", color: "#fff", marginBottom: "20px" }}>Rango de Tiempo</DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-helper-label">Selecciona rango de tiempo</InputLabel>
          <Select
            style={{ width: "100%" }}
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={timeFrame}
            label="Rango de tiempo"
            onChange={(evt) => setTimeFrame(evt.target.value)}
          >
            <MenuItem value={"week"}>Semanal</MenuItem>
            <MenuItem value={"month"}>Mensual</MenuItem>
            <MenuItem value={"triMonth"}>Trimestral</MenuItem>
            <MenuItem value={"year"}>Anual</MenuItem>
          </Select>
          <FormHelperText>El precio será recalculado automáticamente.</FormHelperText>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "space-between", padding: "15px 20px" }}>
          <Button disabled={estimateName.length == 0} variant="contained" color="error" size="small" onClick={handleCloseTimeFrame}>
            Cancelar
          </Button>
          <Button disabled={estimateName.length == 0} variant="contained" color="info" size="small" onClick={validateTimeFrame}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
// This gets called on every request

export default Header;
