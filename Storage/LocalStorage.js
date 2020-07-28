/**
 * LocalStorage
 */
const LocalStorage = {
  /**
   * @param key
   * @param value
   * @param expires 毫秒级
   */
  set(key, value, expires) {
    let params = {key, value, expires};
    if (expires) {
      localStorage.setItem(key, JSON.stringify(Object.assign(params, {startTime: new Date().getTime()})));
    } else {
      if (Object.prototype.toString.call(value) === '[object Object]') {
        value = JSON.stringify(value);
      }
      if (Object.prototype.toString.call(value) === '[object Array]') {
        value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
    }
  },
  get(key, defaultValue) {
    let item = localStorage.getItem(key);
    let data = defaultValue || null;
    try {
      data = JSON.parse(item);
    } catch (error) {
      data = item
    }
    if (data) {
      if (data.startTime) {
        let date = new Date().getTime();
        if (date - data.startTime > data.expires) {
          localStorage.removeItem(name);
          return defaultValue || null;
        } else {
          return data.value;
        }
      }
      return data;
    }
    return defaultValue || null;
  },
  clear: (key) => {
    localStorage.removeItem(key);
  },
  clearAll: () => {
    localStorage.clear();
  },
};

export default LocalStorage;
