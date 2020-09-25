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
    this.resetState();
  }

  resetState = () => {
    const values = {};
    this.children.forEach((child) => {
      const name = child.props.name;
      values[name] = '';
    });
    if (this.props.initialValues) {
      Object.entries(this.props.initialValues).forEach((obj) => {
        values[obj[0]] = obj[1] || '';
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
    if (!this.onFinish) {
      console.warn('Warning: Because props.onFinish is not set, the submit button is always invalid!');
      return true;
    }
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

  onChange = (value, name, label) => {
    console.log(value, name, label);
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
              if (child.props.type === 'hidden') {
                return null;
              }
              const name = child.props.name;
              const label = child.props.label || '';
              return (
                <List.Item
                  key={idx}
                  error={this.state.error[name]}
                >
                  <div className="label">
                    {
                      this.rules.required.includes(name)
                        ? <span className="required">*</span>
                        : null
                    }
                    {label}
                  </div>
                  <div className="action">
                    {
                      React.cloneElement(child, {
                        value: this.state.values[name],
                        onChange: this.onChange,
                      })
                    }
                  </div>
                  {
                    this.state.error[name] &&
                    <div className="error" onClick={() => {
                      Toast.info(this.state.error[name], 1.5);
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
