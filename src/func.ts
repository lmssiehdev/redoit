export const generateUniqueId = () => (new Date()).getTime();

export const formatDate = (year: number, month: number, day: number) => `${year}-${month}-${day}`;

export const dayOfWeekOffset = (year: number, month: number) => new Date(year, month, 1).getDay();

export const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// export const getDayString = (year: number, month: number, day: number) => info.days[new Date(year, month, day).getDay() + 1];


export const isToday = (date: Date) => {
  const today = new Date();
  return today.getFullYear() == date.getFullYear() &&
    today.getMonth() == date.getMonth() &&
    today.getDate() == date.getDate();
}

export const isWeekend = (day: string) => {
  const dayOfWeek = new Date(day).getDay();
  return dayOfWeek == 6 || dayOfWeek == 0
}
export const isFuture = (date: string) => new Date().getTime() < new Date(date).getTime()

export const formatFirebaseErrorMessage = (msg: string) => {
  const regExp = /\(([^)]+)\)/;
  const matches = regExp.exec(msg)[1]
  const formatedString = matches.split('/')[1].split('-').join(' ')

  return formatedString
}

export function shortenText(text: string, length: number) {
  if (text.length > length) return text.substr(0, length)
  return text
}

export function getHabitStatus(status = 3) {
  const t = {
    1: 'skip',
    2: 'unmark',
    3: 'mark'
  }
  return t[status]
}


export function percentage(partialValue: number, totalValue: number) {
  return ((100 * partialValue) / totalValue).toFixed() + '%';
}
export function dateDiffInDays(firstDate: Date, lastDate: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() - 1);
  const utc2 = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function applyDrag(arr: any[], dragResult) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
}

export function LightenColor(color: string, percent: number) {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;

  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}

export function LightenDarkenColor(color: string, percent: number) {

  let usePound = false;

  if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);

  let r = (num >> 16) + percent;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00FF) + percent;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000FF) + percent;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export function lightOrDark(color: string) {
  let r, g, b, hsp;

  if (color.match(/^rgb/)) {

    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  }
  else {

    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  return hsp > 190 ? 'light' : 'dark'

}

export function convertHex(hexCode: string, opacity = 1) {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}