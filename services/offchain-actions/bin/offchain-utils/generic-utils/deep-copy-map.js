const deepCopyMap = (map) => {
    let copy = new Map();
    for (const [key, value] of map) {
        copy.set(key, JSON.parse(JSON.stringify(value)));
    }
    return copy;
};
export default deepCopyMap;
//# sourceMappingURL=deep-copy-map.js.map