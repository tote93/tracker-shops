import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

function GlobalNotifications() {
  const alert = useSelector((state) => state.common.notification);
  useEffect(() => {
    createNotification(alert);
  }, [alert]);
  const createNotification = (alertObj) => {
    switch (alertObj.severity) {
      case "info":
        NotificationManager.info(alertObj.message, alertObj.title || "New notification", alertObj.duration || 2000);
        break;
      case "success":
        NotificationManager.success(alertObj.message, alertObj.title || "New Notification", alertObj.duration || 2000);
        break;
      case "warning":
        NotificationManager.warning(alertObj.message, alertObj.title || "New notification", alertObj.duration || 2000);
        break;
      case "error":
        NotificationManager.error(alertObj.message, alertObj.title || "New notification", alertObj.duration || 2000);
        break;
      default:
        break;
    }
  };
  return <NotificationContainer />;
}

export default GlobalNotifications;
