import './ModalSelectorSingle.less';
import React, {Component} from 'react';
import {List, Modal, Checkbox, TextareaItem, Picker} from "antd-mobile";
import Parse from "../Parse";
import {History, I18n} from "../index";

class ModalSelectorSingle extends Component {
  constructor(props) {
    super(props);

    this.currentLabels = [];
    this.state = {
      visible: false,
      tips: '',
      value: null,
    }
    this.reset();
  }

  // 初始化
  reset = () => {
    this.state.value[opt.value] = false;

    this.props.data.forEach((opt) => {
      this.state.value[opt.value] = false;
      this.currentLabels.push(opt.label);
      if (this.props.value !== undefined && this.props.value.length > 0) {
        if (this.props.value.includes(opt.value) === true) {
          this.state.value[opt.value] = true;
        }
      }
    });
  }

  componentDidMount() {
    this.tips();
  }

  cancel = () => {
    this.reset();
    this.setState({visible: false});
    this.tips();
  }

  sure = () => {
    this.setState({visible: false});
    this.tips();
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(...this.formatter())
    }
  }

  formatter = () => {
    const select = [];
    let other = [];
    const label = [];
    for (let k in this.state.value) {
      if (this.state.value[k] === true) {
        select.push(k);
        label.push(Parse.mapLabel(this.props.data, k));
      }
    }
    if (this.state.otherValue.length > 0) {
      let o = this.state.otherValue.replace("，", ",");
      o = o.trim().split(',');
      o.forEach((val) => {
        if (this.currentLabels.includes(val)) {
          select.push(Parse.mapValue(this.props.data, val));
        } else {
          other.push(val);
        }
        label.push(val);
      })
    }
    return [select, other, label.join('、')];
  }


  tips = () => {
    this.setState({
      value: this.state.value,
      otherValue: this.state.otherValue,
    });
    const tips = [];
    for (let k in this.state.value) {
      if (this.state.value[k] === true) {
        tips.push(Parse.mapLabel(this.props.data, k));
      }
      if (tips.length > 3) break;
    }
    if (tips.length <= 3) {
      if (this.state.otherValue.length > 0) {
        let o = this.state.otherValue.replace("，", ",");
        o = o.trim().split(',');
        for (let k in o) {
          tips.push(o[k]);
          if (tips.length > 3) break;
        }
      }
    }
    this.setState({
      tips: tips.length > 0 ? `(${tips.length})` + tips.join('、') : I18n("PLEASE_CHOOSE"),
    });
  }


  render() {

    const Item = List.Item;
    const CheckboxItem = Checkbox.CheckboxItem;

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
              }}>取消
              </div>
              <div className="am-picker-popup-item am-picker-popup-title">{this.props.title}</div>
              <div className="am-picker-popup-item am-picker-popup-header-right" onClick={() => {
                this.sure();
              }}>{I18n('SURE')}
              </div>
            </div>
            <Picker
              data={this.props.data || []}
              cols={1}
              title={this.props.title}
              value={this.state.value}
              onChange={(val) => {
                this.changed('work', [val[0]]);
              }}>
            </Picker>
          </div>
        </Modal>
        <div onClick={() => {
          this.setState({visible: status})
        }}>{this.props.children}</div>
      </div>
    );
  }
}

export default ModalSelectorSingle;
