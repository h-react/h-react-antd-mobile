import React, {Component} from 'react';
import {Picker, List} from 'antd-mobile';

class FormCascader extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (val) => {
    this.props.onChange(val, this.props.name, this.props.label);
  }

  render() {
    return (
      <Picker
        data={this.props.options}
        title={this.props.label || 'title'}
        value={this.props.value}
        onChange={this.onChange}>
        <List.Item arrow="horizontal">&nbsp;</List.Item>
      </Picker>
    );
  }
}

export default FormCascader;
