import './Form.less';
import React, {Component} from 'react';
import {Button, List, TextareaItem, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {History, I18n} from "../index";

class Form extends Component {
  constructor(props) {
    super(props);

    this.initialValues = this.props.initialValues || {};
    this.rules = this.props.rules || {
      required: [],
    };
    this.onFinish = this.props.onFinish;

    this.children = this.props.children;
    if (!Array.isArray(this.children)) {
      this.children = [this.children];
    }

    this.state = {
      disabled: this.rules.required.length > 0,
      values: {},
      error: {},
    }
  }

  onChange = (evt) => {
    const target = evt.target;
    const targetType = target.type;
    const name = target.name;
    const label = target.label || target.getAttribute('label') || name;
    if (!name) return;
    let value = undefined;
    console.log(targetType);
    switch (targetType) {
      case 'input':
      case 'text':
      case 'textarea':
      default:
        value = target.value;
        break;
    }
    this.state.disabled = false;
    this.state.values[name] = value;
    this.state.error[name] = undefined;
    // 规则校验
    if (this.rules) {
      if (Array.isArray(this.rules.required)) {
        // 按钮失效 disabled
        for (let i in this.rules.required) {
          if (!this.state.values[this.rules.required[i]]) {
            this.state.disabled = true;
            break;
          }
        }
        // 必填 required
        if (this.rules.required.includes(name) && !value) {
          this.state.error[name] = I18n('PLEASE_INPUT') + label;
        }
      }
    }
    this.setState({
      disabled: this.state.disabled,
      values: this.state.values,
      error: this.state.error,
    });
  }

  render() {
    return (
      <div className="h-react-form">
        <List
          className="form"
          renderHeader={this.props.renderHeader ? () => this.props.renderHeader : null}
          renderFooter={this.props.renderFooter ? () => this.props.renderFooter : null}
          onChange={this.onChange}
        >
          {
            this.children.map((child, idx) => {
              const name = child.props.name;
              const label = child.props.label || '';
              return (
                <List.Item
                  key={idx}
                  error={true}
                >
                  <span className="label">
                    {
                      this.rules.required.includes(name)
                        ? <span className="required">*</span>
                        : null
                    }
                    {label}
                  </span>
                  {
                    React.cloneElement(child, {
                      defaultValue: this.initialValues[name] || undefined,
                    })
                  }
                  {
                    this.state.error[name] &&
                    <span className="error" onClick={() => {
                      Toast.info(this.state.error[name]);
                    }}/>
                  }
                </List.Item>
              );
            })
          }
        </List>
        <WhiteSpace/>
        <WingBlank>
          <Button
            type="primary"
            size="small"
            disabled={this.state.disabled}
            onClick={
              () => {
                if (typeof this.onFinish === 'function') {
                  this.onFinish(this.state.values);
                }
              }
            }>{I18n('submit')}</Button>
        </WingBlank>
        <WhiteSpace/>
      </div>
    );
  }
}

export default Form;
