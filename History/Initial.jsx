import './Initial.less';
import React, {Component} from 'react';
import {LeftOutlined} from '@ant-design/icons';
import {Auth, Parse, History, Debug, Navigator} from "h-react-antd-mobile";
import LoginWechatDemo from "./LoginWechatDemo";

class Initial extends Component {
  constructor(props) {
    super(props);

    const location = Parse.urlDispatch();

    Debug.set(location.search.debug);

    this.state = {
      ...props.data,
      logging: Auth.isLogging(),
      subPages: [
        {url: location.pathname === '/' ? location.url : '/', ...History.router['/']},
      ],
    }

    // 分析路由
    if (location.pathname !== '/' && History.router[location.pathname]) {
      this.state.subPages.push({url: location.url, ...History.router[location.pathname]});
    }

    History.link(this);
  }

  componentDidMount = () => {
    if (this.state.logging) {
      History.efficacy('init');
    }
  }

  renderApp = () => {
    if (this.state.logging) {
      return (
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
    } else {
      return this.props.Login || <LoginWechatDemo/>;
    }
  }

  render() {
    return (
      <div className={`app ${Navigator.device()}`}>
        {this.renderApp()}
      </div>
    );
  }
}

export default Initial;
