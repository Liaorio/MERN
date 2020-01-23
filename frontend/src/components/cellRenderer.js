import React, { Component } from "react";
import TextField from "material-ui/TextField";

export default class CubeRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.valueCubed()
    };
  }

  valueCubed() {
    return this.props.value && this.props.value.value ? this.props.value.value : null;
  }

  render() {
    const editStatus = this.props.value && this.props.value.editStatus ? this.props.value.editStatus : 0;
    let style = {};
    if (editStatus === -1 || editStatus === 1) {
      style.background = "#94e2ff";
      if (editStatus === 1) {
        style.fontWeight = 700;
        style.color = "#0000FF";
      }
    }
    const uniqeId = this.props.rowTag + "_" + this.props.colId;
    //console.log("render");
    return (
      <TextField
        id={uniqeId}
        style={{ height: 24 }}
        inputStyle={style}
        underlineShow={false}
        value={this.state.value}
        fullWidth={true}
        readOnly={true}
      />
    );
    //return <span>{this.state.value}</span>;
  }
}
