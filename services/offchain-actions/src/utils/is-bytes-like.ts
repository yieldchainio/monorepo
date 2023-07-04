export const isBytesLike = (param: string): param is `0x${string}` => {
  return param.slice(0, 2) == "0x" && param.slice(2).length % 32 == 0;
};
