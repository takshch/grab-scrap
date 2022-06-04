const { assign } = Object;

// pick specific valid keys from object
// and return new object
const pick = (obj, keys) => {
  const newObj = {};

  keys.forEach((key) => {
    const val = obj[key];

    if (val) {
      assign(newObj, { [key]: val });
    }
  });

  return newObj;
};

module.exports = { pick };
