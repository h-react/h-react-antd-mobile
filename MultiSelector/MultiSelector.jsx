import './MultiSelector.less';
import React, {Component} from 'react';
import {Button, WingBlank, List, Modal, Checkbox, TextareaItem, WhiteSpace} from "antd-mobile";

class MultiSelector extends Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      data: {
        value: [],
        other: [],
      }
    }

  }

  toggleModal = (key, status = false) => {
    this.setState({
      [key + "ModalVisible"]: status
    })
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
                return <CheckboxItem
                  key={opt.value}
                  onChange={(evt) => {
                    console.log(evt);
                  }}
                >
                  {opt.label}
                </CheckboxItem>
              })
            }
            {
              this.props.other === true &&
              <TextareaItem
                title="其他"
                placeholder={this.props.placeholder || "用逗号来隔开多个输入项"}
                rows={5}
                onChange={(value) => {
                  this.state.form.reason1 = value;
                  this.setState({
                    form: this.state.form
                  })
                }}
              />
            }
          </List>
          <WhiteSpace/>
          <WingBlank>
            <Button type="primary" size="small" onClick={() => {
              this.toggleModal('work')
            }}>确定</Button>
          </WingBlank>
          <WhiteSpace/>
        </Modal>
        <Item
          extra="请选择"
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
