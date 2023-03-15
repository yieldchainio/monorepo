const deepCopyMap = <T, U>(map: Map<T, U>): Map<T, U> => {
  let copy = new Map<T, U>();
  for (const [key, value] of map) {
    copy.set(key, JSON.parse(JSON.stringify(value)));
  }
  return copy;
};

export default deepCopyMap;
