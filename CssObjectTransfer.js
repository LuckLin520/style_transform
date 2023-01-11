const camel2Kebab = (str) => {
  const hyphenateRE = /([a-z])([A-Z])/g;
  return str.replace(hyphenateRE, "$1-$2").toLowerCase();
};
const kebab2Camel = (str) => {
  const hyphenateRE = /-(\w)/g;
  return str.replace(hyphenateRE, (_, c) => (c ? c.toUpperCase() : ""));
};
const isNumber = (value) => {
  return Object.prototype.toString.call(value) === "[object Number]";
};
const isObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

class CssObjectTransfer {
  static unit = "px";
  static isPxPropsKey(key) {
    const pxPropsKey = [
      "width",
      "height",
      "font-size",
      "top",
      "left",
      "right",
      "bottom",
    ];
    return pxPropsKey.some((v) => v === camel2Kebab(key));
  }
  static hasPxPropsKeyword(key) {
    const pxPropsKeyword = ["padding", "margin", "radius"];
    return pxPropsKeyword.some((v) => camel2Kebab(key).includes(v));
  }
  static objectFormatCssText = (obj, level) => {
    const cssObjStr = JSON.stringify(obj);
    if (level > 1) return cssObjStr.replace(/(")/g, "");
    return cssObjStr
      .replace(/(")|(\}$)|(^\{)/g, "")
      .replaceAll(":{", "{\n\t")
      .replaceAll(",", ";\n")
      .replaceAll("}", ";\n}")
      .replace("};", "}");
  };
  static object2CssText(obj, level = 1) {
    const resultObj = {};
    for (let key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (
          isNumber(value) &&
          (CssObjectTransfer.isPxPropsKey(key) ||
            CssObjectTransfer.hasPxPropsKeyword(key))
        ) {
          resultObj[camel2Kebab(key)] = value + CssObjectTransfer.unit;
          continue;
        }
        resultObj[camel2Kebab(key)] = isObject(value)
          ? CssObjectTransfer.object2CssText(value, level + 1)
          : value;
      }
    }
    return CssObjectTransfer.objectFormatCssText(resultObj, level);
  }
  static cssText2Object(text, camel = false) {
    let result =
      '{"' +
      text
        .replaceAll("{", '":{"')
        .replaceAll("}", "}")
        .replace(/:(.+);/g, '":"$1","')
        .replace(/\s/g, "")
        .replaceAll('","}', '"}') +
      "}";
    const resultObj = CssObjectTransfer.formatObjectKeyValue(
      JSON.parse(result),
      camel
    );
    return JSON.stringify(resultObj);
  }
  static formatObjectKeyValue(obj, camel) {
    const resultObj = {};
    for (let key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        key = camel && /^[A-Za-z]/.test(key) ? kebab2Camel(key) : camel2Kebab(key);
        if (isObject(value)) {
          resultObj[key] = CssObjectTransfer.formatObjectKeyValue(value, camel);
          continue;
        }
        if (
          /^\d+px/.test(value) &&
          (CssObjectTransfer.isPxPropsKey(key) ||
            CssObjectTransfer.hasPxPropsKeyword(key))
        ) {
          resultObj[key] = Number(value.slice(0, -2));
          continue;
        }
        resultObj[key] = /^\d+$/.test(value) ? Number(value) : value;
      }
    }
    return resultObj;
  }
}
