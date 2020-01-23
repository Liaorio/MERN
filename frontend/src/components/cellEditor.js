import React from "react";
import TextField from "material-ui/TextField";

export default class cellEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			...props.value
		};
		this.onChangeHandler = this.onChangeHandler.bind(this);
  	}	

	onChangeHandler = event => {
		this.setState({
			value: event.target.value
		});
	};

	componentWillUnmount() {
		let handler = this.props.column.colDef.rowDataChange;
		let curIdx = this.props.node.id;
		let rowTag = this.props.node.data.rowTag;
		let field = this.props.column.colDef.field;
		let value = this.state.value;
		if (handler) {
			handler(curIdx, rowTag, field, value);
		}
	}

	//why we need this useless function?
	getValue() {
		this.setState({
			value: this.state.value
		});
		return this.state;
	}

	isCancelAfterEnd() {
		return true;
	}

  render() {
  		let ourCellData = this.state;
  		let ourValue = ourCellData.value;
  		let cellStyles = {
  			backgroundColor: "#feca57"
  		};
  		let curIdx = this.props.node.id;
  		let colId = this.props.column.colId;
  		let uniqueId = curIdx + "_" + colId;
  		let nonNullValue = ourValue == null ? "" : ourValue;
		return (
			<TextField
				ref="input"
				style={{ height: 25 }}
				inputStyle={cellStyles}
				underlineShow={false}
				id={uniqueId}
				defaultValue={nonNullValue}
				onChange={this.onChangeHandler}
				onBlur={this.onBlurHandler}
				fullWidth={true}
			/>
		);
  }
}
