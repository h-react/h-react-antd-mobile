import './Initial.less';
import React, {Component} from 'react';
import {LocaleProvider} from 'antd-mobile';
import {LeftOutlined, LoadingOutlined} from '@ant-design/icons';
import {Api, Parse, History, Debug, Navigator, LocalStorage} from "h-react-antd-mobile";
import Login from "./Login";

class Initial extends Component {
  constructor(props) {
    super(props);

    this.location = Parse.urlDispatch();

    this.state = {
      preprocessingLength: this._preprocessingLength(props.preprocessing),
      preprocessingStack: 0,
      preprocessingError: [],
      loggingId: LocalStorage.get('h-react-logging-id') || undefined,
      currentUrl: this.location.url,
      subPages: [
        this.location.pathname === '/' ? this.location.url : '/',
      ],
    }

    // debug
    Debug.set(this.location.search.debug);

    // 绑定
    History.link(this);

    // 注册api
    if (props.api) {
      Api.config(props.api.key, props.api.host, props.api.crypto, props.api.append)
    }

    // 预处理数据
    if (props.preprocessing) {
      this.state.preprocessingStack = 1 + this.state.preprocessingLength;
      this._preprocessing(props.preprocessing).then((res) => {
        console.log(res);
        History.setState(res);
        if (this.location.pathname !== '/' && History.state.router[this.location.pathname]) {
          History.state.subPages.push(this.location.url);
        }
        History.setState({
          subPages: History.state.subPages,
          preprocessingStack: (this.state.preprocessingStack - 1)
        });
        this.componentDidMount();
      });
    }
  }

  componentDidMount() {
    if(!Navigator.isDevice('ios')){
      Navigator.banReturn();
    }
    if (this.state.preprocessingStack <= 0) {
      History.efficacy('init');
    }
  }

  _preprocessingLength = (pre, len = 0) => {
    if (!pre || pre.length <= 0) {
      return len;
    }
    for (let p in pre) {
      const t = typeof pre[p];
      if (!pre[p] || t !== 'object') {
        continue;
      }
      if (typeof pre[p].name === 'function' && pre[p].name() === 'Preprocessing') {
        len++;
      } else {
        len = this._preprocessingLength(pre[p], len);
      }
    }
    return len
  }

  _preprocessing = async (pre) => {
    for (let p in pre) {
      const t = typeof pre[p];
      if (!pre[p] || t !== 'object') {
        continue;
      }
      if (typeof pre[p].name === 'function' && pre[p].name() === 'Preprocessing') {
        await pre[p].query()
          .then((r) => {
            pre[p] = r;
            this.state.preprocessingStack -= 1;
          })
          .catch((error) => {
            this.state.preprocessingError.push(error);
            this.setState({
              preprocessingError: this.state.preprocessingError,
            });
          });
      } else {
        await this._preprocessing(pre[p]);
      }
    }
    return pre;
  }

  renderApp = () => {
    if (this.state.preprocessingStack > 0) {
      return (
        <div className="preprocessing">
          <LoadingOutlined style={{fontSize: 50}} spin/>
          {
            this.state.preprocessingError.map((txt, idx) => {
              return <div key={idx} className="error">{txt}</div>
            })
          }
        </div>
      );
    }
    if (this.state.loggingId !== undefined) {
      return (
        <LocaleProvider locale={History.i18nAntd()}>
          <div className="subPages">
            <div className="back" onClick={() => History.pop()}><LeftOutlined/></div>
            <div className="subs">
              {
                this.state.subPages.map((url, idx) => {
                  const location = Parse.urlDispatch(url);
                  const Sub = this.state.router[location.pathname].component;
                  return <div key={idx}><Sub/></div>;
                })
              }
            </div>
          </div>
        </LocaleProvider>
      );
    } else {
      return this.props.Login || <Login/>;
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
