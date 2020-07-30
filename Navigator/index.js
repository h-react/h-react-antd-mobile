const Navigator = {
  /**
   * @param shakes [震动时间，停止时间，震动时间，停止时间]
   */
  vibration: (shakes) => {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
      navigator.vibrate(shakes);
    }
  }
}

export default Navigator;