import React, {Component} from 'react';
import FormCascader from './FormCascader';
import data from "./assets/municipal.json";

class FormMunicipal extends Component {
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

export default FormMunicipal;
