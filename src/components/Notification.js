
const Notification = ({ finishedTimerName, onClose }) => {
  return (
    <div className="notification-bar border rounded-4 p-3 mx-2 mt-4">
      <p className="color-3-text fw-bold mx-4 my-3">
        {`Timer "${finishedTimerName}" is done!`}
      </p>
      <button onClick={onClose} className="color-2 btn my-2">
        Stop Timer
      </button>
    </div>
  );
}

export default Notification