/**
 * Function(s) to remove duplicates out of an array
 */

export const filterDupes = <T>(
  arr: T[],
  stringifier: (item: T) => string = (item: T) => {
    return JSON.stringify(item);
  }
): T[] => {
  const newArr: T[] = arr.filter(
    (item, index) =>
      arr.findIndex((_item) => stringifier(_item) === stringifier(item)) ===
      index
  ) as T[];

  return newArr;
};

export const filterDupesShallow = <T>(arr: T[]): T[] => {
  const newArr: T[] = arr.filter(
    (item, index) => arr.findIndex((_item) => item === _item) === index
  ) as T[];

  return newArr;
};
