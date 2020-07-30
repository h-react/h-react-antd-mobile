import {Debug} from "../index";

const Navigator = {
  /**
   * @param shakes 震动时间(number) | [震动时间(number)，停止时间(number)，震动时间(number)，停止时间(number)]
   */
  vibration: (shakes) => {
    window.navigator.vibrate = window.navigator.vibrate || window.navigator.webkitVibrate || window.navigator.mozVibrate || window.navigator.msVibrate;
    if (window.navigator.vibrate) {
      Debug.echo(shakes);
      window.navigator.vibrate(shakes);
    }
  }
}

export default Navigator;