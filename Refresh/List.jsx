import './Refresh.less';
import React, {Component} from 'react';
import {Toast} from "antd-mobile";
import nanoid from "nanoid";
import {Brick, I18n} from "../index";
import {LoadingOutlined, FullscreenOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";


class List extends Component {
  constructor(props) {
    super(props);

    this.id = 'i' + nanoid(20);
    this.distanceToRefresh = this.props.distanceToRefresh || window.devicePixelRatio * 20;
    this.maxHeight = this.props.maxHeight || (this.distanceToRefresh * 1.2);
    this.scrollTop = 0;
    this.y = 0;
    this.mode = this.props.mode || 'tiny';
    this.state = {
      offsetY: 0,
    }
  }

  canDo = () => {
    return this.state.offsetY > this.distanceToRefresh;
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
      const ele = document.getElementById(this.id);
      const scrollTop = ele.scrollTop;
      const y = evt.touches[0].clientY;
      const offset = y - this.y - this.scrollTop - scrollTop;
      if (offset > 0) {
        evt.preventDefault();
        this.state.offsetY = Math.abs(offset / 2);
        this.setState({
          offsetY: this.state.offsetY,
        });
      }
    }
  }

  onTouchEnd = () => {
    if (this.canDo()) {
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
      if (this.canDo()) {
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

  componentDidMount() {
    const ele = document.getElementById(this.id);
    ele.addEventListener('touchstart', this.onTouchStart, {passive: false});
    ele.addEventListener('touchmove', this.onTouchMove, {passive: false});
    ele.addEventListener('touchend', this.onTouchEnd, {passive: false});
  }

  render() {
    let opacity = this.state.offsetY / (this.distanceToRefresh * 0.8);
    if (opacity > 1) opacity = 1.0;
    return (
      <div id={this.id} className="h-react-refresh">
        <div className="indicator" style={{
          height: Math.min(this.maxHeight, this.state.offsetY) + 'px',
          lineHeight: Math.min(this.maxHeight, this.state.offsetY) + 'px',
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