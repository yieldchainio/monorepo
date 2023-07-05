export const isBytesLike = (param: unknown): param is `0x${string}` => {
  return (
    typeof param == "string" &&
    param.length >= 2 &&
    param.slice(0, 2) == "0x" &&
    param.slice(2).length % 32 == 0
  );
};
