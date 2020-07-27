import './MultiSelector.less';
import React, {Component} from 'react';
import {Button, WingBlank, List, Modal, Checkbox, TextareaItem, WhiteSpace} from "antd-mobile";
import Parse from "../Parse";
import {I18n} from "../index";

class MultiSelector extends Component {
  constructor(props) {
    super(props);

    this.currentLabels = [];
    this.state = {
      tips: '',
      value: {},
      otherValue: '',
    }

    // 初始化
    props.data.forEach((opt) => {
      this.state.value[opt.value] = false;
      this.currentLabels.push(opt.label);
      if (props.value !== undefined && props.value.length > 0) {
        if (props.value.includes(opt.value) === true) {
          this.state.value[opt.value] = true;
        }
      }
    });
    if (props.otherValue !== undefined) {
      this.state.otherValue = props.otherValue.join(',');
    }
  }

  componentDidMount() {
    this.tips();
  }

  toggleModal = (key, status = false) => {
    this.setState({
      [key + "ModalVisible"]: status
    })
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
          visible={this.state.workModalVisible}
          onClose={() => {
            this.toggleModal('work')
          }}
          animationType="slide-up"
        >
          <List className="components-multi-selector-list">
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
                  this.setState({
                    data: this.state.data
                  });
                  this.tips();
                }}
              />
            }
          </List>
          <WhiteSpace/>
          <WingBlank>
            <Button type="primary" size="small" onClick={() => {
              if (typeof this.props.onChange === 'function') {
                this.props.onChange(...this.formatter())
              }
              this.toggleModal('work')
            }}>{I18n('SURE')}</Button>
          </WingBlank>
          <WhiteSpace/>
        </Modal>
        <Item
          extra={this.state.tips}
          arrow="horizontal"
          onClick={() => {
            this.toggleModal('work', true);
          }}
        >{this.props.children}</Item>
      </div>
    );
  }
}

export default MultiSelector;
