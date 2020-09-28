import './ModalSelectorSingle.less';
import React, {Component} from 'react';
import {Modal, PickerView} from "antd-mobile";
import {I18n} from "../index";

class ModalSelectorSingle extends Component {
  constructor(props) {
    super(props);

    this.currentLabels = [];
    this.state = {
      visible: false,
      value: null,
    }
    this.reset();
  }

  // 初始化
  reset = () => {
    this.state.value = [this.props.value];
  }

  cancel = () => {
    this.reset();
    this.setState({visible: false});
  }

  sure = () => {
    this.setState({visible: false});
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.state.value[0] !== null ? this.state.value[0] : null);
    }
  }


  render() {
    return (
      <div>
        <Modal
          popup
          visible={this.state.visible}
          animationType={this.props.animationType || "slide-up"}
          onClose={() => {
            this.cancel();
          }}
        >
          <div className="components-multi-selector-list">
            <div className="am-picker-popup-header">
              <div className="am-picker-popup-item am-picker-popup-header-left" onClick={() => {
                this.cancel();
              }}>{I18n('CANCEL')}
              </div>
              <div className="am-picker-popup-item am-picker-popup-title">{this.props.title}</div>
              <div className="am-picker-popup-item am-picker-popup-header-right" onClick={() => {
                this.sure();
              }}>{I18n('SURE')}
              </div>
            </div>
            <PickerView
              cols={1}
              data={this.props.data || []}
              value={this.state.value}
              onChange={(val) => {
                this.state.value = val;
              }}
            />
          </div>
        </Modal>
        <div onClick={() => {
          this.setState({visible: true})
        }}>{this.props.children}</div>
      </div>
    );
  }
}

export default ModalSelectorSingle;
