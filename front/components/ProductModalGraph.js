import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { formatDate, getDateDifference } from "../utils/shared";
import SimpleAreaChart from "../components/SimpleAreaChart";
import { Typography } from "@mui/material";

function ProductModalGraph({ openStatus, setOpen, product }) {
  const handleClose = () => {
    setOpen(false);
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

  return (
    <Dialog open={openStatus} onClose={handleClose}>
      <DialogTitle style={{ width: "100%", display: "flex", justifyContent: "center", background: "#3F72AE", color: "#fff", marginBottom: "20px" }}>{product.title}</DialogTitle>
      <DialogContent>
        <div className="container_notification">
          <Typography component="h1" variant="h5">
            Evolución del precio en los ultimos {getDateDifference(product)} días
          </Typography>
        </div>
        <SimpleAreaChart hSize={300} chartData={dataToGraph(product.priceHistory)} xValue="precio" />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="info" onClick={handleClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductModalGraph;
