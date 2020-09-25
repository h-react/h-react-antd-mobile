import React, {Component} from 'react';
import FormCascader from './FormCascader';
import data from "./assets/provincial.json";

class FormProvincial extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormCascader
        options={data}
        name={this.props.name}
        label={this.props.label}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

export default FormProvincial;
