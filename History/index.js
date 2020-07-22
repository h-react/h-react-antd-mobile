import {Toast} from "antd-mobile";
import {Parse} from "../index";

const $History = {
  data: {},
  router: {},
  dispatching: false,
  dispatch: null,
  push: null,
  pop: null,
  replace: null,
  efficacy: (action) => {
    setTimeout(() => {
      const back = document.querySelectorAll(".subPages >.back");
      const subs = document.querySelectorAll(".subPages >.subs > div");
      back[0].className = subs.length <= 1 ? 'back' : 'back show';
      switch (action) {
        case 'init':
          if (subs.length === 1) {
            subs[subs.length - 1].className = 'first';
          } else if (subs.length === 2) {
            subs[subs.length - 2].className = 'diving';
            subs[subs.length - 1].className = 'first';
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
    }, 0)
  },
  state: ($this) => {
    $History.dispatch = (status) => {
      if (status === undefined) {
        return $History.dispatching;
      }
      $History.dispatching = status;
      if (status === true) {
        setTimeout(() => {
          $History.dispatching = false;
        }, 600)
      }
    }
    $History.push = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        const location = Parse.urlDispatch(url);
        if ($History.router[location.url]) {
          $this.state.subPages.push({url: location.url, ...$History.router[location.url]});
          $this.setState({
            subPages: $this.state.subPages,
          });
          window.history.pushState(null, null, location.url);
          setTimeout(() => {
            $History.efficacy('push');
          }, 50)
        } else {
          Toast.fail('$History push fail!');
        }
      }
    }
    $History.pop = () => {
      if (!$History.dispatch()) {
        if ($this.state.subPages.length <= 1) {
          history.replaceState(null, null, '/');
          return;
        }
        $History.dispatch(true);
        $History.efficacy('pop');
        history.replaceState(null, null, $this.state.subPages[$this.state.subPages.length - 2].url);
        setTimeout(() => {
          $this.state.subPages.pop();
          $this.setState({
            subPages: $this.state.subPages,
          })
        }, 300)
      }
    }
    $History.replace = (url) => {
      if (!$History.dispatch()) {
        $History.dispatch(true);
        if ($History.router[url]) {
          $this.state.subPages.pop();
          $this.state.subPages.push({url: url, ...$History.router[url]});
          $this.setState({
            subPages: $this.state.subPages,
          });
          setTimeout(() => {
            $History.efficacy('replace');
          }, 0)
        } else {
          Toast.fail('$History replace fail!');
        }
      }
    }
  }
}


export default $History;