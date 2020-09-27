import './Refresh.less';
import React, {Component} from 'react';
import {Toast} from "antd-mobile";
import nanoid from "nanoid";
import {Brick, I18n} from "../index";
import {LoadingOutlined, FullscreenOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";


class List extends Component {
  constructor(props) {
    super(props);

    this.id = nanoid(20);
    this.distanceToRefresh = this.props.distanceToRefresh || window.devicePixelRatio * 28;
    this.scrollTop = 0;
    this.y = 0;
    this.mode = this.props.mode || 'tiny';
    this.state = {
      offsetY: 0,
      canDo: false,
    }

  }

  onRefresh = () => {
    if (typeof this.props.onRefresh === 'function') {
      this.props.onRefresh();
    } else {
      Toast.info('unset onRefresh');
    }
  }

  onTouchStart = (evt) => {
    if (this.props.refreshing === false) {
      this.scrollTop = document.getElementById(this.id).scrollTop;
      this.y = evt.touches[0].clientY;
    }
  }

  onTouchMove = (evt) => {
    if (this.props.refreshing === false) {
      const scrollTop = document.getElementById(this.id).scrollTop;
      const y = evt.touches[0].clientY;
      const offset = y - this.y - this.scrollTop - scrollTop;
      if (offset > 0) {
        this.state.canDo = this.state.offsetY > this.distanceToRefresh;
        this.setState({
          offsetY: Math.abs(offset / 2),
          canDo: this.state.canDo,
        });
      }
    }
  }

  onTouchEnd = () => {
    if (this.state.canDo) {
      this.onRefresh();
    }
    const _t2 = setInterval(() => {
      if (this.props.refreshing === false) {
        if (this.state.offsetY > 0) {
          this.state.offsetY -= window.screen.availHeight * 0.005;
        }
        if (this.state.offsetY <= 0) {
          this.state.offsetY = 0;
          window.clearInterval(_t2);
        }
        this.setState({
          offsetY: this.state.offsetY,
        });
      }
    }, 0);
  }

  renderIndicator = () => {
    if (!this.props.refreshing) {
      if (this.state.canDo) {
        return <span><FullscreenOutlined/> {I18n('Release to refresh')}</span>;
      }
      return <span><VerticalAlignBottomOutlined/>{I18n('Pull down to refresh')}</span>;
    } else {
      if (this.mode === 'tiny') {
        return <span><LoadingOutlined/> {I18n('loading')}</span>;
      }
    }
    return null;
  }

  renderList = () => {
    if (this.props.refreshing && this.mode !== 'tiny') {
      return <Brick icon={<LoadingOutlined/>} tips={I18n('loading')}/>;
    }
    if (this.props.empty) {
      const tips = this.props.emptyTips || I18n('no data');
      return <Brick icon={this.props.icon} tips={tips}/>;
    }
    return this.props.children || null;
  }

  render() {
    const maxHeight = this.props.maxHeight || 70;
    let opacity = this.state.offsetY / (maxHeight * 0.75);
    if (opacity > 1) opacity = 1.0;
    return (
      <div
        id={this.id}
        className="h-react-refresh"
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        <div className="indicator" style={{
          height: Math.min(maxHeight, this.state.offsetY) + 'px',
          lineHeight: Math.min(maxHeight, this.state.offsetY) + 'px',
          opacity: opacity.toFixed(1),
        }}>
          {this.renderIndicator()}
        </div>
        {this.renderList()}
      </div>
    );
  }
}

export default List;