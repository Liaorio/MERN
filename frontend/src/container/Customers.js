import React from "react";
import { connect } from 'react-redux'
import { loadData, editCell } from '../actions/customerActions'

import { Card, CardText, CardHeader } from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { AgGridReact } from "@ag-grid-community/react";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";

import { AllModules } from "@ag-grid-enterprise/all-modules";

import CellRenderer from "../components/cellRenderer";
import CellEditor from "../components/cellEditor";
import ColumnFilter from "../components/columnFilter";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

class Customers extends React.Component {
  	constructor(props) {
    	super(props);
    	this.onChangeRowData = this.onChangeRowData.bind(this);
	}

	state = {
		isOpen: true,
		dialogOpen: false,
		columnDefs: [
		{
			field: "Select",
			colId: "Select",
			headerName: "",
			headerCheckboxSelection: true,
			pinned: "left",
			width: 40,
			checkboxSelection: true,
			valueFormatter: () => "",
			hide: false
		},
		{
			field: "firstName",
			colId: "firstName",
			headerName: "First Name",
			editable: true,
			cellEditorFramework: CellEditor,
			rowDataChange: (curIdx, rowTag, field, value) =>
			this.props.editCell(curIdx, rowTag, field, value)
		},
		{
			field: "lastName",
			colId: "lastName",
			headerName: "Last Name",
			editable: true,
			cellEditorFramework: CellEditor,
			rowDataChange: (curIdx, rowTag, field, value) =>
			this.props.editCell(curIdx, rowTag, field, value)
		},
		{ field: "gender", colId: "gender", headerName: "Gender" },
		{ field: "age", colId: "age", headerName: "Age" },
		{ field: "address", colId: "address", headerName: "Address" },
	],
		defaultColDef: {
			width: 200,
			cellRendererFramework: CellRenderer,
			filterFramework: ColumnFilter,
			filter: true,
			resizable: true
		},
		rowData: this.props.customers,
		count: 0,
	};

	getCellEditStatus(rowTag, field, value) {
		const originalRowData = this.state.originalRowData;
		const originalValue = originalRowData[rowTag][field].value;
		return value === originalValue ? -1 : 1;
	}

	onChangeRowData(curIdx, rowTag, field, value) {
		let rowData = [...this.state.rowData];
		let newRow = { ...rowData[rowTag] };
		const editStatus = this.getCellEditStatus(rowTag, field, value);
		const result = {};
		result.value = value;
		result.editStatus = editStatus;
		newRow[field] = result;
		newRow.Select.value = editStatus === 1 ? true : false;
		rowData[rowTag] = newRow;

		this.setState({
			rowData: rowData
		});
	}

	componentDidMount() {
		this.props.loadData();
	}

	onGridReady = params => {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
	};

	setSelectedRows() {
		this.gridApi.forEachNode(rowNode => {
			rowNode.setSelected(rowNode.data.Select.value);
		});
	}

	makeCellFromValue = parms => {
		let val = parms.value;
		let ourCell = parms.node.data[parms.column.getColId()];
		if (ourCell != null && ourCell.hasOwnProperty("value")) {
			let curIdx = parms.node.id;
			let rowTag = parms.node.data.rowTag;
			let colId = parms.column.colDef.colId;
			this.onChangeRowData(curIdx, rowTag, colId, val);
			return this.state.rowData[curIdx][colId];
		}
		return val;
	};

	contextMenuItems(params) {
		let excelFileName = "Test";
		let result = [
			"copy",
			"paste",
			"separator",
			{
				name: "Export to Excel (.xlsx)",
				action: () =>
				params.api.exportDataAsExcel({
					fileName: excelFileName,
					sheetName: excelFileName,
					processCellCallback: p => p.value.value,
					allColumns: false,
					onlySelected: false
				})
			}
		];
		return result;
	}

	getRowNum(rw) {
		return rw.rowTag < 0 ? -rw.rowTag - 1 : rw.rowTag;
	}

	componentDidUpdate() {
		this.setSelectedRows();
	}

	handleSubmit(e) {
		e.stopPropagation();
		this.setState({
			dialogOpen: true
		});
	}

	handleClose = () => {
		this.setState({
		dialogOpen: false
		});
	};

	getText() {
		return "Test";
	}

	render() {
		const actions = [
			<FlatButton label="Ok" primary={true} onClick={this.handleClose} />
		];
		console.log(this.props.customers);

    return (
    	<MuiThemeProvider>
        	<div style={{ fontFamily: "Roboto" }}>
			<h1>LEAP Repositry with core functions</h1>
			<p>Reproduce problems or bugs with Ag-grid v22.1.0</p>
			<br />
			<Dialog
				title="Dialog"
				actions={actions}
				modal={false}
				open={this.state.dialogOpen}
				onRequestClose={this.handleClose}
			>
            	{this.getText()}
          	</Dialog>
			<Card
				expanded={this.state.isOpen}
				onExpandChange={() => this.setState({ isOpen: !this.state.isOpen })}
			>
            <CardHeader title={<h3>Material-UI Card (Click to expand\collapse the Card)</h3>}
              			showExpandableButton
              			actAsExpander>
				<RaisedButton
					style={{ position: "absolute", top: 25 }}
					primary
					label={"Submit"}
					onClick={e => this.handleSubmit(e)}
				/>
            </CardHeader>

            <CardText expandable>
              	<div id="myGrid" style={{ height: '50vh', width: "100%" }} className="ag-theme-balham">
					<AgGridReact
						modules={AllModules}
						columnDefs={this.state.columnDefs}
						defaultColDef={this.state.defaultColDef}
						onGridReady={this.onGridReady}
						rowData={this.props.customers}
						suppressPropertyNamesCheck={true}
						processCellFromClipboard={this.makeCellFromValue.bind(this)}
						processCellForClipboard={p => p.value.value}
						deltaRowDataMode={true}
						getRowNodeId={this.getRowNum}
						rowSelection={"multiple"}
						enableRangeSelection={true}
						suppressRowClickSelection={true}
						suppressCopyRowsToClipboard={true}
						getContextMenuItems={this.contextMenuItems.bind(this)}
					/>
              	</div>
            </CardText>
        </Card>
    </div>
</MuiThemeProvider>
);
}
}


const mapStateToProps = state => ({
    ...state.counterReducer
});


export default connect(
    mapStateToProps, { loadData, editCell },
)(Customers)