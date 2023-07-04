export const isBytesLike = (param) => {
    return param.slice(0, 2) == "0x" && param.slice(2).length % 32 == 0;
};
//# sourceMappingURL=is-bytes-like.js.map