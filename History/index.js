import {Toast} from "antd-mobile";
import {Parse} from "../index";

const AntdLangs = {
  "en_us": "en_US",
  "ja_jp": "en_US", // "ja_JP",
  "ko_kr": "en_US", // "ko_KR",
  "zh_cn": "zh_CN",
  "zh_hk": "zh_CN", // "zh_HK",
  "zh_tw": "zh_CN", // "zh_TW"
};

const $History = {
  app: null,
  router: {},
  prefix: '',
  dispatching: false,
  dispatch: null,
  push: null,
  pop: null,
  replace: null,
  efficacy: (action) => {
    const back = document.querySelectorAll(".subPages >.back");
    const subs = document.querySelectorAll(".subPages >.subs > div");
    back[0].className = subs.length <= 1 ? 'back' : 'back show';
    switch (action) {
      case 'init':
        if (subs.length > 1) {
          subs[subs.length - 1].className = 'init';
        }
        break;
      case 'push':
        subs[subs.length - 2].className = 'diving';
        subs[subs.length - 1].className = 'face';
        break;
      case 'pop':
        subs[subs.length - 1].className = 'leave';
        subs[subs.length - 2].className = 'face';
        back[0].className = subs.length <= 2 ? 'back' : 'back show';
        break;
      case 'replace':
        subs[subs.length - 1].className = 'face';
        break;
    }
  },
  link: ($this) => {
    $History.app = $this;
    $History.state = $this.state;
    $History.setState = (data) => {
      for (let i in data) {
        $History.state[i] = data[i];
      }
      $History.app.setState($History.state);
    };
    $History.getState = (key, callValue) => {
      return Parse.objGet($History.state, key, '.', callValue);
    }
    $History.dispatch = (status) => {
      if (status === undefined) {
        return $History.dispatching;
      }
      $History.dispatching = status;
      if (status === true) {
        const t = setTimeout(() => {
          window.clearTimeout(t);
          $History.dispatching = false;
        }, 600)
      }
    }
    $History.push = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        const location = Parse.urlDispatch(url);
        if ($History.state.router[location.pathname]) {
          $History.state.subPages.push(url);
          const u = $History.prefix + url
          $History.setState({
            subPages: $History.state.subPages,
            currentUrl: u,
          });
          window.history.replaceState(null, null, u);
          const t = setTimeout(() => {
            window.clearTimeout(t);
            $History.efficacy('push');
          }, 50)
        } else {
          Toast.fail('History push fail!');
        }
      }
    }
    $History.pop = () => {
      if (!$History.dispatch()) {
        if ($History.state.subPages.length <= 1) {
          window.history.replaceState(null, null, $History.prefix + '/');
          return;
        }
        $History.dispatch(true);
        $History.efficacy('pop');
        const u = $History.prefix + $History.state.subPages[$History.state.subPages.length - 2]
        window.history.replaceState(null, null, u);
        const t = setTimeout(() => {
          window.clearTimeout(t);
          $History.state.subPages.pop();
          $History.setState({
            subPages: $History.state.subPages,
            currentUrl: u,
          })
        }, 430)
      }
    }
    $History.replace = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        if ($History.state.router[url]) {
          $History.state.subPages.pop();
          $History.state.subPages.push(url);
          const u = $History.prefix + url
          $History.setState({
            subPages: $History.state.subPages,
            currentUrl: u,
          });
          window.history.replaceState(null, null, u);
          const t = setTimeout(() => {
            window.clearTimeout(t);
            $History.efficacy('replace');
          }, 0)
        } else {
          Toast.fail('History replace fail!');
        }
      }
    }
    // other
    $History.i18nAntd = () => {
      if ($History.state.i18n.lang === 'zh_cn') {
        return null;
      }
      let l = AntdLangs[$History.state.i18n.lang];
      if (l === undefined) {
        l = AntdLangs.en_us
      }
      return require(`antd-mobile/lib/locale-provider/${l}.js`);
    }
  }
}


export default $History;