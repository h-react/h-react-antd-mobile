import './Brick.less';
import React, {Component} from 'react';
import {InboxOutlined} from "@ant-design/icons";
import {I18n} from "../index";


class Brick extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="h-react-brick">
        <div className="icon">
          {this.props.icon || <InboxOutlined/>}
        </div>
        <div className="tips">
          {this.props.tips || ' - Tips - '}
        </div>
      </div>
    );
  }
}

export default Brick;