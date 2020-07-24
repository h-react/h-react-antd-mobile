import './Initial.less';
import React, {Component} from 'react';
import {WechatOutlined, LeftOutlined} from '@ant-design/icons';
import {Api, Auth, I18n, Parse, History} from "h-react-antd-mobile";
import {Toast} from "antd-mobile";

const loggingStatus = {
  demo: -1,
  wechat: 1,
  logging: 10,
};

class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    this.state = {
      loggingStatus: loggingStatus.demo,
      subPages: [
        {url: location.pathname === '/' ? location.url : '/', ...History.router['/']},
      ],
    }

    // 分析路由
    if (location.pathname !== '/' && History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    }

    History.state(this);

    if (Auth.isLogging()) {
      this.state.loggingStatus = loggingStatus.logging;
    }

  }

  componentDidMount = () => {
    const self = this;
    switch (this.state.loggingStatus) {
      case loggingStatus.logging:
        History.efficacy('init');
        window.prevUrl = window.location.href;
        window.onpopstate = function (event) {
          window.history.replaceState(null, null, document.URL);
          History.pop();
        };
        break;
      case loggingStatus.wechat:
        Api.query().post({SDK_WXMP_LOGIN: {}}, (response) => {
          const timer = setInterval(function () {
            Api.query().post({USER_LOGGING: {}}, (response2) => {
              if (response2.code === 200 /*&& response2.data.bool === true*/) {
                window.clearInterval(timer);
                Toast.success(I18n("LOGIN_SUCCESS"));
                document.getElementById('wx-mark').className = "login1";
                setTimeout(() => {
                  document.getElementById('wx-mark').className = "login2";
                  Auth.setLoggingId(1);
                  self.setState({
                    loggingStatus: loggingStatus.logging,
                  });
                  History.efficacy('init');
                }, 1e3)
              }
            })
          }, 3e3)
        })
        break;
      case loggingStatus.demo:
        const timer = setTimeout(function () {
          Toast.success(I18n("LOGIN_SUCCESS"));
          document.getElementById('wx-mark').className = "login1";
          setTimeout(() => {
            document.getElementById('wx-mark').className = "login2";
            Auth.setLoggingId(1);
            self.setState({
              loggingStatus: loggingStatus.logging,
            });
            History.efficacy('init');
          }, 1e3)
        }, 2e3)
        break;
    }
  }

  renderApp = () => {
    let ele = null;
    switch (this.state.loggingStatus) {
      case loggingStatus.logging:
        ele = (
          <div className="subPages">
            <div className="back" onClick={() => History.pop()}><LeftOutlined/></div>
            <div className="subs">
              {
                this.state.subPages.map((item, idx) => {
                  const Sub = item.component;
                  return <div key={idx}><Sub props={this.props}/></div>;
                })
              }
            </div>
          </div>
        );
        break;
      case loggingStatus.demo:
        ele = (
          <div className="waitingWechat">
            <WechatOutlined/>
            <div className="tips">
              {I18n("WeChat authentication in progress")}
            </div>
          </div>
        );
        break;
    }
    return ele;
  }

  render() {
    return (
      <div className="app">
        <div id="wx-mark" className={this.state.loggingStatus === loggingStatus.logging ? 'logging' : ''}/>
        {this.renderApp()}
      </div>
    );
  }
}

export default Initial;
