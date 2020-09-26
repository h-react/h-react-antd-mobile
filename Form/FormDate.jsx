import React, {Component} from 'react';
import {List, DatePicker} from 'antd-mobile';
import {I18n} from "../index";
import * as m from "moment";

class FormSelect extends Component {
  constructor(props) {
    super(props);

    this.mode = this.props.mode || 'date';
  }

  onChange = (val) => {
    this.props.onChange(m(val), this.props.name, this.props.label);
  }

  value = () => {
    let v = this.props.value;
    if (typeof v === 'object') {
      v = v.toDate();
    } else if (typeof v === 'number') {
      if (this.props.millisecond !== true) {
        v = v * 1000;
      }
      v = new Date(v);
    }
    return v;
  }

  format = (Date) => {
    const _m = m(Date)
    const _t = this.props.use12Hours ? 'LT' : 'HH:ss';
    if (this.mode === 'date') {
      return _m.format('YYYY-MM-DD');
    } else if (this.mode === 'time') {
      return _m.format(_t);
    } else if (this.mode === 'year') {
      return _m.format('YYYY');
    } else if (this.mode === 'month') {
      return _m.format('YYYY-MM');
    }
    return _m.format('YYYY-MM-DD ' + _t);
  }

  render() {
    return (
      <DatePicker
        mode={this.mode}
        extra={I18n('PLEASE_CHOOSE')}
        value={this.value()}
        format={this.format}
        onChange={this.onChange}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        use12Hours={this.props.use12Hours}
      >
        <List.Item arrow="horizontal">&nbsp;</List.Item>
      </DatePicker>
    );
  }
}

export default FormSelect;
