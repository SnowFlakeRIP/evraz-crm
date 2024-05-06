function isDate(data) {
  return (Object.prototype.toString.call(data).slice(8, -1) === 'Date');
}

// function isString(data) {
//   return Object.prototype.toString.call(data).slice(8, -1) === 'String';
// }

export function formatDate(date, needTime = false) {
  if (!date) return date;

  if (!isDate(date)) {
    date = new Date(date);
  }

  let dateStr = `${ date.getDate().toString().padStart(2, '0') }.${ (date.getMonth() + 1).toString().padStart(2, '0') }.${ date.getFullYear() }`;

  if (needTime) {
    dateStr += ` ${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }`;
  }

  return dateStr;
}
