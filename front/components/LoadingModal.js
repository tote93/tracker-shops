import { CircularProgress, Modal } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const LoadingModal = ({ load = false }) => {
  const loading = useSelector((state) => state.common.loading);
  return (
    <Modal open={loading || load}>
      <div
        style={{
          padding: "16px 32px 24px",
          position: "absolute",
          backgroundColor: "transparent",
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress style={{ width: "100px", height: "100px" }} />
      </div>
    </Modal>
  );
};

export default LoadingModal;
