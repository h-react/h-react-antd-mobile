import React, {Component} from 'react';
import {I18n, Navigator, History} from "../index";
import {InputItem} from "antd-mobile";

class FormInput2 extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (evt) => {
    this.props.onChange(evt.target.value, this.props.name, this.props.label);
  }

  onChangeAntd = (value) => {
    this.props.onChange(value, this.props.name, this.props.label);
  }

  render() {
    const type = this.props.type || 'text';
    let component = null;
    switch (type) {
      case "integer":
      case "int":
        if (Navigator.isDevice('ios')) {
          component = (
            <input
              type="text"
              placeholder={I18n("PLEASE_INPUT") + this.props.label}
              pattern="[0-9]*"
              value={this.props.value || ''}
              onChange={this.onChange}
            />
          );
        } else {
          component = (
            <input
              type="number"
              placeholder={I18n("PLEASE_INPUT") + this.props.label}
              value={this.props.value}
              onChange={this.onChange}
            />
          );
        }
        break;
      case "phone":
      case "tel":
        component = (
          <input
            type="tel"
            placeholder={I18n("PLEASE_INPUT") + this.props.label}
            value={this.props.value || ''}
            onChange={this.onChange}
          />
        );
        break;
      case "number":
      case "digit":
      case "money":
        component = (
          <InputItem
            className={Navigator.isDevice('ios') ? 'iphone' : ''}
            type="money"
            placeholder={I18n("PLEASE_INPUT") + this.props.label}
            moneyKeyboardAlign="left"
            // moneyKeyboardWrapProps={History.state.moneyKeyboardWrapProps}
            onChange={this.onChangeAntd}
            extra={this.props.extra}
          />
        );
        break;
      default:
        component = (
          <input
            type={type}
            placeholder={I18n("PLEASE_INPUT") + this.props.label}
            value={this.props.value}
            onChange={this.onChange}
          />
        );
        break;
    }
    return component;
  }
}

export default FormInput2;
