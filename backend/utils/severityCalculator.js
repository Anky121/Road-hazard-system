function calculateSeverity(reports, vehicles) {
  if (vehicles === 0) return { percentage: 0, level: "MINOR" };

  const percentage = (reports / vehicles) * 100;

  let level = "MINOR";

  if (percentage >= 80) level = "SEVERE";
  else if (percentage >= 31) level = "MODERATE";

  return {
    percentage: Number(percentage.toFixed(2)),
    level
  };
}

module.exports = calculateSeverity;
