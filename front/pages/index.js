import { Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/MyList.module.css";
import { formatDate, getDiffPrices, getMaxSizeText, recalculateQuantities } from "../utils/shared";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MaterialTableComponent from "../components/MaterialTable";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useDispatch } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import SimpleAreaChart from "../components/SimpleAreaChart";
import BarChartComponent from "../components/BarChartComponent";
import "../lib/pouchDatabase";
import { deleteProduct, removeAllTypeProducts } from "../features/user/userSlice";
import { setNotification } from "../features/common/common";
function MyList() {
  const dispatch = useDispatch();
  const estimate = useSelector((state) => state.user.estimateInfo);
  const [currentEstimatePrice, setCurrentEstimatePrice] = useState(0);
  const [estimateData, setEstimateData] = useState(null);
  const [userProducts, setuserProducts] = useState([]);

  const getLastUpdatePrice = async () => {
    let itemsIds = [...new Set(estimate.items.map((e) => e._id))];
    const response = await fetch("api/getUserProducts", { method: "POST", body: JSON.stringify(itemsIds) });
    const data = await response.json();

    if (data.data.length) {
      //setuserProducts(data.data);
      /*       ´
      const estimatePrice = calculatePriceQty(data.data, estimate.items);
      setCurrentEstimatePrice(+estimatePrice); 
      */

      const dataArray = [];

      estimate.items.map((prod) => {
        const productElement = data.data.find((e) => e._id === prod._id);
        if (productElement) {
          dataArray.push({
            ...productElement,
            estimatePrice: productElement.price,
            difference: getDiffPrices(prod.price, productElement.price),
            qty: prod.qty,
            totalPrice: prod.price,
            frequency: prod.frequency,
          });
        }
      });

      setEstimateData([...dataArray]);

      const weekPriceData = recalculateQuantities(dataArray, "week", "estimatePrice");
      const monthPriceData = recalculateQuantities(dataArray, "month", "estimatePrice");
      const triMonthPriceData = recalculateQuantities(dataArray, "triMonth", "estimatePrice");
      const yearPriceData = recalculateQuantities(dataArray, "year", "estimatePrice");

      /*  estimate data */
      const estweekPriceData = recalculateQuantities(dataArray, "week");
      const estmonthPriceData = recalculateQuantities(dataArray, "month");
      const esttriMonthPriceData = recalculateQuantities(dataArray, "triMonth");
      const estyearPriceData = recalculateQuantities(dataArray, "year");

      setweekPrice(estweekPriceData);
      setmonthPrice(estmonthPriceData);
      settriMonthPrice(esttriMonthPriceData);
      setyearPrice(estyearPriceData);

      setcurrWeekPrice(weekPriceData);
      setcurrMonthPrice(monthPriceData);
      setcurrTriMonthPrice(triMonthPriceData);
      setcurrYearPrice(yearPriceData);
      setBarChartData([
        {
          name: "Semanal",
          "Precio Actual": weekPriceData,
          "Precio mi lista": estweekPriceData,
          unit: "kg",
        },
        {
          name: "Mensual",
          "Precio Actual": monthPriceData,
          "Precio mi lista": estmonthPriceData,
        },
        {
          name: "Trimestral",
          "Precio Actual": triMonthPriceData,
          "Precio mi lista": esttriMonthPriceData,
        },
        {
          name: "Anual",
          "Precio Actual": yearPriceData,
          "Precio mi lista": estyearPriceData,
        },
      ]);
    } else setCurrentEstimatePrice(0);
  };
  const fetchData = async () => {
    await getLastUpdatePrice();
  };

  const getIconPrice = (p1, p2) => {
    const diff = getDiffPrices(p1.price, p2);
    return diff > 0 ? (
      <ArrowDownwardIcon style={{ color: "green", fontSize: "2rem" }} />
    ) : diff < 0 ? (
      <ArrowUpwardIcon style={{ color: "red", fontSize: "2rem" }} />
    ) : (
      <DragHandleIcon style={{ color: "orange", fontSize: "2rem" }} />
    );
  };
  const dataToGraph = (array) => {
    let data = [];
    array.map((prod) => {
      data.push({
        name: formatDate(prod.dateTime, "DD-MM-YYYY"),
        precio: prod.price,
      });
    });
    return data;
  };

  /* Estimate price */
  const [weekPrice, setweekPrice] = useState(0);
  const [monthPrice, setmonthPrice] = useState(0);
  const [triMonthPrice, settriMonthPrice] = useState(0);
  const [yearPrice, setyearPrice] = useState(0);

  /* Current Prices */
  const [currWeekPrice, setcurrWeekPrice] = useState(0);
  const [currMonthPrice, setcurrMonthPrice] = useState(0);
  const [currTriMonthPrice, setcurrTriMonthPrice] = useState(0);
  const [currYearPrice, setcurrYearPrice] = useState(0);

  const [barChartData, setBarChartData] = useState([
    {
      name: "Semanal",
      "Precio Actual": currWeekPrice,
      "Precio mi lista": weekPrice,
    },
    {
      name: "Mensual",
      "Precio Actual": currMonthPrice,
      "Precio mi lista": monthPrice,
    },
    {
      name: "Trimestral",
      "Precio Actual": currTriMonthPrice,
      "Precio mi lista": triMonthPrice,
    },
    {
      name: "Anual",
      "Precio Actual": currYearPrice,
      "Precio mi lista": yearPrice,
    },
  ]);

  /* Build Data Chart */
  useEffect(() => {
    if (estimate.items.length) fetchData();
    else resetData();
  }, [estimate]);
  const resetData = () => {
    setEstimateData(null);
    setCurrentEstimatePrice(0);
    setweekPrice(0);
    setmonthPrice(0);
    settriMonthPrice(0);
    setyearPrice(0);
    setcurrWeekPrice(0);
    setcurrMonthPrice(0);
    setcurrTriMonthPrice(0);
    setcurrYearPrice(0);
    setBarChartData([]);
    setuserProducts([]);
  };

  const getItemFromEstimate = (item) => {
    const found = estimate.items.find((prod) => prod._id === item._id);
    if (found) return found.qty;
    else return 0;
  };
  const getTimeLabel = (freq) => {
    let label = "Semanal";
    switch (freq) {
      case "month":
        label = "Mensual";
        break;
      /*       case "trimonth":
        label = "Trimestral";
        break;
      case "year":
        label = "Anual";
        break; */
      default:
        break;
    }
    return label;
  };
  const deleteProducts = (data, type) => {
    try {
      if (type === "all") dispatch(removeAllTypeProducts({ _id: data._id, frequency: data.frequency }));
      else dispatch(deleteProduct({ _id: data._id, frequency: data.frequency }));
      dispatch(setNotification({ severity: "success", title: `Producto eliminado de la lista.`, duration: 2000 }));
    } catch (error) {
      dispatch(setNotification({ severity: "error", title: `Error ${error.message}.` }));
    }
  };
  return (
    <div className={styles.root}>
      <div className={styles.listHeader}>
        <div style={{ flex: "0.5" }}>
          <div>
            <div className={styles.listHeaderInfo}>
              <Typography component="h3" variant="h5">
                {estimate.name}
              </Typography>
              <Typography component="h3" variant="h5">
                Productos: {estimate.items.length}
              </Typography>
            </div>
            <Divider />
            <div className={styles.listHeaderDates}>
              <div className={styles.listHeaderDateEstimate}>
                <Typography component="h3" variant="p">
                  Precio Creación: {estimate.date}
                </Typography>
                <Divider />
                <div>
                  <Typography component="h4" variant="p">
                    Precio Semanal: {weekPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Mensual: {monthPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Trimestral: {triMonthPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Anual: {yearPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                </div>
              </div>
              <div className={styles.listHeaderDateCurrent}>
                <Typography component="h3" variant="p">
                  Precio Actual: {formatDate(new Date().toDateString(), "DD-MM-YYYY")}
                </Typography>
                <Divider />
                <div>
                  <Typography component="h4" variant="p">
                    Precio Semanal: {currWeekPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Mensual: {currMonthPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Trimestral: {currTriMonthPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                  <Typography component="h4" variant="p">
                    Precio Anual: {currYearPrice} <EuroIcon style={{ fontSize: "1rem" }} />
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.listHeaderGraph}>
          <BarChartComponent chartData={barChartData} firstBar={"Precio Actual"} secondBar={"Precio mi lista"} />
        </div>
      </div>
      <Divider />
      <div className={styles.listHeader}>
        {estimateData && estimate.items && (
          <MaterialTableComponent
            title={estimate.name}
            columns={[
              {
                title: "Imagen",
                field: "img",
                sorting: false,
                render: (rowData) => <img alt="Product" src={rowData.img} style={{ height: 120, width: 120, objectFit: "contain" }} />,
              },
              {
                title: "Producto",
                field: "title",
                render: (rowData) => <div className={styles.rowTable}>{getMaxSizeText(rowData.title, 100)}</div>,
              },
              {
                title: `Cantidad`,
                field: "qty",
                render: (rowData) => <div className={styles.rowTable}>{rowData.qty || 0}</div>,
              },
              {
                title: `Frecuencia`,
                field: "frequency",
                render: (rowData) => <div className={styles.rowTable}>{getTimeLabel(rowData.frequency)}</div>,
              },
              {
                title: "Precio/ud Tienda",
                field: "estimatePrice",
                render: (rowData) => <div className={styles.rowTable}>{rowData.estimatePrice.toFixed(2)} €</div>,
              },
              {
                title: "Precio/ud Lista",
                field: "totalPrice",
                render: (rowData) => <div className={styles.rowTable}>{(getItemFromEstimate(rowData) * rowData.totalPrice).toFixed(2)} €</div>,
              },
              {
                title: "Precio Total Tienda",
                field: "price",
                render: (rowData) => <div className={styles.rowTable}>{(getItemFromEstimate(rowData) * rowData.price).toFixed(2)} €</div>,
              },
              {
                title: "Precio Total Lista",
                field: "price",
                render: (rowData) => <div className={styles.rowTable}>{(getItemFromEstimate(rowData) * rowData.totalPrice).toFixed(2)} €</div>,
              },
              {
                title: "Diferencia",
                field: "difference",
                render: (rowData) => (
                  <div className={styles.rowTable} style={{ color: rowData.difference < 0 ? "red" : rowData.difference > 0 ? "green" : "orange" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {rowData.difference < 0 ? <ArrowDropUpIcon /> : rowData.difference > 0 ? <ArrowDropDownIcon /> : <DragHandleIcon />} {rowData.difference} €
                    </span>
                  </div>
                ),
              },
            ]}
            actions={[
              (rowData) => ({
                icon: () => <DeleteOutlineIcon />,
                tooltip: "Eliminar 1 Unidad",
                onClick: (event, rowData) => deleteProducts(rowData, "single"),
              }),
              (rowData) => ({
                icon: () => <DeleteForeverIcon />,
                tooltip: "Eliminar Todos",
                onClick: (event, rowData) => deleteProducts(rowData, "all"),
              }),
            ]}
            data={estimateData}
            style={{ width: "100%" }}
            options={{
              sorting: true,
              ordering: false,
              maxBodyHeight: "80vh",
              actionsColumnIndex: -1,
            }}
            detailPanel={(rowData) => {
              return rowData.priceHistory.length > 0 ? (
                <div className={styles.tableInfoContainer}>
                  <div className={styles.tableInfoData}>
                    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} component="nav" aria-labelledby="Historico Productos">
                      {rowData.priceHistory.map((prod, i) => {
                        return (
                          <ListItemButton key={rowData._id + i} style={{ fontSize: "2rem" }}>
                            <ListItemIcon>
                              {i === 0 ? <CheckIcon style={{ color: "green", fontSize: "2rem" }} /> : getIconPrice(rowData.priceHistory[i - 1], prod.price)}
                            </ListItemIcon>
                            <ListItemText primary={prod.price + " €"} style={{ margin: "0 10px", width: "80px" }} />
                            <ListItemText primary={formatDate(prod.dateTime, "HH:mm DD-MM-YYYY")} style={{ margin: "0 10px" }} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </div>
                  <div className={styles.tableInfoGraph}>{<SimpleAreaChart hSize={200} chartData={dataToGraph(rowData.priceHistory)} xValue="precio" />}</div>
                </div>
              ) : (
                <h1>Sin Resultados</h1>
              );
            }}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
          />
        )}
      </div>
    </div>
  );
}

export default MyList;
