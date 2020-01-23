export const LOAD_DATA = "LOAD_DATA";
export const LOAD_DATA_SUCCESS = "LOAD_DATA_SUCCESS";
export const EDIT_CELL = "EDIT_CELL";


export const loadData = () => ({
	type: LOAD_DATA
})

export const LoadDataSuccess = customerData => ({
	type: LOAD_DATA_SUCCESS, 
	data: customerData
})

export const editCell = (curIdx, rowTag, field, value) => ({
	type: EDIT_CELL,
	curIdx, rowTag, field, value
})