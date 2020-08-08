import './LoginWechatDemo.less';
import React, {Component} from 'react';
import {WechatOutlined} from '@ant-design/icons';
import {I18n, History, LocalStorage} from "h-react-antd-mobile";
import {Toast} from "antd-mobile";

class Initial extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount = () => {
    const self = this;
    const timer = setTimeout(function () {
      Toast.success(I18n("LOGIN_SUCCESS"));
      document.getElementById('wx-mark').className = "login1";
      const timer2 = setTimeout(() => {
        document.getElementById('wx-mark').className = "login2";
        LocalStorage.set('h-react-logging-id', 1);
        History.setState({loggingId: 1,});
        History.efficacy('init');
        window.clearTimeout(timer2);
      }, 1e3)
      window.clearTimeout(timer);
    }, 2e3)
  }

  render() {
    return (
      <div className="h-react-login-wechat-demo">
        <div id="wx-mark" className={History.state.loggingId > 0 ? 'logging' : ''}/>
        <div className="waitingWechat">
          <WechatOutlined/>
          <div className="tips">
            {I18n("WeChat authentication in progress")}
          </div>
        </div>
      </div>
    );
  }
}

export default Initial;
