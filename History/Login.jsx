import './Login-wechat.less';
import './Login-normal.less';
import React, {Component} from 'react';
import {Toast} from "antd-mobile";
import {WechatOutlined} from '@ant-design/icons';
import {Api, I18n, History, LocalStorage, Parse, Navigator} from "h-react-antd-mobile";
import Form from "../Form";
import FormInput from "../Form/FormInput";

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
        if (res.error === 0) {
          if (res.data.string) {
            window.location.replace(res.data.string) //微信跳转
          } else {
            const logging_id = res.data.logging_id;
            if (logging_id) {
              Toast.success(I18n("LOGIN_SUCCESS"));
              this.setState({status: 'success1'});
              const timer2 = setTimeout(() => {
                this.setState({status: 'success2'});
                LocalStorage.set('h-react-logging-id', logging_id);
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
        <div className={`h-react-login-normal ${this.state.status}`}>
          <div className="title">{I18n('login')}</div>
          <Form
            rules={{
              required: ['account', 'password']
            }}
            onFinish={(values, form) => {
              values.license_id = 3;
              Api.query().post({USER_LOGIN: values}, (response) => {
                form.complete();
                Api.handle(response, () => {
                  LocalStorage.set('h-react-logging-id', response.data.user_id);
                  History.setState({loggingId: response.data.user_id});
                  History.efficacy('init');
                });
              });
            }}
          >
            <FormInput name="account" label={I18n('account')} type="phone"/>
            <FormInput name="password" label={I18n('password')} type="password"/>
          </Form>
        </div>
    );
  }
}

export default Login;
