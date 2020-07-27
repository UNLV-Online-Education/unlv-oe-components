import Papa from 'papaparse';

export async function parseCsv(file) {

  function parseDotNotation(str: any, val: any, obj: any) {

    let currentObj = obj,
      keys = str.split("."),
      i, 
      l = Math.max(1, keys.length - 1),
      key;

    for (i = 0; i < l; ++i) {
      key = keys[i];
      currentObj[key] = currentObj[key] || {};
      currentObj = currentObj[key];
    }
 
    currentObj[keys[i]] = val;

    delete obj[str];

  }

  function expand(obj) {

    for (let key in obj) {
      if (key.split('.').length > 1) {
        parseDotNotation(key, obj[key], obj);
      }
    }

    return obj;

  };

  const text = await file.text();

  const parsed = await Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  for (let item of parsed.data) {

    item = await expand(item);

  }

  return parsed.data;

};
