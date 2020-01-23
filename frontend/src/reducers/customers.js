import { LOAD_DATA_SUCCESS, EDIT_CELL } from "../actions/customerActions";

const initialState = {
	customers: []
};

function getCellEditStatus(rowTag, field, value, originalRowData) {
	const originalValue = originalRowData[rowTag][field].value;
	return value === originalValue ? -1 : 1;
}

export const counterReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_DATA_SUCCESS:
			return {
				...state,
				customers: action.data
			};

		case EDIT_CELL:	
			const rowData = [...state.customers];
			const { rowTag, field, value } = action;
			let newRow = { ...rowData[rowTag] };
			const editStatus = getCellEditStatus(rowTag, field, value, rowData);
			const result = {};
			result.value = value;
			result.editStatus = editStatus;
			newRow[field] = result;
			newRow.Select.value = editStatus === 1 ? true : false;
			rowData[rowTag] = newRow;

			return {
				...state,
				customers: rowData
			}

		default:
			return state;
	}
};