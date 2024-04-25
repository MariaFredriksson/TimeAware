
const CountdownCircle = ({ size, strokeWidth, seconds, totalSeconds }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // How much of the circle is unfilled
  const strokeDashoffset = ((totalSeconds - seconds) / totalSeconds) * circumference

  //^^ Can I make the stroke color into the color of the class color-3?

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        stroke="#17252A"
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        // Rotate the circle to start from the top, and rotate it around its center
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="color-3"
      />
    </svg>
  )
}

export default CountdownCircle