import Notification from "./Notification"

const NotificationList = ({ notifications, onClose }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key = {notification.id}
          finishedTimerName = {notification.name}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  )
}

export default NotificationList