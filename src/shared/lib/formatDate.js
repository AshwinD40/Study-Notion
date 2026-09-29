export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatedDate = date.toLocaleDateString("en-US", options);

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const formatedTime = `${displayHour}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return `${formatedDate} | ${formatedTime}`;
};

export const formattedDate = formatDate;

export default formatDate;
