/**
 * A safe stringify function that is able to stringify circular classes
 */

export const safeToJSON = <T>(obj: T) => {
  return circularReplacer(obj, 1);
};

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};
/**
 * The replaces function for the json
 */
const circularReplacer = (
  obj: any,
  maxDepth: number,
  depth: number = 0
): any => {
  // If its an array, run this on each item
  if (Array.isArray(obj))
    return obj.map((_obj) => circularReplacer(_obj, maxDepth, depth));

  // If its a reguler proprety we just return it
  if (typeof obj !== "object") return obj;

  // If its null just return
  if (obj === null) return obj;

  // If it's an object and we're beyond our max depth, return either ID if exists or an empty string
  if (maxDepth <= depth) {
    try {
      return obj["id"] || "";
    } catch (e: any) {
      return "";
    }
  }

  // If its an object

  // Else recruse the call for each field
  const jsonObj: Record<any, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    jsonObj[key] = circularReplacer(value, maxDepth, depth + 1);
  }
  const proto = Object.getPrototypeOf(obj);
  for (const key of Object.getOwnPropertyNames(proto)) {
    try {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const hasGetter = desc && typeof desc.get === "function";
      if (hasGetter) {
        // @ts-ignore
        jsonObj[key] = obj[key];
      }
    } catch (e: any) {
      throw "Caught Erorr In Getter. Key: " + key + " Obj Provided: " + obj;
    }
  }

  return jsonObj;
};
