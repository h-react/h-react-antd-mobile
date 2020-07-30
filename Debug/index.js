import {LocalStorage} from "../index";

const debug = {
  set: (key) => {
    switch (key) {
      case 'alert':
      case 'log':
      case 'close':
        LocalStorage.set('debug', key);
        break;
    }
  },
  echo: (data) => {
    const key = LocalStorage.get('debug');
    if (key === 'alert') {
      window.confirm(typeof data === 'object' ? JSON.stringify(data) : data);
    } else if (key === 'log') {
      console.info(data);
    }
  }
};

export default debug;