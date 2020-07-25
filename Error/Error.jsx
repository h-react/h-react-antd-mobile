import React, {Component} from 'react';
import {Result, List} from 'antd-mobile';
import {FrownOutlined, CloseCircleOutlined, ClearOutlined, CoffeeOutlined} from '@ant-design/icons';

import './Error.less';

const Item = List.Item;

export default class Error extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
    this.msg = props.msg || '';
    if (this.msg !== '') {
      console.error(this.msg);
    }
  }

  render() {
    return (
      <div className="h-react-error">
        <Result
          className="sub-title"
          img={<FrownOutlined className="spe"/>}
          title="An error occurred."
          message={
            <div>
              <p className="error-msg">{this.msg}</p>
              <List renderHeader={() => 'There may be the following problems'} className="error-list">
                <Item wrap>
                  <CloseCircleOutlined className="site-result-demo-error-icon"/>
                  &nbsp;&nbsp;Your client has been frozen.
                </Item>
                <Item wrap>
                  <CloseCircleOutlined className="site-result-demo-error-icon"/>
                  &nbsp;&nbsp;Your IP address has been frozen.
                </Item>
                <Item wrap>
                  <ClearOutlined className="site-result-demo-error-icon"/>
                  &nbsp;&nbsp;You can try to clean up the browser cache.
                </Item>
                <Item wrap>
                  <CoffeeOutlined className="site-result-demo-error-icon"/>
                  &nbsp;&nbsp;Server is extremely busy, visit it later.
                </Item>
              </List>
            </div>
          }
        >
        </Result>
      </div>
    );
  }
}
