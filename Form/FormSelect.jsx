import React, {Component} from 'react';
import {Picker, List} from 'antd-mobile';
import {MultiSelector} from "../index";

class FormSelect extends Component {
  constructor(props) {
    super(props);

    this.multiple = false;
    if (typeof this.props.multiple === 'boolean') {
      this.multiple = this.props.multiple;
    }
  }

  onChange = (val) => {
    this.props.onChange(val[0], this.props.name, this.props.label);
  }

  onChangeMulti = (val) => {
    this.props.onChange(val, this.props.name, this.props.label);
  }

  value = () => {
    return [this.props.value];
  }

  render() {
    return (
      this.multiple
        ?
        <MultiSelector
          title={this.props.label || 'title'}
          data={this.props.options}
          value={this.props.value}
          onChange={this.onChangeMulti}
        />
        :
        <Picker
          data={this.props.options}
          cols={1}
          title={this.props.label || 'title'}
          value={this.value()}
          onChange={this.onChange}>
          <List.Item arrow="horizontal">&nbsp;</List.Item>
        </Picker>
    );
  }
}

export default FormSelect;
