/**
 * Base class that can be extended by any other, with generic merthods
 */

export class BaseClass {
  // Method to convert the class ,including it's getters - to JSON.
  toJSON() {
    const jsonObj: any = Object.assign({}, this);
    const proto = Object.getPrototypeOf(this);
    for (const key of Object.getOwnPropertyNames(proto)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      const hasGetter = desc && typeof desc.get === "function";
      if (hasGetter) {
        // @ts-ignore
        jsonObj[key] = this[key];
      }
    }
    return jsonObj;
  }

  // Method to turn the object into a stringified version
  toString() {
    try {
      return JSON.stringify(this.toJSON());
    } catch (e) {
      return "";
    }
  }

  // Method to compare an instance of this class with another one
  compare(_instance: BaseClass): boolean {
    return this.toString() == _instance.toString();
  }
}
