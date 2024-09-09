const days = (checkIn, checkOut) => {
  var zamanFark = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
  var gunFark = Math.ceil(zamanFark / (1000 * 3600 * 24));
  return gunFark;
};

const dateToString = (date) => {
  var dateString =
    date.getFullYear() +
    '-' +
    (date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) +
    '-' +
    (date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate().toString());
  return dateString;
};

const stringToDate = (date) => {
  const dateDate = 'bu henüz fonksiyon yapılmadı';
  return dateDate;
};

export { days, dateToString, stringToDate };
