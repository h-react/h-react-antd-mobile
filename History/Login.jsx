import './Login.less';
import React, {Component} from 'react';
import {Toast, Result} from "antd-mobile";
import {WechatOutlined} from '@ant-design/icons';
import {Api, I18n, History, LocalStorage, Navigator, Parse} from "h-react-antd-mobile";

class Login extends Component {
  constructor(props) {
    super(props);

    this.search = Parse.urlSearch();
    this.isWechat = Navigator.isDevice('wechat');
    this.state = {
      status: '',
    }
  }

  componentDidMount = () => {
    if (this.isWechat) {
      Api.query().post({SDK_WXMP_OAUTH: this.search.code ? this.search : {}}, (res) => {
        if (res.code === 200) {
          if (res.data.string) {
            window.location = res.data.string; //微信跳转
          } else {
            const logging_id = res.data.logging_id;
            if (logging_id) {
              Toast.success(I18n("LOGIN_SUCCESS"));
              this.setState({status: 'success1'});
              const timer2 = setTimeout(() => {
                this.setState({status: 'success2'});
                LocalStorage.set('h-react-logging-id', 1);
                History.setState({loggingId: logging_id});
                History.efficacy('init');
                window.clearTimeout(timer2);
              }, 1e3);
            } else {
              this.setState({status: 'fail'});
            }
          }
        }
      })
    }
  }

  tips = () => {
    let tips = "WeChat authentication in progress";
    switch (this.state.status) {
      case "fail":
        tips = "WeChat authentication fail";
        break;
      case "success1":
      case "success2":
        tips = "WeChat authentication success";
        break;
    }
    return tips;
  }

  render() {
    return (
      this.isWechat
        ?
        <div className={`h-react-login-wechat ${this.state.status}`}>
          <div id="wx-mark"/>
          <div className="waitingWechat">
            <WechatOutlined/>
            <div className="tips">
              {I18n(this.tips())}
            </div>
          </div>
        </div>
        :
        <div>暂不支持其他客户端</div>
    );
  }
}

export default Login;
