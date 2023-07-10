export const isBytesLike = (param) => {
    return (typeof param == "string" &&
        param.length >= 2 &&
        param.slice(0, 2) == "0x" &&
        param.slice(2).length % 32 == 0);
};
//# sourceMappingURL=is-bytes-like.js.map