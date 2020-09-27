import './Refresh.less';
import React, {Component} from 'react';
import {PullToRefresh, Toast} from "antd-mobile";
import {Brick, I18n} from "../index";
import {LoadingOutlined} from "@ant-design/icons";


class List extends Component {
  constructor(props) {
    super(props);
  }

  onRefresh = () => {
    if (typeof this.props.onRefresh === 'function') {
      this.props.onRefresh();
    } else {
      Toast.info('unset onRefresh');
    }
  }

  renderList = () => {
    if (this.props.refreshing) {
      return <Brick icon={<LoadingOutlined/>} tips={I18n('loading')}/>;
    }
    if (this.props.empty) {
      const tips = this.props.tips || I18n('no data');
      return <Brick icon={this.props.icon} tips={tips}/>;
    }
    return this.props.children || null;
  }

  render() {
    return (
      <PullToRefresh
        indicator={{
          release: <span>&nbsp;</span>,
          finish: <span>&nbsp;</span>
        }}
        className="h-react-refresh"
        damping={this.props.damping || 100}
        direction='down'
        refreshing={this.props.refreshing}
        onRefresh={this.onRefresh}
      >
        {this.renderList()}
      </PullToRefresh>
    );
  }
}

export default List;