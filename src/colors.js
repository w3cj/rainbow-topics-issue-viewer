export const colorsByName = {
  red: `#F35956`,
  orange: `#f5720f`,
  yellow: `#F1C500`,
  green: `#49BB6C`,
  blue: `#2494C1`,
  pink: `#d9437f`,
  purple: `#9659A7`
};

export const colors = Object.keys(colorsByName);

export function getColor(index) {
  if (index >= colors.length) {
    index = index - colors.length - 1;
  }
  return colorsByName[colors[index]];
}
