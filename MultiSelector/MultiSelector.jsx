import './MultiSelector.less';
import React, {Component} from 'react';
import {List, Modal, Checkbox, TextareaItem} from "antd-mobile";
import Parse from "../Parse";
import {I18n} from "../index";

class MultiSelector extends Component {
  constructor(props) {
    super(props);

    this.currentLabels = [];
    this.state = {
      visible: false,
      tips: '',
      value: {},
      otherValue: '',
    }
    this.reset();
  }

  // 初始化
  reset = () => {
    this.props.data.forEach((opt) => {
      this.state.value[opt.value] = false;
      this.currentLabels.push(opt.label);
      if (this.props.value !== undefined && this.props.value.length > 0) {
        if (this.props.value.includes(opt.value) === true) {
          this.state.value[opt.value] = true;
        }
      }
    });
    if (this.props.otherValue !== undefined) {
      this.state.otherValue = this.props.otherValue.join(',');
    }
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
      if (!isNaN(k)) k = parseInt(k, 10);
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
      if (!isNaN(k)) k = parseInt(k, 10);
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
              }}>{I18n('CANCEL')}
              </div>
              <div className="am-picker-popup-item am-picker-popup-title">{this.props.title}</div>
              <div className="am-picker-popup-item am-picker-popup-header-right" onClick={() => {
                this.sure();
              }}>{I18n('SURE')}
              </div>
            </div>
            <List>
              {
                (this.props.data || []).map((opt) => {
                  return (
                    <CheckboxItem
                      key={opt.value}
                      checked={this.state.value[opt.value]}
                      onChange={(evt) => {
                        this.state.value[opt.value] = evt.target.checked;
                        this.tips();
                      }}
                    >
                      {opt.label}
                    </CheckboxItem>
                  )
                })
              }
              {
                this.props.allowOther === true &&
                <TextareaItem
                  title="其他"
                  defaultValue={this.state.otherValue}
                  placeholder={this.props.placeholder || "用逗号来隔开多个输入项"}
                  rows={5}
                  onChange={(value) => {
                    this.state.otherValue = value;
                    this.tips();
                  }}
                />
              }
            </List>
          </div>
        </Modal>
        <div className="am-list-item am-list-item-middle" onClick={() => {
          this.setState({visible: true})
        }}>
          <div className="am-list-line">
            <div className="am-list-content">&nbsp;</div>
            <div className="am-list-extra">{this.state.tips}</div>
            <div className="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"/>
          </div>
        </div>
      </div>
    );
  }
}

export default MultiSelector;
