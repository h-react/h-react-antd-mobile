const debug = {
  status: false,
  openDebug: () => {
    debug.status = true;
  },
  isDebug: () => {
    return debug.status;
  },
  echo: (data) => {
    const s = typeof data === 'object' ? JSON.stringify(data) : data;
    window.confirm(s);
  }
};

export default debug;