import './LoginWechatDemo.less';
import React, {Component} from 'react';
import {WechatOutlined} from '@ant-design/icons';
import {Auth, I18n, History} from "h-react-antd-mobile";
import {Toast} from "antd-mobile";

class Initial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logging: Auth.isLogging(),
    }
  }

  componentDidMount = () => {
    const self = this;
    const timer = setTimeout(function () {
      Toast.success(I18n("LOGIN_SUCCESS"));
      document.getElementById('wx-mark').className = "login1";
      const timer2 = setTimeout(() => {
        document.getElementById('wx-mark').className = "login2";
        Auth.setLoggingId(1);
        self.setState({logging: true,});
        History.setState({logging: true,});
        History.efficacy('init');
        window.clearTimeout(timer2);
      }, 1e3)
      window.clearTimeout(timer);
    }, 2e3)
  }

  render() {
    return (
      <div className="h-react-login-wechat-demo">
        <div id="wx-mark" className={this.state.logging ? 'logging' : ''}/>
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
