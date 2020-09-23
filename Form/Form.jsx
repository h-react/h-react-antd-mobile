import './Form.less';
import React, {Component} from 'react';
import {Button, List, Toast, WhiteSpace, WingBlank} from "antd-mobile";
import {I18n} from "../index";

class Form extends Component {
  constructor(props) {
    super(props);

    this.rules = this.props.rules || {
      required: [],
    };
    this.onFinish = this.props.onFinish;

    this.children = this.props.children;
    if (!Array.isArray(this.children)) {
      this.children = [this.children];
    }

    const values = {};
    if (this.props.initialValues) {
      Object.entries(this.props.initialValues).forEach((obj) => {
        values[obj[0]] = obj[1];
      })
    }
    this.resetState();
  }

  resetState = () => {
    const values = {};
    if (this.props.initialValues) {
      Object.entries(this.props.initialValues).forEach((obj) => {
        values[obj[0]] = obj[1];
      })
    }
    this.state = {
      loading: false,
      disabled: this.rules.required.length > 0,
      values: values,
      error: {},
    }
  }

  /**
   * 判断表单按钮是否无效
   * @returns {boolean}
   */
  disabled = () => {
    let res = false;
    if (this.state.loading) {
      return true;
    }
    if (this.rules) {
      // 必填决策
      if (Array.isArray(this.rules.required)) {
        for (let i in this.rules.required) {
          const r = this.rules.required[i];
          if (!this.state.values[r]) {
            res = true;
            break;
          }
        }
      }
    }
    return res;
  }

  onReset = () => {
    this.resetState();
    this.setState(this.state);
  }

  onChange = (evt) => {
    const component = evt.target;
    const type = component.type;
    const name = component.name;
    const label = component.label || component.getAttribute('label') || name;
    console.log(type, name, label);
    if (!name) return;
    let value = undefined;
    console.log(type);
    switch (type) {
      case 'input':
      case 'text':
      case 'textarea':
      default:
        value = component.value;
        break;
    }
    this.state.values[name] = value;
    this.state.error[name] = undefined;
    // 规则校验
    if (this.rules) {
      if (Array.isArray(this.rules.required)) {
        // 必填
        if (this.rules.required.includes(name) && !value) {
          this.state.error[name] = I18n('PLEASE_INPUT') + label;
        }
      }
    }
    console.log(type, this.state);
    this.setState({
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
                      value: this.state.values[name],
                      onChange: this.onChange,
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
            style={this.props.btnStyle || null}
            type="primary"
            size="small"
            loading={this.state.loading}
            disabled={this.disabled()}
            onClick={
              () => {
                this.setState({loading: true});
                if (typeof this.onFinish === 'function') {
                  this.onFinish(this.state.values, {
                    reset: () => {
                      this.onReset();
                    },
                    complete: () => {
                      this.setState({loading: false});
                    }
                  });
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
