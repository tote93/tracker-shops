import { Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/MyList.module.css";
import { calculatePriceQty, formatDate, getDiffPrices, getMaxSizeText, recalculatePriceTime } from "../utils/shared";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MaterialTableComponent from "../components/MaterialTable";
import DragHandleIcon from "@mui/icons-material/DragHandle";

function MyList() {
  const estimate = useSelector((state) => state.user.estimateInfo);
  const [currentEstimatePrice, setCurrentEstimatePrice] = useState(0);
  const [estimateData, setEstimateData] = useState(null);
  const [userProducts, setuserProducts] = useState([]);
  const getLastUpdatePrice = async () => {
    let itemsIds = [...new Set(estimate.items.map((e) => e._id))];
    const response = await fetch("api/getUserProducts", { method: "POST", body: JSON.stringify(itemsIds) });
    const data = await response.json();
    if (data.data.length) {
      setuserProducts(data.data);
      setCurrentEstimatePrice(calculatePriceQty(data.data, estimate.items));
      const dataArray = [];
      estimate.items.map((prod) => {
        const currPrice = data.data.find((e) => e._id === prod._id).price;
        dataArray.push({
          title: prod.title,
          link: prod.link,
          img: prod.img,
          price: prod.price,
          currPrice,
          difference: getDiffPrices(prod.price, currPrice),
        });
      });
      setEstimateData(dataArray);
    } else setCurrentEstimatePrice(0);
  };
  useEffect(() => {
    const fetchData = async () => {
      await getLastUpdatePrice();
    };
    fetchData();
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.listHeader}>
        <div className={styles.listHeaderData}>
          <div className={styles.listHeaderInfo}>
            <Typography component="h3" variant="p">
              {estimate.name}
            </Typography>
            <Typography component="h3" variant="p">
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
                  Precio Semanal: {recalculatePriceTime(estimate.totalPrice, estimate.type, "week")} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>
                <Typography component="h4" variant="p">
                  Precio Mensual: {recalculatePriceTime(estimate.totalPrice, estimate.type, "month")} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>
                <Typography component="h4" variant="p">
                  Precio Trimestral: {recalculatePriceTime(estimate.totalPrice, estimate.type, "triMonth")} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>
                <Typography component="h4" variant="p">
                  Precio Anual: {recalculatePriceTime(estimate.totalPrice, estimate.type, "year")} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>
              </div>
            </div>
            <div className={styles.listHeaderDateCurrent}>
              <Typography component="h3" variant="p">
                Precio Actual: {formatDate(new Date().toDateString(), "hh:mm DD-MM-YYYY")}
              </Typography>
              <Divider />
              <div>
                <Typography component="h4" variant="p">
                  Precio Semanal: {recalculatePriceTime(currentEstimatePrice, estimate.type, "week").toFixed(2)} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>

                <Typography component="h4" variant="p">
                  Precio Mensual: {recalculatePriceTime(currentEstimatePrice, estimate.type, "month").toFixed(2)} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>

                <Typography component="h4" variant="p">
                  Precio Trimestral: {recalculatePriceTime(currentEstimatePrice, estimate.type, "triMonth").toFixed(2)} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>

                <Typography component="h4" variant="p">
                  Precio Anual: {recalculatePriceTime(currentEstimatePrice, estimate.type, "year").toFixed(2)} <EuroIcon style={{ fontSize: "1rem" }} />
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.listHeaderGraph}>asd</div>
      </div>
      <Divider />
      <div className={styles.listHeader}>
        {estimateData && (
          <MaterialTableComponent
            title={estimate.name}
            columns={[
              {
                title: "Imagen",
                field: "img",
                sorting: false,
                render: (rowData) => <img alt="Product" src={rowData.img} style={{ width: 120, objectFit: "contain" }} />,
              },
              {
                title: "Producto",
                field: "title",
                render: (rowData) => <div className={styles.rowTable}>{getMaxSizeText(rowData.title, 100)}</div>,
              },
              { title: "Precio", field: "price", render: (rowData) => <div className={styles.rowTable}>{rowData.price} €</div> },
              { title: "Precio Actual", field: "price", render: (rowData) => <div className={styles.rowTable}>{rowData.currPrice} €</div> },
              {
                title: "Diferencia",
                field: "difference",
                render: (rowData) => (
                  <div className={styles.rowTable} style={{ color: rowData.difference < 0 ? "green" : rowData.difference > 0 ? "red" : "orange" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      {rowData.difference < 0 ? <ArrowDropUpIcon /> : rowData.difference > 0 ? <ArrowDropDownIcon /> : <DragHandleIcon />} {rowData.difference} €
                    </span>
                  </div>
                ),
              },
            ]}
            data={estimateData}
            style={{ width: "100%" }}
            options={{
              sorting: false,
              maxBodyHeight: "80vh",
            }}
            detailPanel={(rowData) => {
              return (
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/C0DPdy98e4c"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
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
/*  */
